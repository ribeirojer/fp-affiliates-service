import { Router } from "https://deno.land/x/oak/mod.ts";
import { requireAuth } from "../middleware/auth.ts";
import {
  registerClickHandler,
  generateCodeHandler,
  payoutsHandler,
  referralsHandler,
  requestPayoutHandler,
  savePixKeyHandler,
  statsHandler,
} from "../handlers/affiliate.handler.ts";

const router = new Router();

// Rotas públicas
router.post("/affiliates/click", registerClickHandler);

// Rotas autenticadas
router.use(requireAuth);
router
  .post("/affiliates/generate", generateCodeHandler)
  .get("/affiliates/stats", statsHandler)
  .get("/affiliates/referrals", referralsHandler)
  .post("/affiliates/pix-key", savePixKeyHandler)
  .post("/affiliates/request-payout", requestPayoutHandler)
  .get("/affiliates/payouts", payoutsHandler);

export default router;
