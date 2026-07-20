# MealMind AI — Backend

## Project
AI-powered recipe discovery & meal-planning platform. Portfolio/assignment
project. Backend only in this repo — frontend is a separate Next.js repo
that consumes this API.

## Tech stack (do not deviate without asking)
- Node.js + Express.js + TypeScript
- MongoDB + Mongoose
- Better Auth (email/password + Google OAuth)
- Groq API (Llama models) for both AI features — model:
  `llama-3.3-70b-versatile` by default (cheap/fast, good for a student
  project's rate limits). Do not hardcode a different model string unless
  told to.
- Zod for request validation
- ts-node-dev for local dev

## Folder structure
```
src/
  config/        # db connection, auth config, env loading
  models/        # Mongoose schemas
  controllers/    # request handlers, one file per resource
  routes/         # express routers, one file per resource
  services/       # business logic + external API calls (Groq, etc.)
  middleware/     # auth guard, error handler, rate limiter
  types/          # shared TypeScript types/interfaces
  app.ts          # express app setup (middleware, routes mounted)
  server.ts       # entrypoint, starts the HTTP server
```
Keep this structure. New features get a model + controller + route +
(service if it talks to Groq or does non-trivial logic) — not everything
crammed into one file.

## Design system reference (for API response shaping, not styling)
Frontend cards expect: image, title, shortDescription, meta
(prepTimeMinutes, difficulty, cuisineType, dietType, rating), so recipe API
responses should always include these fields at minimum on list endpoints.

## Core data models
- **User** — handled by Better Auth's own schema, do not duplicate it.
  Extend via a `profile` field if custom fields are needed later.
- **Recipe** — title, shortDescription, fullDescription/instructions,
  ingredients (array), cuisineType, dietType, prepTimeMinutes, difficulty,
  imageUrl, images (array), createdBy (ref User), rating (avg, computed),
  createdAt.
- **Review** — recipeId (ref Recipe), userId (ref User), rating (1-5),
  comment, createdAt.
- **Conversation** — userId (ref User), recipeId (optional ref Recipe, for
  context), messages (array of {role, content, timestamp}), createdAt.

## Auth rules
- Protected routes: `/api/recipes` POST/PUT/DELETE, `/api/recipes/mine`,
  all `/api/ai/*` routes. Public: `/api/recipes` GET (list + details).
- Demo login: a seeded demo user (email: demo@mealmind.ai) whose
  credentials the frontend auto-fills — do not build a fake bypass, it
  must be a real seeded account.
- Google OAuth via Better Auth — client ID/secret from `.env`, never
  hardcoded.

## AI feature rules
- **Recipe generator**: takes ingredients[], cuisineType, dietType, length
  ("quick"|"detailed") → calls Groq with a structured prompt template →
  returns a structured JSON recipe (not free text) so the frontend can
  render it like a normal recipe card. Must support "regenerate" (just
  re-call with the same input, maybe higher temperature).
- **Chat assistant**: maintains conversation history server-side per
  session/user, sends full history to Groq each call (Groq has no
  memory between calls), supports streaming via SSE if the frontend asks
  for it. Suggested follow-ups: ask Groq to return them alongside the
  answer in a structured format, don't hardcode generic ones.

## Conventions
- All API responses: `{ success: boolean, data?, error? }` shape.
- All list endpoints support `page`, `limit`, `sort`, and relevant filter
  query params — implement pagination for real, not just accepting the
  params and ignoring them.
- Validate every request body with Zod before it touches a controller.
- Never commit `.env` — `.env.example` documents required keys only.
- Run `npm run lint` and `npm run build` before considering a feature done.

## What NOT to do
- Don't invent extra AI features beyond the 2 chosen (generator + chat).
- Don't add a third auth method "just in case."
- Don't reshape the folder structure above without discussing it first.
