import * as z from "@zod/zod";

export const registerClickSchema = z.object({
  affiliateCode: z.string().min(1, "Código de afiliado é obrigatório"),
  landingPage: z.string().optional(),
  referrer: z.string().optional(),
});

export type RegisterClickInput = z.infer<typeof registerClickSchema>;

export const pixKeySchema = z.object({
  pixKey: z.string().min(1, "Chave PIX é obrigatória"),
});

export type PixKeyInput = z.infer<typeof pixKeySchema>;

export const requestPayoutSchema = z.object({
  pixKey: z.string().min(1, "Chave PIX é obrigatória"),
});

export type RequestPayoutInput = z.infer<typeof requestPayoutSchema>;
