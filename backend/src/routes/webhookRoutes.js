import { Router } from "express";
import { handleWhatsApp, handleInstagram, handleTikTok, handleWebsite, getWebhookEvents } from "../controllers/webhooks.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();
router.get("/whatsapp", handleWhatsApp);
router.post("/whatsapp", handleWhatsApp);
router.get("/instagram", handleInstagram);
router.post("/instagram", handleInstagram);
router.post("/tiktok", handleTikTok);
router.post("/website", handleWebsite);
router.get("/events", authenticateToken, getWebhookEvents);
export default router;
