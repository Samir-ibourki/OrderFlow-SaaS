import { Op } from "sequelize";
import { Customer, Order } from "../models/index.js";
import { generateOrderNumber } from "../utils/generateOrderNumber.js";
import OpenAI from "openai";

let _openai = null;
function getOpenAI() {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

function formatOrder(order) {
  const plain = order.get ? order.get({ plain: true }) : order;
  return { ...plain, price: Number(plain.price), notes: plain.notes ?? undefined, customerCity: plain.customerCity ?? undefined };
}

export async function listOrders(req, res) {
  try {
    const { status, source, search } = req.query;

    // Pagination: page 1, 50 par page
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 50; 
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (source) where.source = source;
    if (search) {
      where[Op.or] = [
        { customerName: { [Op.iLike]: `%${search}%` } },
        { customerPhone: { [Op.iLike]: `%${search}%` } },
        { product: { [Op.iLike]: `%${search}%` } },
        { orderNumber: { [Op.iLike]: `%${search}%` } },
      ];
    }
    const orders = await Order.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset
    });
    res.json(orders.map(formatOrder));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getRecentOrders(req, res) {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const orders = await Order.findAll({
      order: [["createdAt", "DESC"]],
      limit,
    });
    res.json(orders.map(formatOrder));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getOrder(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(formatOrder(order));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createOrder(req, res) {
  try {
    const { customerName, customerPhone, customerCity, product, quantity, price, source, notes } = req.body;
    
    if (!customerName || !customerPhone || !product || price == null) {
      return res.status(400).json({ error: "Les champs nom, téléphone, produit et prix sont obligatoires" });
    }

    let [customer] = await Customer.findOrCreate({
      where: { phone: customerPhone },
      defaults: {
        name: customerName,
        city: customerCity || null
      }
    });

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customerId: customer.id,
      customerName,
      customerPhone,
      customerCity: customerCity || null,
      product,
      quantity: quantity || 1,
      price: price,
      source: source || "manual",
      notes: notes || null,
    });
    
    res.status(201).json(formatOrder(order));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateOrder(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const { customerName, customerPhone, customerCity, product, quantity, price, notes, status, source } = req.body;
    
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    
    if (customerName  !== undefined) order.customerName  = customerName;
    if (customerPhone !== undefined) order.customerPhone = customerPhone;
    if (customerCity  !== undefined) order.customerCity  = customerCity;
    if (product       !== undefined) order.product       = product;
    if (quantity      !== undefined) order.quantity      = quantity;
    if (price         !== undefined) order.price         = price;
    if (notes         !== undefined) order.notes         = notes;
    if (status        !== undefined) order.status        = status;
    if (source        !== undefined) order.source        = source;
    
    await order.save();
    res.json(formatOrder(order));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteOrder(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const deleted = await Order.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Order not found" });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function parseOrder(req, res) {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "message is required" });
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      max_completion_tokens: 512,
      messages: [
        {
          role: "system",
          content: `You are an order extraction assistant for a social commerce platform used by Moroccan and African merchants.
Extract order information from a customer message. The message may be in French, Arabic, Darija (Moroccan Arabic), English, or a mix.
Return a JSON object with these fields (all optional, only include what you can confidently extract):
- customerName: string
- customerPhone: string
- customerCity: string
- product: string
- quantity: number
- price: number
- notes: string
Return ONLY valid JSON, no explanation.`,
        },
        { role: "user", content: message },
      ],
    });
    const content = completion.choices[0]?.message?.content ?? "{}";
    let extracted = {};
    try { extracted = JSON.parse(content); } catch { extracted = {}; }
    res.json(extracted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
