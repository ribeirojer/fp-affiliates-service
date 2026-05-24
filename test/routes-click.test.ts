import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { superoak } from "https://deno.land/x/superoak/mod.ts";
import { app } from "../src/app.ts";

Deno.test("POST /affiliates/click should return 400 when body is missing", async () => {
  const request = await superoak(app);
  const response = await request
    .post("/affiliates/click")
    .set("Content-Type", "application/json")
    .send("");
  assertEquals(response.status, 400);
});

Deno.test("POST /affiliates/click should return 400 when body is invalid JSON", async () => {
  const request = await superoak(app);
  const response = await request
    .post("/affiliates/click")
    .set("Content-Type", "application/json")
    .send("not json");
  assertEquals(response.status, 400);
});

Deno.test("POST /affiliates/click should return 400 when affiliateCode is missing", async () => {
  const request = await superoak(app);
  const response = await request
    .post("/affiliates/click")
    .set("Content-Type", "application/json")
    .send({});
  assertEquals(response.status, 400);
});

Deno.test("POST /affiliates/click should return 400 when affiliateCode is empty", async () => {
  const request = await superoak(app);
  const response = await request
    .post("/affiliates/click")
    .set("Content-Type", "application/json")
    .send({ affiliateCode: "" });
  assertEquals(response.status, 400);
});

Deno.test("POST /affiliates/click should return 400 when affiliateCode is number", async () => {
  const request = await superoak(app);
  const response = await request
    .post("/affiliates/click")
    .set("Content-Type", "application/json")
    .send({ affiliateCode: 12345 });
  assertEquals(response.status, 400);
});

Deno.test("POST /affiliates/click with valid body format should return 400 (code not found in DB)", async () => {
  const request = await superoak(app);
  const response = await request
    .post("/affiliates/click")
    .set("Content-Type", "application/json")
    .send({ affiliateCode: "ZZZZZZZZ", landingPage: "/test", referrer: "https://example.com" });
  assertEquals(response.status, 400);
  const body = await response.body;
  assertEquals(body.error, "Código de afiliado inválido");
});
