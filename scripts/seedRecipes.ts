import "dotenv/config";
import mongoose from "mongoose";
import { Recipe } from "../src/models/Recipe";

/**
 * Seeds 10 realistic recipes on top of whatever already exists, all
 * owned by the seeded demo user (scripts/seedDemoUser.ts).
 * Run: `npx ts-node scripts/seedRecipes.ts`
 */

const RECIPES = [
  {
    title: "Lemon Garlic Chicken",
    shortDescription: "Juicy pan-seared chicken in a bright lemon-garlic sauce.",
    fullDescription:
      "Chicken thighs seared until golden, then simmered in a garlicky lemon butter sauce with fresh herbs. A weeknight staple that tastes like a restaurant dish.",
    ingredients: [
      "4 chicken thighs, boneless",
      "6 cloves garlic, minced",
      "2 lemons, juiced",
      "3 tbsp butter",
      "2 tbsp olive oil",
      "1 tsp dried oregano",
      "Salt and pepper to taste",
      "Fresh parsley, chopped",
    ],
    instructions: [
      "Season chicken thighs with salt, pepper, and oregano.",
      "Sear in olive oil over medium-high heat until golden, about 5 minutes per side.",
      "Remove chicken, add garlic to the pan and cook until fragrant.",
      "Deglaze with lemon juice and add butter, whisking into a sauce.",
      "Return chicken to the pan and simmer 5 minutes until cooked through.",
      "Garnish with parsley and serve hot.",
    ],
    cuisineType: "Mediterranean",
    dietType: "none",
    prepTimeMinutes: 30,
    difficulty: "Easy",
    imageUrl: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=1600&h=1000&fit=crop&q=80",
    ratingAverage: 4.6,
    ratingCount: 182,
  },
  {
    title: "Thai Basil Beef",
    shortDescription: "Spicy stir-fried beef with Thai basil and chili.",
    fullDescription:
      "A fiery, aromatic stir-fry of ground beef, garlic, chilies, and Thai basil in a savory-sweet sauce. Ready faster than delivery.",
    ingredients: [
      "1 lb ground beef",
      "4 cloves garlic, minced",
      "3 Thai chilies, sliced",
      "1 cup Thai basil leaves",
      "2 tbsp fish sauce",
      "1 tbsp soy sauce",
      "1 tsp sugar",
      "2 tbsp vegetable oil",
    ],
    instructions: [
      "Heat oil in a wok over high heat.",
      "Add garlic and chilies, stir-fry until fragrant.",
      "Add ground beef, breaking it up, and cook until browned.",
      "Stir in fish sauce, soy sauce, and sugar.",
      "Toss in Thai basil leaves until just wilted.",
      "Serve immediately over steamed rice.",
    ],
    cuisineType: "Thai",
    dietType: "none",
    prepTimeMinutes: 25,
    difficulty: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&h=1000&fit=crop&q=80",
    ratingAverage: 4.8,
    ratingCount: 264,
  },
  {
    title: "Creamy Mushroom Risotto",
    shortDescription: "Slow-stirred arborio rice with wild mushrooms and parmesan.",
    fullDescription:
      "Classic Italian risotto made with sautéed mushrooms, white wine, and a generous finish of butter and parmesan. Rich, comforting, and worth the stirring.",
    ingredients: [
      "1.5 cups arborio rice",
      "8 oz mixed mushrooms, sliced",
      "1 small onion, diced",
      "4 cups vegetable stock, warm",
      "1/2 cup white wine",
      "1/2 cup parmesan, grated",
      "2 tbsp butter",
      "2 tbsp olive oil",
    ],
    instructions: [
      "Sauté mushrooms in olive oil until browned, set aside.",
      "In the same pot, cook onion until translucent.",
      "Add rice and toast for 1-2 minutes.",
      "Pour in wine and stir until absorbed.",
      "Add warm stock one ladle at a time, stirring constantly until absorbed before adding more.",
      "Once rice is creamy and al dente, stir in mushrooms, butter, and parmesan.",
      "Season to taste and serve immediately.",
    ],
    cuisineType: "Italian",
    dietType: "vegetarian",
    prepTimeMinutes: 40,
    difficulty: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&h=1000&fit=crop&q=80",
    ratingAverage: 4.5,
    ratingCount: 97,
  },
  {
    title: "Spicy Chickpea Tacos",
    shortDescription: "Crispy spiced chickpeas piled into warm corn tortillas.",
    fullDescription:
      "Roasted chickpeas seasoned with smoky spices, tucked into tortillas with avocado crema and pickled onions. A quick, fully plant-based taco night.",
    ingredients: [
      "2 cans chickpeas, drained",
      "1 tbsp smoked paprika",
      "1 tsp cumin",
      "1 tsp chili powder",
      "2 tbsp olive oil",
      "8 small corn tortillas",
      "1 avocado",
      "1/4 cup red onion, pickled",
      "Fresh cilantro",
    ],
    instructions: [
      "Toss chickpeas with oil, paprika, cumin, and chili powder.",
      "Roast at 425°F for 20 minutes until crispy, shaking halfway.",
      "Mash avocado into a simple crema with lime juice and salt.",
      "Warm tortillas.",
      "Fill tortillas with chickpeas, avocado crema, pickled onion, and cilantro.",
    ],
    cuisineType: "Mexican",
    dietType: "vegan",
    prepTimeMinutes: 20,
    difficulty: "Easy",
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=1600&h=1000&fit=crop&q=80",
    ratingAverage: 4.3,
    ratingCount: 58,
  },
  {
    title: "Bengali Fish Curry",
    shortDescription: "Tangy mustard-based fish curry, a Bengali classic.",
    fullDescription:
      "Rohu fish simmered in a pungent mustard seed and turmeric gravy, finished with green chilies. A staple of Bengali home cooking, best served with steamed rice.",
    ingredients: [
      "6 pieces rohu or catfish",
      "3 tbsp mustard seeds, soaked",
      "2 green chilies",
      "1 tsp turmeric",
      "1 tsp red chili powder",
      "4 tbsp mustard oil",
      "1 tsp nigella seeds (kalonji)",
      "Salt to taste",
    ],
    instructions: [
      "Rub fish pieces with turmeric and salt, shallow fry until light golden.",
      "Grind soaked mustard seeds and green chilies into a paste.",
      "Heat mustard oil, temper with nigella seeds.",
      "Add mustard paste, turmeric, and chili powder, cook until oil separates.",
      "Add water to form a thin gravy and bring to a boil.",
      "Gently add fried fish, simmer 8-10 minutes.",
      "Finish with a drizzle of raw mustard oil and serve with rice.",
    ],
    cuisineType: "Bengali",
    dietType: "none",
    prepTimeMinutes: 45,
    difficulty: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1600&h=1000&fit=crop&q=80",
    ratingAverage: 4.9,
    ratingCount: 214,
  },
  {
    title: "Miso Glazed Salmon",
    shortDescription: "Broiled salmon lacquered in sweet-savory miso glaze.",
    fullDescription:
      "Salmon fillets marinated in miso, mirin, and sake, then broiled until caramelized on top. An izakaya favorite that's simple enough for a weeknight.",
    ingredients: [
      "4 salmon fillets",
      "3 tbsp white miso paste",
      "2 tbsp mirin",
      "1 tbsp sake",
      "1 tbsp sugar",
      "1 tsp sesame oil",
      "Sliced scallions for garnish",
    ],
    instructions: [
      "Whisk miso, mirin, sake, sugar, and sesame oil into a marinade.",
      "Coat salmon fillets and marinate for at least 15 minutes.",
      "Broil on high for 8-10 minutes until caramelized and cooked through.",
      "Garnish with scallions and serve with steamed rice.",
    ],
    cuisineType: "Japanese",
    dietType: "none",
    prepTimeMinutes: 20,
    difficulty: "Easy",
    imageUrl: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=1600&h=1000&fit=crop&q=80",
    ratingAverage: 4.7,
    ratingCount: 176,
  },
  {
    title: "Margherita Pizza",
    shortDescription: "Classic Neapolitan pizza with tomato, mozzarella, basil.",
    fullDescription:
      "A simple, no-fuss Margherita on a chewy hand-stretched crust, topped with San Marzano tomatoes, fresh mozzarella, and basil straight from the oven.",
    ingredients: [
      "1 pizza dough ball",
      "1/2 cup San Marzano tomato sauce",
      "8 oz fresh mozzarella, torn",
      "Fresh basil leaves",
      "2 tbsp olive oil",
      "Salt to taste",
    ],
    instructions: [
      "Preheat oven (and pizza stone, if using) to its highest setting.",
      "Stretch dough into a round on a floured surface.",
      "Spread tomato sauce evenly, leaving a border for the crust.",
      "Scatter torn mozzarella over the top.",
      "Bake until crust is puffed and golden, 8-12 minutes.",
      "Top with fresh basil and a drizzle of olive oil before serving.",
    ],
    cuisineType: "Italian",
    dietType: "vegetarian",
    prepTimeMinutes: 35,
    difficulty: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&h=1000&fit=crop&q=80",
    ratingAverage: 4.8,
    ratingCount: 289,
  },
  {
    title: "Panang Curry Tofu",
    shortDescription: "Rich, nutty Thai panang curry with crispy tofu.",
    fullDescription:
      "Pan-fried tofu simmered in a thick panang curry sauce made with coconut milk, peanuts, and kaffir lime leaves. Fully vegan and deeply satisfying.",
    ingredients: [
      "1 block firm tofu, cubed and pan-fried",
      "2 tbsp panang curry paste",
      "1 can coconut milk",
      "2 tbsp crushed peanuts",
      "1 tbsp soy sauce",
      "1 tsp brown sugar",
      "3 kaffir lime leaves",
      "Red chili, sliced, for garnish",
    ],
    instructions: [
      "Fry tofu cubes until golden and crisp, set aside.",
      "Simmer curry paste with the thick part of the coconut milk until fragrant.",
      "Add remaining coconut milk, soy sauce, and brown sugar.",
      "Stir in kaffir lime leaves and crushed peanuts.",
      "Add tofu back in and simmer 5 minutes.",
      "Garnish with sliced chili and serve with jasmine rice.",
    ],
    cuisineType: "Thai",
    dietType: "vegan",
    prepTimeMinutes: 30,
    difficulty: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1600&h=1000&fit=crop&q=80",
    ratingAverage: 4.4,
    ratingCount: 73,
  },
  {
    title: "Vegetable Biryani",
    shortDescription: "Fragrant layered rice with spiced mixed vegetables.",
    fullDescription:
      "Basmati rice layered with a richly spiced vegetable masala, saffron, and fried onions, then slow-cooked to let the flavors meld. A festive Bengali-style biryani.",
    ingredients: [
      "2 cups basmati rice, soaked",
      "2 cups mixed vegetables (carrot, beans, peas, potato)",
      "2 onions, thinly sliced and fried",
      "1/2 cup yogurt",
      "2 tsp biryani masala",
      "A pinch of saffron in warm milk",
      "4 tbsp ghee",
      "Whole spices: bay leaf, cinnamon, cardamom, cloves",
    ],
    instructions: [
      "Parboil soaked rice with whole spices until 70% cooked, drain.",
      "Sauté vegetables with biryani masala and yogurt until coated and semi-cooked.",
      "Layer half the rice in a heavy pot, top with the vegetable masala.",
      "Add remaining rice, then top with fried onions and saffron milk.",
      "Cover tightly and cook on low heat (dum) for 20-25 minutes.",
      "Rest for 5 minutes, then gently fluff and serve.",
    ],
    cuisineType: "Bengali",
    dietType: "vegetarian",
    prepTimeMinutes: 60,
    difficulty: "Hard",
    imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=1600&h=1000&fit=crop&q=80",
    ratingAverage: 4.6,
    ratingCount: 152,
  },
  {
    title: "Classic Beef Ramen",
    shortDescription: "Slow-braised beef in a deep soy-miso ramen broth.",
    fullDescription:
      "A hearty bowl of chewy ramen noodles in a rich soy-miso broth, topped with tender braised beef, a soft-boiled egg, and scallions.",
    ingredients: [
      "1 lb beef short rib, braised",
      "4 portions fresh ramen noodles",
      "6 cups beef and dashi broth",
      "2 tbsp miso paste",
      "2 tbsp soy sauce",
      "2 soft-boiled eggs, halved",
      "Scallions and nori for garnish",
    ],
    instructions: [
      "Braise beef short rib until fork-tender, shred or slice.",
      "Whisk miso and soy sauce into the hot broth.",
      "Cook ramen noodles according to package instructions, drain.",
      "Divide noodles into bowls and ladle over hot broth.",
      "Top with braised beef, a soft-boiled egg, scallions, and nori.",
      "Serve immediately while piping hot.",
    ],
    cuisineType: "Japanese",
    dietType: "none",
    prepTimeMinutes: 40,
    difficulty: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=1600&h=1000&fit=crop&q=80",
    ratingAverage: 4.9,
    ratingCount: 247,
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
