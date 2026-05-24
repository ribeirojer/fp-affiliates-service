import { verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { JWT_SECRET } from "../config/jwt.ts";
import { Context } from "https://deno.land/x/oak@v17.2.0/context.ts";

let keyPromise: Promise<CryptoKey> | null = null;

async function getJwtKey(): Promise<CryptoKey> {
  if (!keyPromise) {
    keyPromise = crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["verify"],
    );
  }
  return keyPromise;
}

export async function requireAuth(ctx: Context, next: () => Promise<unknown>) {
  const authHeader = ctx.request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Token de autenticação não fornecido" };
    return;
  }

  const token = authHeader.slice(7);

  try {
    const key = await getJwtKey();
    const payload = await verify(token, key);
    const userId = payload.userId as string | undefined;

    if (!userId) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Token inválido" };
      return;
    }

    ctx.state.user = { id: userId };
    await next();
  } catch {
    ctx.response.status = 401;
    ctx.response.body = { error: "Token inválido ou expirado" };
  }
}
