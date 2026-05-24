import { app } from "./app.ts";
import env from "./config/env.ts";
const port = Number(env.PORT) || 8000;

await app.listen({ port });