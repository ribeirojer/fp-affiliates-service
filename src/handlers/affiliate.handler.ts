import * as service from "../services/affiliate.service.ts";
import { getUserById } from "../repositories/affiliate.repository.ts";
import { registerClickSchema, pixKeySchema, requestPayoutSchema } from "../schemas/affiliate.schema.ts";
import logger from "../utils/logger.ts";
import { RouterContext } from "https://deno.land/x/oak@v17.2.0/mod.ts";

export async function generateCodeHandler(ctx: RouterContext<string>) {
  try {
    const userId = ctx.state.user.id;
    const code = await service.generateAffiliateCode(userId);
    ctx.response.status = 201;
    ctx.response.body = { affiliateCode: code };
  } catch (error) {
    logger.error("Erro ao gerar código de afiliado", { error: String(error) });
    ctx.response.status = 400;
    ctx.response.body = { error: error instanceof Error ? error.message : "Erro ao gerar código" };
  }
}

export async function statsHandler(ctx: RouterContext<string>) {
  try {
    const userId = ctx.state.user.id;
    const user = await getUserById(userId);

    if (!user?.affiliate_code) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Gere seu código de afiliado primeiro" };
      return;
    }

    const stats = await service.getAffiliateStats(user.affiliate_code);
    ctx.response.status = 200;
    ctx.response.body = stats;
  } catch (error) {
    logger.error("Erro ao buscar estatísticas", { error: String(error) });
    ctx.response.status = 500;
    ctx.response.body = { error: "Erro ao buscar estatísticas" };
  }
}

export async function referralsHandler(ctx: RouterContext<string>) {
  try {
    const userId = ctx.state.user.id;
    const user = await getUserById(userId);

    if (!user?.affiliate_code) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Gere seu código de afiliado primeiro" };
      return;
    }

    const referrals = await service.getReferrals(user.affiliate_code);
    ctx.response.status = 200;
    ctx.response.body = referrals;
  } catch (error) {
    logger.error("Erro ao buscar indicações", { error: String(error) });
    ctx.response.status = 500;
    ctx.response.body = { error: "Erro ao buscar indicações" };
  }
}

export async function registerClickHandler(ctx: RouterContext<string>) {
  try {
    const body = await ctx.request.body.json();
    const parsed = registerClickSchema.parse(body);

    await service.registerClick({
      affiliateCode: parsed.affiliateCode,
      landingPage: parsed.landingPage,
      referrer: parsed.referrer,
      userAgent: ctx.request.headers.get("User-Agent") ?? undefined,
    });

    ctx.response.status = 201;
    ctx.response.body = { success: true };
  } catch (error) {
    if (error instanceof SyntaxError) {
      ctx.response.status = 400;
      ctx.response.body = { error: "JSON inválido" };
      return;
    }
    logger.error("Erro ao registrar clique", { error: String(error) });
    ctx.response.status = 400;
    ctx.response.body = { error: error instanceof Error ? error.message : "Erro ao registrar clique" };
  }
}

export async function savePixKeyHandler(ctx: RouterContext<string>) {
  try {
    const userId = ctx.state.user.id;
    const body = await ctx.request.body.json();
    const parsed = pixKeySchema.parse(body);

    await service.savePixKey(userId, parsed.pixKey);
    ctx.response.status = 200;
    ctx.response.body = { success: true };
  } catch (error) {
    if (error instanceof SyntaxError) {
      ctx.response.status = 400;
      ctx.response.body = { error: "JSON inválido" };
      return;
    }
    logger.error("Erro ao salvar chave PIX", { error: String(error) });
    ctx.response.status = 400;
    ctx.response.body = { error: error instanceof Error ? error.message : "Erro ao salvar chave PIX" };
  }
}

export async function requestPayoutHandler(ctx: RouterContext<string>) {
  try {
    const userId = ctx.state.user.id;
    const body = await ctx.request.body.json();
    const parsed = requestPayoutSchema.parse(body);

    await service.requestPayout(userId, parsed.pixKey);
    ctx.response.status = 201;
    ctx.response.body = { success: true };
  } catch (error) {
    if (error instanceof SyntaxError) {
      ctx.response.status = 400;
      ctx.response.body = { error: "JSON inválido" };
      return;
    }
    logger.error("Erro ao solicitar saque", { error: String(error) });
    ctx.response.status = 400;
    ctx.response.body = { error: error instanceof Error ? error.message : "Erro ao solicitar saque" };
  }
}

export async function payoutsHandler(ctx: RouterContext<string>) {
  try {
    const userId = ctx.state.user.id;
    const user = await getUserById(userId);

    if (!user?.affiliate_code) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Gere seu código de afiliado primeiro" };
      return;
    }

    const payouts = await service.getPayoutHistory(user.affiliate_code);
    ctx.response.status = 200;
    ctx.response.body = payouts;
  } catch (error) {
    logger.error("Erro ao buscar histórico de saques", { error: String(error) });
    ctx.response.status = 500;
    ctx.response.body = { error: "Erro ao buscar histórico de saques" };
  }
}
