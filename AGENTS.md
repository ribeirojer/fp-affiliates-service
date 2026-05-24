# api-teste-local — Affiliate API

## Stack
- **Deno** + **Oak** (HTTP framework, v17 via redirect)
- **Supabase** (DB), **djwt** (JWT auth, SHA-512 HMAC), **Zod** (validation)
- Deployed on **Deno Deploy** (`ribeirojer/teste`)

## Commands
| Task | Command |
|------|---------|
| Dev server (watch) | `deno task dev` |
| All tests | `deno task test` |
| Schema tests only | `deno task test:schemas` |
| Route tests only | `deno task test:routes` |

## Structure
```
src/
  server.ts              — entrypoint (reads PORT from env, default 8000)
  app.ts                 — Oak app setup, CORS, error handler, routes
  config/env.ts          — centralized dotenv loader (single load)
  config/supabase.ts     — Supabase client singleton
  config/jwt.ts          — JWT_SECRET loader
  middleware/auth.ts     — JWT Bearer auth middleware
  middleware/requestId.ts— X-Request-Id middleware
  routes/health.routes.ts— GET /health
  routes/affiliate.routes.ts — affiliate CRUD routes
  handlers/              — request handlers
  services/              — business logic
  repositories/          — Supabase queries
  schemas/               — Zod schemas
  types.ts               — shared interfaces
test/
  schemas.test.ts             — unit (schema validation)
  routes-health.test.ts       — health, CORS, 404
  routes-auth.test.ts         — auth failure modes (parameterized)
  routes-click.test.ts        — click endpoint (public)
  routes-authenticated.test.ts— endpoints with valid JWT (needs DB)
  test-utils.ts               — JWT token generator for tests
```

## Key conventions
- **Portuguese** for user-facing messages (`"Usuário não encontrado"`, `"Token inválido"`)
- **English** for code identifiers
- JSON logger (`@std/log` with `jsonFormatter`)
- Response body: `{ error: "message" }` on failure, plain object on success
- Auth: `ctx.state.user = { id: userId }` after JWT verification
- Handlers import repo directly for user lookups (not through service)

## Environment (`.env` — **do not commit**)
Required: `SUPABASE_URL`, `SUPABASE_KEY`, `JWT_SECRET`
Optional: `PORT` (8000), `CORS_ORIGINS`, `RESEND_API_KEY`, `CONTACT_EMAIL`

## Testing quirks
- Tests are split by concern: schemas (unit), routes-{auth,click,health,authenticated}
- `test-utils.ts` generates real JWTs using the project's JWT_SECRET for auth tests
- Schema tests are pure unit, no network needed
- No mock DB — route tests hit real Supabase; successful auth returns 400 with expected error message
- `test:routes` globs `test/routes-*.test.ts`; `test` globs both route and schema files

## Gotchas
- Tests share the same `app` instance — middleware order matters
- Payout minimum is **R$ 30.00** (hardcoded in service)
- Affiliate codes: 8-char alphanumeric, random, unique-verified
