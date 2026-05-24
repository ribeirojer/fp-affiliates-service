import { create } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { JWT_SECRET } from "../src/config/jwt.ts";

let signKeyPromise: Promise<CryptoKey> | null = null;

async function getSignKey(): Promise<CryptoKey> {
  if (!signKeyPromise) {
    signKeyPromise = crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"],
    );
  }
  return signKeyPromise;
}

export async function generateToken(userId: string): Promise<string> {
  const key = await getSignKey();
  return await create({ alg: "HS512", typ: "JWT" }, { userId }, key);
}
