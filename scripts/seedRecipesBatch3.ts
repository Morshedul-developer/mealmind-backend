import "dotenv/config";
import mongoose from "mongoose";
import { Recipe } from "../src/models/Recipe";

/**
 * Closes the last 4 cuisine x diet gaps (vegan for Mediterranean,
 * Chinese, French, Korean), bringing the total to 40 with full
 * coverage. Owned by the seeded demo user (scripts/seedDemoUser.ts).
 * Run: `npx ts-node scripts/seedRecipesBatch3.ts`
 */

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?w=1600&h=1000&fit=crop&q=80`;

const RECIPES = [
  {
    title: "Classic Falafel Wrap",
    shortDescription: "Crispy chickpea falafel wrapped with tahini and veg.",
    fullDescription:
      "Golden, herb-flecked falafel made from spiced ground chickpeas, deep-fried until crackly-crisp, wrapped in warm pita with tahini sauce, tomato, and pickles.",
    ingredients: [
      "2 cups dried chickpeas, soaked overnight",
      "1 onion, roughly chopped",
      "3 cloves garlic",
      "1 cup fresh parsley",
      "1 cup fresh cilantro",
      "1 tsp cumin",
      "1 tsp coriander",
      "1/2 tsp baking soda",
      "4 pita breads",
      "3 tbsp tahini, thinned with lemon and water",
      "Tomato, cucumber, and pickles, sliced",
    ],
    instructions: [
      "Pulse soaked (uncooked) chickpeas, onion, garlic, parsley, and cilantro in a food processor until finely ground but not pureed.",
      "Mix in cumin, coriander, and baking soda, then chill the mixture for 30 minutes.",
      "Form into small patties and deep-fry until deeply golden and crisp.",
      "Warm the pita breads.",
      "Fill with falafel, tahini sauce, tomato, cucumber, and pickles.",
    ],
    cuisineType: "Mediterranean",
    dietType: "vegan",
    prepTimeMinutes: 45,
    difficulty: "Medium",
    imageUrl: photo("1615870216519-2f9fa575fa5c"),
    ratingAverage: 4.6,
    ratingCount: 138,
  },
  {
    title: "Vegan Mapo Tofu",
    shortDescription: "Silken tofu simmered in a numbing Sichuan chili sauce.",
    fullDescription:
      "Soft tofu simmered in a fiery, tongue-tingling sauce built from doubanjiang and Sichuan peppercorns, with mushrooms standing in for the traditional ground pork.",
    ingredients: [
      "1 block silken tofu, cubed",
      "1 cup mushrooms, finely chopped",
      "2 tbsp doubanjiang (spicy bean paste)",
      "1 tsp Sichuan peppercorns, ground",
      "2 cloves garlic, minced",
      "1 tbsp ginger, minced",
      "1 cup vegetable stock",
      "1 tbsp soy sauce",
      "1 tbsp cornstarch, slurried",
      "2 scallions, sliced",
    ],
    instructions: [
      "Sauté garlic, ginger, and chopped mushrooms in oil until fragrant.",
      "Stir in doubanjiang and half the ground Sichuan peppercorns, cook until fragrant.",
      "Add vegetable stock and soy sauce, bring to a simmer.",
      "Gently slide in tofu cubes and simmer 5 minutes without stirring too hard.",
      "Thicken with the cornstarch slurry.",
      "Garnish with scallions and remaining Sichuan peppercorns, serve over rice.",
    ],
    cuisineType: "Chinese",
    dietType: "vegan",
    prepTimeMinutes: 25,
    difficulty: "Medium",
    imageUrl: photo("1617093727343-374698b1b08d"),
    ratingAverage: 4.4,
    ratingCount: 71,
  },
  {
    title: "Ratatouille",
    shortDescription: "Slow-stewed eggplant, zucchini, and pepper in tomato.",
    fullDescription:
      "A rustic Provençal vegetable stew - eggplant, zucchini, bell pepper, and tomato slow-cooked together with garlic and herbes de Provence until silky and deeply flavored.",
    ingredients: [
      "1 eggplant, cubed",
      "2 zucchini, sliced",
      "1 bell pepper, sliced",
      "4 tomatoes, chopped",
      "1 onion, sliced",
      "3 cloves garlic, minced",
      "2 tbsp olive oil",
      "1 tsp herbes de Provence",
      "Fresh basil, for garnish",
    ],
    instructions: [
      "Sauté onion and garlic in olive oil until fragrant.",
      "Add eggplant and cook until it starts to soften.",
      "Stir in zucchini, bell pepper, and tomatoes.",
      "Season with herbes de Provence and simmer uncovered for 30-40 minutes, stirring occasionally.",
      "Adjust seasoning and finish with fresh basil.",
      "Serve warm or at room temperature with crusty bread.",
    ],
    cuisineType: "French",
    dietType: "vegan",
    prepTimeMinutes: 55,
    difficulty: "Easy",
    imageUrl: photo("1622973536968-3ead9e780960"),
    ratingAverage: 4.5,
    ratingCount: 96,
  },
  {
    title: "Vegan Japchae",
    shortDescription: "Stir-fried glass noodles with vegetables and sesame.",
    fullDescription:
      "Chewy sweet potato glass noodles stir-fried with carrots, spinach, mushrooms, and onion in a savory sesame-soy sauce - a Korean celebration dish, made plant-based.",
    ingredients: [
      "8 oz sweet potato glass noodles (dangmyeon)",
      "1 carrot, julienned",
      "1 onion, sliced",
      "2 cups spinach",
      "1 cup shiitake mushrooms, sliced",
      "4 tbsp soy sauce",
      "2 tbsp sugar",
      "2 tbsp sesame oil",
      "1 tbsp toasted sesame seeds",
    ],
    instructions: [
      "Soak glass noodles until pliable, then boil until tender and drain.",
      "Sauté carrot, onion, and mushrooms separately until just tender.",
      "Blanch spinach briefly and squeeze out excess water.",
      "Toss noodles with soy sauce, sugar, and sesame oil in a large bowl.",
      "Add all vegetables and toss together until evenly coated.",
      "Garnish with toasted sesame seeds and serve warm or at room temperature.",
    ],
    cuisineType: "Korean",
    dietType: "vegan",
    prepTimeMinutes: 35,
    difficulty: "Medium",
    imageUrl: photo("1626200419199-391ae4be7a41"),
    ratingAverage: 4.6,
    ratingCount: 84,
  },
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Mongoose connection has no database handle");
  }

  const demoUser = await db.collection("user").findOne({ email: "demo@mealmind.ai" });
  if (!demoUser) {
    throw new Error(
      "Demo user not found - run `npx ts-node scripts/seedDemoUser.ts` first."
    );
  }
  const createdBy = demoUser._id;

  const docs = RECIPES.map((r) => ({ ...r, createdBy }));
  const inserted = await Recipe.insertMany(docs);

  const total = await Recipe.countDocuments();
  console.log(`Inserted ${inserted.length} recipes.`);
  console.log(`Total recipes in database: ${total}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
