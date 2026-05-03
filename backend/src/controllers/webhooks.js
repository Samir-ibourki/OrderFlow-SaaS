import { processWebhook } from "../services/webhookService.js";
import { WebhookEvent } from "../models/index.js";

export async function handleWhatsApp(req, res) {
  try {
    if (req.method === "GET") {
      const { "hub.mode": mode, "hub.verify_token": token, "hub.challenge": challenge } = req.query;
      const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "orderflow-verify";
      return mode === "subscribe" && token === verifyToken
        ? res.status(200).send(challenge)
        : res.status(403).json({ error: "Verification failed" });
    }
    const result = await processWebhook("whatsapp", req.body);
    res.status(200).json({ received: true, orderId: result.order?.id || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function handleInstagram(req, res) {
  try {
    if (req.method === "GET") {
      const { "hub.mode": mode, "hub.verify_token": token, "hub.challenge": challenge } = req.query;
      const verifyToken = process.env.INSTAGRAM_VERIFY_TOKEN || "orderflow-verify";
      return mode === "subscribe" && token === verifyToken
        ? res.status(200).send(challenge)
        : res.status(403).json({ error: "Verification failed" });
    }
    const result = await processWebhook("instagram", req.body);
    res.status(200).json({ received: true, orderId: result.order?.id || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function handleTikTok(req, res) {
  try {
    const result = await processWebhook("tiktok", req.body);
    res.status(200).json({ received: true, orderId: result.order?.id || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function handleWebsite(req, res) {
  try {
    const result = await processWebhook("website", req.body);
    if (result.error && !result.order) return res.status(400).json({ error: result.error });
    res.status(201).json({ received: true, order: result.order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getWebhookEvents(req, res) {
  try {
    const { channel, processed } = req.query;
    const where = {};
    if (channel) where.channel = channel;
    if (processed !== undefined) where.processed = processed === "true";
    const events = await WebhookEvent.findAll({ where, order: [["createdAt", "DESC"]], limit: 100 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
