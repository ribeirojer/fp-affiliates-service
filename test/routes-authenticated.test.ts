import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { superoak } from "https://deno.land/x/superoak/mod.ts";
import { app } from "../src/app.ts";
import { generateToken } from "./test-utils.ts";

const VALID_TOKEN = await generateToken("00000000-0000-0000-0000-000000000000");

Deno.test("POST /affiliates/generate with valid JWT should return 400 (user not found in DB)", async () => {
  const request = await superoak(app);
  const response = await request
    .post("/affiliates/generate")
    .set("Authorization", `Bearer ${VALID_TOKEN}`);
  assertEquals(response.status, 400);
  const body = await response.body;
  assertEquals(body.error, "Usuário não encontrado");
});

Deno.test("GET /affiliates/stats with valid JWT should return 400 (no affiliate code)", async () => {
  const request = await superoak(app);
  const response = await request
    .get("/affiliates/stats")
    .set("Authorization", `Bearer ${VALID_TOKEN}`);
  assertEquals(response.status, 400);
  const body = await response.body;
  assertEquals(body.error, "Gere seu código de afiliado primeiro");
});

Deno.test("GET /affiliates/referrals with valid JWT should return 400 (no affiliate code)", async () => {
  const request = await superoak(app);
  const response = await request
    .get("/affiliates/referrals")
    .set("Authorization", `Bearer ${VALID_TOKEN}`);
  assertEquals(response.status, 400);
  const body = await response.body;
  assertEquals(body.error, "Gere seu código de afiliado primeiro");
});

Deno.test("POST /affiliates/pix-key with valid JWT should return 400 (user not found)", async () => {
  const request = await superoak(app);
  const response = await request
    .post("/affiliates/pix-key")
    .set("Authorization", `Bearer ${VALID_TOKEN}`)
    .set("Content-Type", "application/json")
    .send({ pixKey: "test@email.com" });
  assertEquals(response.status, 400);
  const body = await response.body;
  assertEquals(body.error, "Usuário não encontrado");
});

Deno.test("POST /affiliates/pix-key with valid JWT should return 400 with invalid JSON body", async () => {
  const request = await superoak(app);
  const response = await request
    .post("/affiliates/pix-key")
    .set("Authorization", `Bearer ${VALID_TOKEN}`)
    .set("Content-Type", "application/json")
    .send("not json");
  assertEquals(response.status, 400);
});

Deno.test("POST /affiliates/request-payout with valid JWT should return 400 (user not found)", async () => {
  const request = await superoak(app);
  const response = await request
    .post("/affiliates/request-payout")
    .set("Authorization", `Bearer ${VALID_TOKEN}`)
    .set("Content-Type", "application/json")
    .send({ pixKey: "test@email.com" });
  assertEquals(response.status, 400);
  const body = await response.body;
  assertEquals(body.error, "Usuário não encontrado");
});

Deno.test("POST /affiliates/request-payout with valid JWT should return 400 with invalid JSON body", async () => {
  const request = await superoak(app);
  const response = await request
    .post("/affiliates/request-payout")
    .set("Authorization", `Bearer ${VALID_TOKEN}`)
    .set("Content-Type", "application/json")
    .send("not json");
  assertEquals(response.status, 400);
});

Deno.test("GET /affiliates/payouts with valid JWT should return 400 (no affiliate code)", async () => {
  const request = await superoak(app);
  const response = await request
    .get("/affiliates/payouts")
    .set("Authorization", `Bearer ${VALID_TOKEN}`);
  assertEquals(response.status, 400);
  const body = await response.body;
  assertEquals(body.error, "Gere seu código de afiliado primeiro");
});
