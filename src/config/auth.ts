import { MongoClient } from "mongodb";
import { trustedOrigins } from "./origins";

// Better Auth needs a raw MongoClient (separate from the Mongoose
// connection used for app models) for its own user/session collections.
const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db();

const isProduction = process.env.NODE_ENV === "production";

// better-auth ships ESM-only (no CommonJS build), so it can't be
// `require()`-d from this CommonJS project - it must be loaded via a
// dynamic import() instead.
async function initAuth() {
  const { betterAuth } = await import("better-auth");
  const { mongodbAdapter } = await import("better-auth/adapters/mongodb");

  return betterAuth({
    database: mongodbAdapter(db),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins,
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
    // Frontend (Vercel) and backend (Render) are different domains, so
    // session cookies are cross-site from the browser's point of view.
    // That requires SameSite=None + Secure, which browsers only honor
    // over HTTPS - hence "lax"/non-secure in local dev, where frontend
    // and backend are both plain http://localhost.
    advanced: {
      defaultCookieAttributes: {
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
      },
      useSecureCookies: isProduction,
    },
    // Frontend demo-login button hits a normal /sign-in call with this
    // account's real credentials - seed it via scripts/seedDemoUser.ts,
    // don't special-case it in auth logic.
  });
}

type BetterAuthInstance = Awaited<ReturnType<typeof initAuth>>;

// Cached so repeated calls across requests reuse one instance.
let authPromise: Promise<BetterAuthInstance> | undefined;

export function getAuth(): Promise<BetterAuthInstance> {
  if (!authPromise) {
    authPromise = initAuth();
  }
  return authPromise;
}
