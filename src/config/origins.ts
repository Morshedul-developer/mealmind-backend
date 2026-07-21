// Single source of truth for allowed frontend origins, shared between
// CORS (app.ts) and Better Auth's trustedOrigins (auth.ts). Always an
// explicit list - never a wildcard - since credentials: true requires it.
const PRODUCTION_CLIENT_URL = "https://mealmind-eta.vercel.app";
const LOCAL_CLIENT_URL = "http://localhost:3000";

export const trustedOrigins = Array.from(
  new Set(
    [process.env.CLIENT_URL, PRODUCTION_CLIENT_URL, LOCAL_CLIENT_URL].filter(
      (origin): origin is string => Boolean(origin)
    )
  )
);
