import { Response, NextFunction } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import { Recipe } from "../models/Recipe";
import { AuthedRequest } from "../middleware/auth.middleware";

const createRecipeSchema = z.object({
  title: z.string().min(3),
  shortDescription: z.string().min(10),
  fullDescription: z.string().min(20),
  ingredients: z.array(z.string()).min(1),
  instructions: z.array(z.string()).min(1),
  cuisineType: z.string(),
  dietType: z.string(),
  prepTimeMinutes: z.number().positive(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  imageUrl: z.string().url().optional(),
});

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/recipes - powers the Explore page: search + filters + sort + pagination
export async function listRecipes(req: AuthedRequest, res: Response) {
  const {
    search,
    cuisineType,
    dietType,
    difficulty,
    prepTimeMin,
    prepTimeMax,
    minRating,
    sort = "newest",
    page = "1",
    limit = "12",
  } = req.query;

  const filter: Record<string, unknown> = {};
  // Case-insensitive exact match: seeded/legacy data isn't consistently
  // cased against the frontend's lowercase cuisineType/dietType values.
  if (cuisineType) {
    filter.cuisineType = { $regex: `^${escapeRegex(String(cuisineType))}$`, $options: "i" };
  }
  if (dietType) {
    filter.dietType = { $regex: `^${escapeRegex(String(dietType))}$`, $options: "i" };
  }
  if (difficulty) filter.difficulty = difficulty;
  if (prepTimeMin || prepTimeMax) {
    filter.prepTimeMinutes = {
      ...(prepTimeMin ? { $gte: Number(prepTimeMin) } : {}),
      ...(prepTimeMax ? { $lte: Number(prepTimeMax) } : {}),
    };
  }
  if (minRating) filter.ratingAverage = { $gte: Number(minRating) };
  if (search) {
    // Substring match (not $text, which only matches whole words) so
    // partial queries like "cl" still match "Classic Beef Ramen".
    const searchRegex = { $regex: escapeRegex(String(search)), $options: "i" };
    filter.$or = [{ title: searchRegex }, { shortDescription: searchRegex }];
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    rating: { ratingAverage: -1 },
    quickest: { prepTimeMinutes: 1 },
    prepTime: { prepTimeMinutes: 1 },
  };

  const pageNum = Math.max(1, parseInt(String(page), 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(String(limit), 10)));

  const [items, total] = await Promise.all([
    Recipe.find(filter)
      .sort(sortMap[String(sort)] ?? sortMap.newest)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Recipe.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      items,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    },
  });
}

// GET /api/recipes/:id - public details page
export async function getRecipeById(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, error: "Invalid recipe ID" });
  }

  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, error: "Recipe not found" });
    }

    const related = await Recipe.find({
      _id: { $ne: recipe._id },
      cuisineType: recipe.cuisineType,
    }).limit(4);

    res.json({ success: true, data: { recipe, related } });
  } catch (err) {
    next(err);
  }
}

// POST /api/recipes - protected, /items/add
export async function createRecipe(req: AuthedRequest, res: Response) {
  const parsed = createRecipeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.flatten() });
  }

  const recipe = await Recipe.create({
    ...parsed.data,
    createdBy: req.user!.id,
  });

  res.status(201).json({ success: true, data: recipe });
}

// GET /api/recipes/mine - protected, /items/manage
export async function listMyRecipes(req: AuthedRequest, res: Response) {
  const recipes = await Recipe.find({ createdBy: req.user!.id }).sort({ createdAt: -1 });
  res.json({ success: true, data: recipes });
}

// DELETE /api/recipes/:id - protected, /items/manage
export async function deleteRecipe(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, error: "Invalid recipe ID" });
  }

  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, error: "Recipe not found" });
    }
    if (recipe.createdBy.toString() !== req.user!.id) {
      return res.status(403).json({ success: false, error: "Not your recipe" });
    }

    await recipe.deleteOne();
    res.json({ success: true, data: { deletedId: req.params.id } });
  } catch (err) {
    next(err);
  }
}
