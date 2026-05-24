import { supabase } from "../config/supabase.ts";
import type { Payout, Referral, UserAffiliate } from "../types.ts";

export async function getUserById(userId: string): Promise<UserAffiliate | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, affiliate_code, affiliate_earnings, pix_key, email, name")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data as UserAffiliate;
}

export async function getUserByAffiliateCode(code: string): Promise<UserAffiliate | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, affiliate_code, affiliate_earnings, pix_key, email, name")
    .eq("affiliate_code", code)
    .single();

  if (error) return null;
  return data as UserAffiliate;
}

export async function updateUserAffiliateCode(userId: string, code: string): Promise<void> {
  const { error } = await supabase
    .from("users")
    .update({ affiliate_code: code })
    .eq("id", userId);

  if (error) throw new Error("Erro ao gerar código de afiliado");
}

export async function updateUserPixKey(userId: string, pixKey: string): Promise<void> {
  const { error } = await supabase
    .from("users")
    .update({ pix_key: pixKey })
    .eq("id", userId);

  if (error) throw new Error("Erro ao salvar chave PIX");
}

export async function getReferrals(affiliateCode: string): Promise<Referral[]> {
  const { data, error } = await supabase
    .from("referrals")
    .select("*")
    .eq("affiliate_code", affiliateCode)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Erro ao buscar indicações");
  return data as Referral[];
}

export async function getReferralsCount(affiliateCode: string): Promise<number> {
  const { count, error } = await supabase
    .from("referrals")
    .select("*", { count: "exact", head: true })
    .eq("affiliate_code", affiliateCode);
  if (error) throw new Error("Erro ao buscar indicações");
  return count ?? 0;
}

export async function getClicksCount(affiliateCode: string): Promise<number> {
  const { count, error } = await supabase
    .from("affiliate_clicks")
    .select("*", { count: "exact", head: true })
    .eq("affiliate_code", affiliateCode);

  if (error) throw new Error("Erro ao buscar cliques");
  return count ?? 0;
}

export async function getCommissionsSum(
  affiliateCode: string,
  status: "pending" | "paid",
): Promise<number> {
  const { data, error } = await supabase
    .from("referrals")
    .select("commission_value")
    .eq("affiliate_code", affiliateCode)
    .eq("status", status);

  if (error) throw new Error("Erro ao buscar comissões");
  return data?.reduce((sum, r) => sum + Number(r.commission_value), 0) ?? 0;
}

export async function registerClick(data: {
  affiliateCode: string;
  landingPage?: string;
  referrer?: string;
  userAgent?: string;
}): Promise<void> {
  const { error } = await supabase.from("affiliate_clicks").insert({
    affiliate_code: data.affiliateCode,
    landing_page: data.landingPage ?? null,
    referrer: data.referrer ?? null,
    user_agent: data.userAgent ?? null,
    converted: false,
  });

  if (error) throw new Error("Erro ao registrar clique");
}

export async function createPayout(data: {
  affiliateCode: string;
  amount: number;
  pixKey: string;
}): Promise<void> {
  const { error } = await supabase.from("payouts").insert({
    affiliate_code: data.affiliateCode,
    amount: data.amount,
    pix_key: data.pixKey,
    status: "requested",
  });

  if (error) throw new Error("Erro ao solicitar saque");
}

export async function getPayouts(affiliateCode: string): Promise<Payout[]> {
  const { data, error } = await supabase
    .from("payouts")
    .select("*")
    .eq("affiliate_code", affiliateCode)
    .order("requested_at", { ascending: false });

  if (error) throw new Error("Erro ao buscar histórico de saques");
  return data as Payout[];
}
