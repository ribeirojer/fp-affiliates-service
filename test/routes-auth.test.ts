import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { superoak } from "https://deno.land/x/superoak/mod.ts";
import { app } from "../src/app.ts";

const authRoutes = [
  ["POST", "/affiliates/generate"],
  ["GET", "/affiliates/stats"],
  ["GET", "/affiliates/referrals"],
  ["POST", "/affiliates/pix-key"],
  ["POST", "/affiliates/request-payout"],
  ["GET", "/affiliates/payouts"],
] as const;

for (const [method, path] of authRoutes) {
  Deno.test(`${method} ${path} should return 401 without auth token`, async () => {
    const request = await superoak(app);
    const response = await (method === "GET" ? request.get(path) : request.post(path));
    assertEquals(response.status, 401);
    const body = await response.body;
    assertEquals(body.error, "Token de autenticação não fornecido");
  });
}

Deno.test("GET /affiliates/generate should return 405 (wrong method)", async () => {
  const request = await superoak(app);
  const response = await request.get("/affiliates/generate");
  assertEquals(response.status, 405);
});

Deno.test("POST /affiliates/generate should return 401 with malformed auth header", async () => {
  const request = await superoak(app);
  const response = await request
    .post("/affiliates/generate")
    .set("Authorization", "Basic dXNlcjpwYXNz");
  assertEquals(response.status, 401);
  const body = await response.body;
  assertEquals(body.error, "Token de autenticação não fornecido");
});

Deno.test("POST /affiliates/generate should return 401 with empty Bearer token", async () => {
  const request = await superoak(app);
  const response = await request
    .post("/affiliates/generate")
    .set("Authorization", "Bearer ");
  assertEquals(response.status, 401);
  const body = await response.body;
  assertEquals(body.error, "Token de autenticação não fornecido");
});

Deno.test("POST /affiliates/generate should return 401 with garbage token", async () => {
  const request = await superoak(app);
  const response = await request
    .post("/affiliates/generate")
    .set("Authorization", "Bearer this.is.not.a.valid.jwt");
  assertEquals(response.status, 401);
});

Deno.test("POST /affiliates/pix-key should return 401 with malformed auth header", async () => {
  const request = await superoak(app);
  const response = await request
    .post("/affiliates/pix-key")
    .set("Authorization", "NotBearer token");
  assertEquals(response.status, 401);
});
