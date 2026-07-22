import { Response, NextFunction } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import { Recipe } from "../models/Recipe";
import { Review } from "../models/Review";
import { AuthedRequest } from "../middleware/auth.middleware";

const createReviewSchema = z.object({
  recipeId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10),
});

async function syncRecipeRating(recipeId: mongoose.Types.ObjectId) {
  const [stats] = await Review.aggregate<{ _id: null; average: number; count: number }>([
    { $match: { recipeId } },
    { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  await Recipe.findByIdAndUpdate(recipeId, {
    ratingAverage: stats ? Math.round(stats.average * 10) / 10 : 0,
    ratingCount: stats ? stats.count : 0,
  });
}

// POST /api/reviews - protected
export async function createReview(req: AuthedRequest, res: Response, next: NextFunction) {
  const parsed = createReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.flatten() });
  }

  const { recipeId, rating, comment } = parsed.data;
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ success: false, error: "Invalid recipe ID" });
  }

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, error: "Recipe not found" });
    }

    const existing = await Review.findOne({ recipeId, userId: req.user!.id });
    if (existing) {
      return res.status(409).json({ success: false, error: "You have already reviewed this recipe" });
    }

    const review = await Review.create({
      recipeId,
      userId: req.user!.id,
      rating,
      comment,
    });

    await syncRecipeRating(review.recipeId);

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    // Race condition fallback - the unique index is the real guard.
    if ((err as { code?: number }).code === 11000) {
      return res.status(409).json({ success: false, error: "You have already reviewed this recipe" });
    }
    next(err);
  }
}

// GET /api/reviews/mine-for/:recipeId - protected
export async function getMyReviewForRecipe(req: AuthedRequest, res: Response, next: NextFunction) {
  const { recipeId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ success: false, error: "Invalid recipe ID" });
  }

  try {
    const review = await Review.findOne({ recipeId, userId: req.user!.id });
    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
}
