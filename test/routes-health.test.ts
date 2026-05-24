import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { superoak } from "https://deno.land/x/superoak/mod.ts";
import { app } from "../src/app.ts";

Deno.test("GET /health should return 200", async () => {
  const request = await superoak(app);
  const response = await request.get("/health");
  assertEquals(response.status, 200);
  const body = await response.body;
  assertEquals(body.status, "ok");
  assertEquals(body.service, "affiliates");
});

Deno.test("OPTIONS /health should return 204 (CORS preflight)", async () => {
  const request = await superoak(app);
  const response = await request.options("/health");
  assertEquals(response.status, 204);
});

Deno.test("GET /unknown should return 404", async () => {
  const request = await superoak(app);
  const response = await request.get("/unknown");
  assertEquals(response.status, 404);
});
