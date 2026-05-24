import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { registerClickSchema, pixKeySchema, requestPayoutSchema } from "../src/schemas/affiliate.schema.ts";

Deno.test("registerClickSchema rejects null input", () => {
  const result = registerClickSchema.safeParse(null);
  assertEquals(result.success, false);
});

Deno.test("registerClickSchema rejects missing affiliateCode", () => {
  const result = registerClickSchema.safeParse({});
  assertEquals(result.success, false);
});

Deno.test("registerClickSchema rejects empty affiliateCode", () => {
  const result = registerClickSchema.safeParse({ affiliateCode: "" });
  assertEquals(result.success, false);
  assertEquals(result.error?.issues[0].message, "Código de afiliado é obrigatório");
});

Deno.test("registerClickSchema rejects affiliateCode as number", () => {
  const result = registerClickSchema.safeParse({ affiliateCode: 123 });
  assertEquals(result.success, false);
});

Deno.test("registerClickSchema rejects affiliateCode as boolean", () => {
  const result = registerClickSchema.safeParse({ affiliateCode: true });
  assertEquals(result.success, false);
});

Deno.test("registerClickSchema accepts whitespace-only affiliateCode", () => {
  const result = registerClickSchema.safeParse({ affiliateCode: "   " });
  assertEquals(result.success, true);
});

Deno.test("registerClickSchema accepts valid input", () => {
  const result = registerClickSchema.safeParse({ affiliateCode: "ABC12345" });
  assertEquals(result.success, true);
});

Deno.test("registerClickSchema accepts valid input with optional fields", () => {
  const result = registerClickSchema.safeParse({
    affiliateCode: "ABC12345",
    landingPage: "/flashcards",
    referrer: "https://google.com",
  });
  assertEquals(result.success, true);
});

Deno.test("registerClickSchema accepts without optional fields", () => {
  const result = registerClickSchema.safeParse({ affiliateCode: "ABC12345" });
  assertEquals(result.success, true);
  if (result.success) {
    assertEquals(result.data.landingPage, undefined);
    assertEquals(result.data.referrer, undefined);
  }
});

Deno.test("registerClickSchema strips extra fields", () => {
  const result = registerClickSchema.safeParse({
    affiliateCode: "ABC12345",
    extraField: "should be stripped",
  });
  assertEquals(result.success, true);
  if (result.success) {
    assertEquals("extraField" in result.data, false);
  }
});

Deno.test("pixKeySchema rejects null input", () => {
  const result = pixKeySchema.safeParse(null);
  assertEquals(result.success, false);
});

Deno.test("pixKeySchema rejects missing pixKey", () => {
  const result = pixKeySchema.safeParse({});
  assertEquals(result.success, false);
});

Deno.test("pixKeySchema rejects empty pixKey", () => {
  const result = pixKeySchema.safeParse({ pixKey: "" });
  assertEquals(result.success, false);
  assertEquals(result.error?.issues[0].message, "Chave PIX é obrigatória");
});

Deno.test("pixKeySchema rejects pixKey as number", () => {
  const result = pixKeySchema.safeParse({ pixKey: 42 });
  assertEquals(result.success, false);
});

Deno.test("pixKeySchema accepts valid input", () => {
  const result = pixKeySchema.safeParse({ pixKey: "test@email.com" });
  assertEquals(result.success, true);
});

Deno.test("pixKeySchema accepts CPF as pixKey", () => {
  const result = pixKeySchema.safeParse({ pixKey: "12345678909" });
  assertEquals(result.success, true);
});

Deno.test("pixKeySchema accepts phone as pixKey", () => {
  const result = pixKeySchema.safeParse({ pixKey: "+5511999999999" });
  assertEquals(result.success, true);
});

Deno.test("pixKeySchema accepts UUID as pixKey", () => {
  const result = pixKeySchema.safeParse({ pixKey: "123e4567-e89b-12d3-a456-426614174000" });
  assertEquals(result.success, true);
});

Deno.test("pixKeySchema accepts random key", () => {
  const result = pixKeySchema.safeParse({ pixKey: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" });
  assertEquals(result.success, true);
});

Deno.test("pixKeySchema strips extra fields", () => {
  const result = pixKeySchema.safeParse({ pixKey: "chave", extra: "field" });
  assertEquals(result.success, true);
  if (result.success) {
    assertEquals(Object.keys(result.data).length, 1);
  }
});

Deno.test("requestPayoutSchema rejects null input", () => {
  const result = requestPayoutSchema.safeParse(null);
  assertEquals(result.success, false);
});

Deno.test("requestPayoutSchema rejects missing pixKey", () => {
  const result = requestPayoutSchema.safeParse({});
  assertEquals(result.success, false);
});

Deno.test("requestPayoutSchema rejects empty pixKey", () => {
  const result = requestPayoutSchema.safeParse({ pixKey: "" });
  assertEquals(result.success, false);
  assertEquals(result.error?.issues[0].message, "Chave PIX é obrigatória");
});

Deno.test("requestPayoutSchema rejects pixKey as number", () => {
  const result = requestPayoutSchema.safeParse({ pixKey: 42 });
  assertEquals(result.success, false);
});

Deno.test("requestPayoutSchema accepts valid input", () => {
  const result = requestPayoutSchema.safeParse({ pixKey: "12345678900" });
  assertEquals(result.success, true);
});

Deno.test("requestPayoutSchema strips extra fields", () => {
  const result = requestPayoutSchema.safeParse({ pixKey: "chave", extra: true });
  assertEquals(result.success, true);
  if (result.success) {
    assertEquals(Object.keys(result.data).length, 1);
  }
});
