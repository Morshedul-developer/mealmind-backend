import "dotenv/config";
import { auth } from "../src/config/auth";

/**
 * Creates the real demo account the frontend's "Try Demo Account" button
 * auto-fills. Run once: `npx ts-node scripts/seedDemoUser.ts`
 */
async function seedDemoUser() {
  try {
    await auth.api.signUpEmail({
      body: {
        email: "demo@mealmind.ai",
        password: "MealMindDemo123!",
        name: "Demo Chef",
      },
    });
    console.log("Demo user created: demo@mealmind.ai / MealMindDemo123!");
  } catch (err) {
    console.log("Demo user may already exist:", (err as Error).message);
  }
  process.exit(0);
}

seedDemoUser();
