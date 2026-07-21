import "dotenv/config";
import mongoose from "mongoose";
import { Recipe } from "../src/models/Recipe";

/**
 * One-off cleanup: removes the leftover "Vegetable" test recipe
 * (_id 6a5e3737193902812fbd815e) created during manual testing.
 * Run: `npx ts-node scripts/deleteVegetableTestRecipe.ts`
 */
async function main() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const result = await Recipe.deleteOne({ _id: "6a5e3737193902812fbd815e", title: "Vegetable" });
  console.log(`Deleted count: ${result.deletedCount}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Delete failed:", err);
  process.exit(1);
});
