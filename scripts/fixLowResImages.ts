import "dotenv/config";
import mongoose from "mongoose";
import { Recipe } from "../src/models/Recipe";

/**
 * One-off data fix: recipes seeded before seedRecipes.ts requested
 * higher-resolution Unsplash images (w=600&h=400) still have the low-res
 * URLs stored, which look stretched/soft on the new full-bleed hero.
 * Bumps them to the same photo at w=1600&h=1000&q=80.
 * Run: `npx ts-node scripts/fixLowResImages.ts`
 */
async function main() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const recipes = await Recipe.find({ imageUrl: /w=600&h=400&fit=crop/ });
  let modified = 0;
  for (const recipe of recipes) {
    recipe.imageUrl = recipe.imageUrl.replace(
      "w=600&h=400&fit=crop",
      "w=1600&h=1000&fit=crop&q=80"
    );
    await recipe.save();
    modified += 1;
  }

  console.log(`Matched ${recipes.length}, modified ${modified} recipes.`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Fix failed:", err);
  process.exit(1);
});
