import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

router.get("/health", (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = { status: "ok", service: "affiliates" };
});

export default router;
