import { Request, Response, NextFunction } from "express";
import { getAuth } from "../config/auth";

export interface AuthedRequest extends Request {
  user?: { id: string; email: string; name?: string };
}

/**
 * Protects routes like POST/PUT/DELETE /api/recipes, /api/ai/*.
 * Better Auth reads the session from cookies/headers on the incoming request.
 */
export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: req.headers as any });

    if (!session?.user) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: "Invalid or expired session" });
  }
}
