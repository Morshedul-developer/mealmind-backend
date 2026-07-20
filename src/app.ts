import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth";
import recipeRoutes from "./routes/recipe.routes";
import aiRoutes from "./routes/ai.routes";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Better Auth handles its own routes under /api/auth/* (sign-in, sign-up,
// google callback, sign-out, session). Must be mounted BEFORE express.json()
// per Better Auth's docs, since it parses the body itself.
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());

app.use("/api/recipes", recipeRoutes);
app.use("/api/ai", aiRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

// Basic error handler - keep last
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, error: "Internal server error" });
});

export default app;
