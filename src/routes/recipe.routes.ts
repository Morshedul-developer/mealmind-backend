import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  listRecipes,
  getRecipeById,
  createRecipe,
  listMyRecipes,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipe.controller";

const router = Router();

// Public
router.get("/", listRecipes);
router.get("/mine", requireAuth, listMyRecipes); // before /:id so "mine" isn't read as an id
router.get("/:id", getRecipeById);

// Protected
router.post("/", requireAuth, createRecipe);
router.put("/:id", requireAuth, updateRecipe);
router.delete("/:id", requireAuth, deleteRecipe);

export default router;
