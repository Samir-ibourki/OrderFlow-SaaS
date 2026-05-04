import { Order, WebhookEvent, Customer } from "../models/index.js";
import { generateOrderNumber } from "../utils/generateOrderNumber.js";
import OpenAI from "openai";

let _openai = null;

function getOpenAI() {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is missing");
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

async function analyzeMessage(text) {
  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an invisible filter for an e-commerce system.
Analyze the customer's message.
RULE 1: If the customer does not explicitly mention a phone number in their message, return: { "action": "ignore" }
RULE 2: If the customer does not provide the city or address, return: { "action": "ignore" }
RULE 3: If the customer provides the Product, City/Address AND a Phone number in the text, return: 
{
  "action": "create_order",
  "data": {
    "customerPhone": "The extracted phone number",
    "customerName": "The extracted name if any, otherwise 'Customer'",
    "customerCity": "The extracted city or address",
    "product": "The requested product",
    "quantity": 1
  }
}`
      },
      { role: "user", content: text },
    ],
  });
  return JSON.parse(completion.choices[0].message.content);
}

function extractInstagramOrder(payload) {
  const messaging = payload?.entry?.[0]?.messaging?.[0];
  if (!messaging) return null;
  return {
    customerName: "Instagram Customer",
    customerPhone: messaging?.sender?.id || "unknown",
    product: messaging?.message?.text || "Instagram Order",
    source: "instagram",
    notes: `Sender ID: ${messaging?.sender?.id}`,
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
    notes: `Order ID: ${order.order_id}`,
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

export async function processWebhook(channel, payload) {
  const event = await WebhookEvent.create({ channel, rawPayload: payload });

  if (channel === "whatsapp") {
    const message = payload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    
    if (!message || !message.text) {
      return { event, order: null, error: "Unsupported format" };
    }

    const messageText = message.text.body;
    const aiResult = await analyzeMessage(messageText);

    if (aiResult.action === "ignore") {
      event.processed = true;
      await event.save();
      return { event, order: null, status: "ignored_by_ai" };
    }

    if (aiResult.action === "create_order") {
      const extractedPhone = aiResult.data.customerPhone;
      const extractedName = aiResult.data.customerName || "Customer";

      let [customer] = await Customer.findOrCreate({
        where: { phone: extractedPhone },
        defaults: {
          name: extractedName,
          city: aiResult.data.customerCity || null
        }
      });

      const order = await Order.create({
        orderNumber: generateOrderNumber(),
        customerId: customer.id,
        customerName: extractedName,
        customerPhone: extractedPhone,
        customerCity: aiResult.data.customerCity || null,
        product: aiResult.data.product || "Unknown product",
        quantity: aiResult.data.quantity || 1,
        price: 0,
        status: "new_order",
        source: "whatsapp",
        notes: messageText,
      });

      event.processed = true;
      event.orderId = order.id;
      await event.save();

      return { event, order, status: "order_created" };
    }
  } else {
    let extracted = null;
    if (channel === "instagram") extracted = extractInstagramOrder(payload);
    else if (channel === "tiktok") extracted = extractTikTokOrder(payload);
    else if (channel === "website") extracted = extractWebsiteOrder(payload);

    if (!extracted || !extracted.customerPhone) {
      return { event, order: null, error: "Unconfigured channel or invalid payload" };
    }

    let [customer] = await Customer.findOrCreate({
      where: { phone: extracted.customerPhone },
      defaults: {
        name: extracted.customerName,
        city: extracted.customerCity || null
      }
    });

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customerId: customer.id,
      customerName: extracted.customerName,
      customerPhone: String(extracted.customerPhone),
      customerCity: extracted.customerCity || null,
      product: extracted.product || "Unknown product",
      quantity: extracted.quantity || 1,
      price: extracted.price || 0,
      status: "new_order",
      source: extracted.source || channel,
      notes: extracted.notes || null,
    });
    
    event.processed = true;
    event.orderId = order.id;
    await event.save();
    
    return { event, order };
  }

  return { event, order: null, error: "Unconfigured channel" };
}