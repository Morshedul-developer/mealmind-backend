import "dotenv/config";
import { generateRecipe } from "../src/services/ai.service";

/**
 * Ad-hoc check that Groq is wired up correctly. Calls the AI service
 * function directly, bypassing auth/HTTP. Run: `npx ts-node scripts/testGroq.ts`
 */
async function testGroq() {
  try {
    const recipe = await generateRecipe({
      ingredients: ["chicken", "garlic", "lemon"],
      cuisineType: "Mediterranean",
      dietType: "Non-Veg",
      length: "quick",
    });
    console.log("Groq responded successfully:\n");
    console.log(JSON.stringify(recipe, null, 2));
  } catch (err) {
    console.error("Groq call failed:", (err as Error).message);
    process.exit(1);
  }
}

testGroq();
