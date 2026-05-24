import { Context } from "https://deno.land/x/oak@v17.2.0/context.ts";

export async function requestId(ctx: Context, next: () => Promise<unknown>) {
  const id = crypto.randomUUID();
  ctx.state.requestId = id;
  ctx.response.headers.set("X-Request-Id", id);
  await next();
}
