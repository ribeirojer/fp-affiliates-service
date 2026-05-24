import { Application } from "https://deno.land/x/oak/mod.ts";
import healthRoutes from "./routes/health.routes.ts";
import affiliateRoutes from "./routes/affiliate.routes.ts";
import logger from "./utils/logger.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { requestId } from "./middleware/requestId.ts";
import env from "./config/env.ts";
const CORS_ORIGINS = env.CORS_ORIGINS ||
  Deno.env.get("CORS_ORIGINS") ||
  "https://flashcardspro.com.br,http://localhost:3000";

const app = new Application();
app.use(requestId);
app.use(oakCors({
  origin: CORS_ORIGINS.split(",").map((s) => s.trim()),
}));

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error("Erro interno não tratado", { error: err });
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
  }
});

app.use(healthRoutes.routes());
app.use(healthRoutes.allowedMethods());
app.use(affiliateRoutes.routes());
app.use(affiliateRoutes.allowedMethods());

export { app };