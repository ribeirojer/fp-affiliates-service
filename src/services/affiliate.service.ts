import * as repo from "../repositories/affiliate.repository.ts";
import type { AffiliateStats } from "../types.ts";

function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function generateAffiliateCode(userId: string): Promise<string> {
  const user = await repo.getUserById(userId);
  if (!user) throw new Error("Usuário não encontrado");

  if (user.affiliate_code) {
    return user.affiliate_code;
  }

  let code: string;
  let attempts = 0;
  do {
    code = generateCode();
    const existing = await repo.getUserByAffiliateCode(code);
    if (!existing) break;
    attempts++;
  } while (attempts < 10);

  if (attempts >= 10) throw new Error("Erro ao gerar código único");

  await repo.updateUserAffiliateCode(userId, code);
  return code;
}

export async function getAffiliateStats(affiliateCode: string): Promise<AffiliateStats> {
  const [totalClicks, totalReferrals, pendingSum, paidSum] = await Promise.all([
    repo.getClicksCount(affiliateCode),
    repo.getReferralsCount(affiliateCode),
    repo.getCommissionsSum(affiliateCode, "pending"),
    repo.getCommissionsSum(affiliateCode, "paid"),
  ]);

  return {
    totalClicks,
    totalReferrals,
    totalCommissions: pendingSum + paidSum,
    pendingCommissions: pendingSum,
    paidCommissions: paidSum,
    availableForPayout: pendingSum,
  };
}

export async function getReferrals(affiliateCode: string) {
  return await repo.getReferrals(affiliateCode);
}

export async function registerClick(input: {
  affiliateCode: string;
  landingPage?: string;
  referrer?: string;
  userAgent?: string;
}) {
  const user = await repo.getUserByAffiliateCode(input.affiliateCode);
  if (!user) throw new Error("Código de afiliado inválido");

  await repo.registerClick(input);
}

export async function savePixKey(userId: string, pixKey: string) {
  const user = await repo.getUserById(userId);
  if (!user) throw new Error("Usuário não encontrado");
  if (!user.affiliate_code) throw new Error("Gere seu código de afiliado primeiro");

  await repo.updateUserPixKey(userId, pixKey);
}

export async function requestPayout(userId: string, pixKey: string) {
  const user = await repo.getUserById(userId);
  if (!user) throw new Error("Usuário não encontrado");
  if (!user.affiliate_code) throw new Error("Gere seu código de afiliado primeiro");

  const stats = await getAffiliateStats(user.affiliate_code);

  if (stats.availableForPayout < 30) {
    throw new Error("Saldo mínimo de R$ 30,00 para saque");
  }

  await repo.createPayout({
    affiliateCode: user.affiliate_code,
    amount: stats.availableForPayout,
    pixKey,
  });
}

export async function getPayoutHistory(affiliateCode: string) {
  return await repo.getPayouts(affiliateCode);
}
