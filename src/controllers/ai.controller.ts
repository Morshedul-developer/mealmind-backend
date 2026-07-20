import { Response } from "express";
import { z } from "zod";
import { AuthedRequest } from "../middleware/auth.middleware";
import { generateRecipe, chatWithAssistant, streamChatWithAssistant } from "../services/ai.service";
import { Conversation } from "../models/Conversation";
import { Recipe } from "../models/Recipe";

const generateSchema = z.object({
  ingredients: z.array(z.string()).min(1),
  cuisineType: z.string(),
  dietType: z.string(),
  length: z.enum(["quick", "detailed"]),
});

// POST /api/ai/generate-recipe - protected
export async function generateRecipeHandler(req: AuthedRequest, res: Response) {
  const parsed = generateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.flatten() });
  }

  try {
    const recipe = await generateRecipe(parsed.data);
    res.json({ success: true, data: recipe });
  } catch (err) {
    res.status(502).json({ success: false, error: "AI generation failed, try again" });
  }
}

const chatSchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().optional(),
  recipeId: z.string().optional(),
});

// POST /api/ai/chat - protected, non-streaming version
export async function chatHandler(req: AuthedRequest, res: Response) {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.flatten() });
  }

  const { message, conversationId, recipeId } = parsed.data;

  let conversation = conversationId
    ? await Conversation.findById(conversationId)
    : await Conversation.create({ userId: req.user!.id, recipeId, messages: [] });

  if (!conversation) {
    return res.status(404).json({ success: false, error: "Conversation not found" });
  }

  conversation.messages.push({ role: "user", content: message, timestamp: new Date() });

  const recipe = recipeId ? await Recipe.findById(recipeId) : null;
  const recipeContext = recipe ? `${recipe.title}: ${recipe.shortDescription}` : undefined;

  const reply = await chatWithAssistant(conversation.messages, recipeContext);
  conversation.messages.push({ role: "assistant", content: reply, timestamp: new Date() });
  await conversation.save();

  res.json({ success: true, data: { conversationId: conversation._id, reply } });
}

// POST /api/ai/chat/stream - protected, SSE streaming for the typing/streaming UI
export async function chatStreamHandler(req: AuthedRequest, res: Response) {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.flatten() });
  }

  const { message, conversationId, recipeId } = parsed.data;

  let conversation = conversationId
    ? await Conversation.findById(conversationId)
    : await Conversation.create({ userId: req.user!.id, recipeId, messages: [] });

  if (!conversation) {
    return res.status(404).json({ success: false, error: "Conversation not found" });
  }

  conversation.messages.push({ role: "user", content: message, timestamp: new Date() });

  const recipe = recipeId ? await Recipe.findById(recipeId) : null;
  const recipeContext = recipe ? `${recipe.title}: ${recipe.shortDescription}` : undefined;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullReply = "";
  for await (const chunk of streamChatWithAssistant(conversation.messages, recipeContext)) {
    fullReply += chunk;
    res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
  }

  conversation.messages.push({ role: "assistant", content: fullReply, timestamp: new Date() });
  await conversation.save();

  res.write(`data: ${JSON.stringify({ done: true, conversationId: conversation._id })}\n\n`);
  res.end();
}
