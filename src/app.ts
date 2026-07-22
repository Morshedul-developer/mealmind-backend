import express from "express";
import cors from "cors";
import { getAuth } from "./config/auth";
import { trustedOrigins } from "./config/origins";
import recipeRoutes from "./routes/recipe.routes";
import aiRoutes from "./routes/ai.routes";
import reviewRoutes from "./routes/review.routes";

// better-auth/node (toNodeHandler) is ESM-only like the rest of
// better-auth, so it's loaded via dynamic import() alongside the auth
// instance itself - see src/config/auth.ts.
export async function createApp(): Promise<express.Express> {
  const { toNodeHandler } = await import("better-auth/node");
  const auth = await getAuth();

  const app = express();

  // Explicit origin allowlist (never "*") - required alongside
  // credentials: true so the browser accepts the response on
  // cross-domain requests (frontend on Vercel, this API on Render).
  app.use(
    cors({
      origin: trustedOrigins,
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
  app.use("/api/reviews", reviewRoutes);

  app.get("/api/health", (_req, res) => {
    res.json({ success: true, data: { status: "ok" } });
  });

  // Basic error handler - keep last
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  });

  return app;
}
