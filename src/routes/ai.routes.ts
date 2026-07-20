import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  generateRecipeHandler,
  chatHandler,
  chatStreamHandler,
} from "../controllers/ai.controller";

const router = Router();

router.post("/generate-recipe", requireAuth, generateRecipeHandler);
router.post("/chat", requireAuth, chatHandler);
router.post("/chat/stream", requireAuth, chatStreamHandler);

export default router;
