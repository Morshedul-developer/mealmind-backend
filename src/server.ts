import "dotenv/config";
import { createApp } from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  const app = await createApp();
  app.listen(PORT, () => {
    console.log(`MealMind AI backend running on port ${PORT}`);
  });
}

start();
