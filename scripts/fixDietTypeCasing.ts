import "dotenv/config";
import mongoose from "mongoose";
import { Recipe } from "../src/models/Recipe";

/**
 * One-off data fix: seeded recipes still carried capitalized dietType
 * values ("Vegetarian", "Vegan") from before the taxonomy was normalized to
 * lowercase. The frontend's diet-label lookup is keyed by lowercase value,
 * so these rendered as an empty badge. Normalizes them to match the app's
 * canonical lowercase DietType taxonomy.
 * Run: `npx ts-node scripts/fixDietTypeCasing.ts`
 */
async function main() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const result = await Recipe.updateMany({ dietType: "Vegetarian" }, { $set: { dietType: "vegetarian" } });
  const result2 = await Recipe.updateMany({ dietType: "Vegan" }, { $set: { dietType: "vegan" } });

  console.log(`Vegetarian -> vegetarian: matched ${result.matchedCount}, modified ${result.modifiedCount}`);
  console.log(`Vegan -> vegan: matched ${result2.matchedCount}, modified ${result2.modifiedCount}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Fix failed:", err);
  process.exit(1);
});
