import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { createReview, getMyReviewForRecipe } from "../controllers/review.controller";

const router = Router();

router.post("/", requireAuth, createReview);
router.get("/mine-for/:recipeId", requireAuth, getMyReviewForRecipe);

export default router;
