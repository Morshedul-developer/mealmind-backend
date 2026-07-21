import "dotenv/config";
import mongoose from "mongoose";
import { Recipe } from "../src/models/Recipe";

/**
 * One-off data fix: recipes seeded before seedRecipes.ts was corrected still
 * have dietType "Non-Veg", which isn't part of the frontend's diet taxonomy
 * (vegan/vegetarian/keto/paleo/gluten-free/dairy-free/none) and is therefore
 * unfilterable from the Explore page. Normalizes them to "none".
 * Run: `npx ts-node scripts/fixNonVegDietType.ts`
 */
async function main() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const result = await Recipe.updateMany(
    { dietType: "Non-Veg" },
    { $set: { dietType: "none" } }
  );

  console.log(`Matched ${result.matchedCount}, modified ${result.modifiedCount} recipes.`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Fix failed:", err);
  process.exit(1);
});
