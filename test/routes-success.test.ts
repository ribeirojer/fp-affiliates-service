import { assertEquals, assertExists } from "https://deno.land/std@0.192.0/testing/asserts.ts";

let testSeq = 900000;
function nextUserId(): string {
  return String(testSeq++);
}
import { superoak } from "https://deno.land/x/superoak/mod.ts";
import { app } from "../src/app.ts";
import { supabase } from "../src/config/supabase.ts";
import { generateToken } from "./test-utils.ts";

async function setupUser(id: string) {
  const { error } = await supabase.from("users").upsert({
    id,
    email: `test-${id}@flashcardspro.com.br`,
    name: "Test User",
    affiliate_code: null,
    affiliate_earnings: 0,
    pix_key: null,
  }, { onConflict: "id" });
  if (error) throw new Error(`seed failed: ${error.message}`);
}

async function teardownUser(id: string) {
  const user = await supabase.from("users").select("affiliate_code").eq("id", id).single();
  const code = user.data?.affiliate_code;
  if (code) {
    await supabase.from("affiliate_clicks").delete().eq("affiliate_code", code);
    await supabase.from("referrals").delete().eq("affiliate_code", code);
    await supabase.from("payouts").delete().eq("affiliate_code", code);
  }
  await supabase.from("users").delete().eq("id", id);
}

Deno.test({
  name: "POST /affiliates/generate should create affiliate code and return 201",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const userId = nextUserId();
    await setupUser(userId);
    try {
      const token = await generateToken(userId);
      const request = await superoak(app);
      const response = await request
        .post("/affiliates/generate")
        .set("Authorization", `Bearer ${token}`);

      assertEquals(response.status, 201);
      const body = await response.body;
      assertExists(body.affiliateCode);
      assertEquals(typeof body.affiliateCode, "string");
      assertEquals(body.affiliateCode.length, 8);
    } finally {
      await teardownUser(userId);
    }
  },
});

Deno.test({
  name: "POST /affiliates/click should return 201 with valid affiliate code",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const userId = nextUserId();
    await setupUser(userId);
    try {
      const token = await generateToken(userId);
      const res1 = await (await superoak(app))
        .post("/affiliates/generate")
        .set("Authorization", `Bearer ${token}`);
      const { affiliateCode } = await res1.body;

      const request = await superoak(app);
      const response = await request
        .post("/affiliates/click")
        .set("Content-Type", "application/json")
        .send({
          affiliateCode,
          landingPage: "/flashcards",
          referrer: "https://google.com",
        });

      assertEquals(response.status, 201);
      const body = await response.body;
      assertEquals(body.success, true);
    } finally {
      await teardownUser(userId);
    }
  },
});

Deno.test({
  name: "GET /affiliates/stats should return 200 with stats after a click",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const userId = nextUserId();
    await setupUser(userId);
    try {
      const token = await generateToken(userId);
      const res1 = await (await superoak(app))
        .post("/affiliates/generate")
        .set("Authorization", `Bearer ${token}`);
      const { affiliateCode } = await res1.body;

      await (await superoak(app))
        .post("/affiliates/click")
        .set("Content-Type", "application/json")
        .send({ affiliateCode });

      const request = await superoak(app);
      const response = await request
        .get("/affiliates/stats")
        .set("Authorization", `Bearer ${token}`);

      assertEquals(response.status, 200);
      const body = await response.body;
      assertEquals(body.totalClicks, 1);
      assertEquals(body.totalReferrals, 0);
      assertEquals(body.totalCommissions, 0);
      assertEquals(body.pendingCommissions, 0);
      assertEquals(body.paidCommissions, 0);
      assertEquals(body.availableForPayout, 0);
    } finally {
      await teardownUser(userId);
    }
  },
});

Deno.test({
  name: "POST /affiliates/pix-key should return 200 and save pix key",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const userId = nextUserId();
    await setupUser(userId);
    try {
      const token = await generateToken(userId);
      await (await superoak(app))
        .post("/affiliates/generate")
        .set("Authorization", `Bearer ${token}`);

      const request = await superoak(app);
      const response = await request
        .post("/affiliates/pix-key")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .send({ pixKey: "test@email.com" });

      assertEquals(response.status, 200);
      const body = await response.body;
      assertEquals(body.success, true);
    } finally {
      await teardownUser(userId);
    }
  },
});

Deno.test({
  name: "GET /affiliates/payouts should return 200 with empty array",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const userId = nextUserId();
    await setupUser(userId);
    try {
      const token = await generateToken(userId);
      await (await superoak(app))
        .post("/affiliates/generate")
        .set("Authorization", `Bearer ${token}`);

      const request = await superoak(app);
      const response = await request
        .get("/affiliates/payouts")
        .set("Authorization", `Bearer ${token}`);

      assertEquals(response.status, 200);
      const body = await response.body;
      assertEquals(Array.isArray(body), true);
      assertEquals(body.length, 0);
    } finally {
      await teardownUser(userId);
    }
  },
});
