import { Order, WebhookEvent } from "../models/index.js";
import { generateOrderNumber } from "../utils/generateOrderNumber.js";

function extractWhatsAppOrder(payload) {
  const message = payload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message) return null;
  return {
    customerPhone: message.from || "unknown",
    customerName: payload?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name || "WhatsApp Customer",
    product: message.text?.body || "Unknown Product",
    source: "whatsapp",
    notes: `WhatsApp message ID: ${message.id}`,
  };
}

function extractInstagramOrder(payload) {
  const messaging = payload?.entry?.[0]?.messaging?.[0];
  if (!messaging) return null;
  return {
    customerName: "Instagram Customer",
    customerPhone: messaging?.sender?.id || "unknown",
    product: messaging?.message?.text || "Instagram Order",
    source: "instagram",
    notes: `Instagram sender: ${messaging?.sender?.id}`,
  };
}

function extractTikTokOrder(payload) {
  const order = payload?.data;
  if (!order) return null;
  return {
    customerName: order.buyer_info?.buyer_username || "TikTok Customer",
    customerPhone: order.buyer_info?.phone_number || "unknown",
    product: order.item_list?.[0]?.product_name || "TikTok Product",
    quantity: order.item_list?.[0]?.quantity || 1,
    price: Number(order.payment?.total_amount || 0),
    source: "tiktok",
    notes: `TikTok Order ID: ${order.order_id}`,
  };
}

function extractWebsiteOrder(payload) {
  return {
    customerName: payload.customer_name || payload.name,
    customerPhone: payload.customer_phone || payload.phone,
    customerCity: payload.customer_city || payload.city,
    product: payload.product || payload.item,
    quantity: payload.quantity || 1,
    price: Number(payload.price || payload.total || 0),
    source: "website",
    notes: payload.notes || null,
  };
}

const EXTRACTORS = { whatsapp: extractWhatsAppOrder, instagram: extractInstagramOrder, tiktok: extractTikTokOrder, website: extractWebsiteOrder };

export async function processWebhook(channel, payload) {
  const event = await WebhookEvent.create({ channel, rawPayload: payload });
  const extractor = EXTRACTORS[channel];
  if (!extractor) return { event, order: null, error: `Unknown channel: ${channel}` };
  const extracted = extractor(payload);
  if (!extracted || !extracted.customerPhone) return { event, order: null, error: "Could not extract order data" };
  const orderData = {
    orderNumber: generateOrderNumber(),
    customerName: extracted.customerName || "Unknown",
    customerPhone: String(extracted.customerPhone),
    customerCity: extracted.customerCity || null,
    product: extracted.product || "Unknown Product",
    quantity: extracted.quantity || 1,
    price: extracted.price || 0,
    status: "new_order",
    source: extracted.source || channel,
    notes: extracted.notes || null,
  };
  const order = await Order.create(orderData);
  
  event.processed = true;
  event.orderId = order.id;
  await event.save();
  
  return { event, order };
}
