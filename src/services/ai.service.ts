import Groq from "groq-sdk";
import { IChatMessage } from "../models/Conversation";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export interface GenerateRecipeInput {
  ingredients: string[];
  cuisineType: string;
  dietType: string;
  length: "quick" | "detailed";
}

export interface GeneratedRecipe {
  title: string;
  shortDescription: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

/**
 * AI Feature 1: Content Generator.
 * Returns structured JSON so the frontend can render it as a normal
 * recipe card/detail view, per CLAUDE.md.
 */
export async function generateRecipe(
  input: GenerateRecipeInput
): Promise<GeneratedRecipe> {
  const lengthInstruction =
    input.length === "quick"
      ? "Keep instructions to 4-6 short steps."
      : "Give detailed, step-by-step instructions (8-12 steps) with technique notes.";

  const prompt = `You are a professional recipe developer. Create one recipe using
mainly these ingredients: ${input.ingredients.join(", ")}.
Cuisine: ${input.cuisineType}. Diet type: ${input.dietType}. ${lengthInstruction}

Respond with ONLY valid JSON, no markdown fences, matching exactly this shape:
{
  "title": string,
  "shortDescription": string (max 160 chars),
  "ingredients": string[] (with quantities),
  "instructions": string[],
  "prepTimeMinutes": number,
  "difficulty": "Easy" | "Medium" | "Hard"
}`;

  const response = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 1500,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error("Groq did not return a text response");
  }

  try {
    return JSON.parse(text) as GeneratedRecipe;
  } catch {
    throw new Error("Failed to parse AI recipe response as JSON");
  }
}

/**
 * AI Feature 2: Chat Assistant.
 * Groq has no memory between calls, so the full message history is
 * sent every time (per CLAUDE.md) - the Conversation document in Mongo
 * is the source of truth for history, not Groq.
 */
export async function chatWithAssistant(
  history: IChatMessage[],
  recipeContext?: string
): Promise<string> {
  const systemPrompt = recipeContext
    ? `You are MealMind AI's in-app cooking assistant. The user is currently viewing this recipe: ${recipeContext}. Answer questions, suggest substitutions, and give follow-up cooking help. Be concise and practical.`
    : `You are MealMind AI's in-app cooking assistant. Answer questions and give practical cooking help. Be concise.`;

  const response = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 800,
    messages: [
      { role: "system", content: systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m.content })),
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}

/**
 * Streaming variant for the chat assistant (frontend typing-indicator +
 * streamed bubble). Use with Server-Sent Events in the controller.
 */
export async function* streamChatWithAssistant(
  history: IChatMessage[],
  recipeContext?: string
): AsyncGenerator<string> {
  const systemPrompt = recipeContext
    ? `You are MealMind AI's in-app cooking assistant. The user is currently viewing this recipe: ${recipeContext}. Be concise and practical.`
    : `You are MealMind AI's in-app cooking assistant. Be concise.`;

  const stream = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 800,
    messages: [
      { role: "system", content: systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m.content })),
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) {
      yield delta;
    }
  }
}
