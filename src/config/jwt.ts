import env from "./env.ts";

const JWT_SECRET = env.JWT_SECRET || Deno.env.get("JWT_SECRET");

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

export { JWT_SECRET };
