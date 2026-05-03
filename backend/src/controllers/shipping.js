import { Op } from "sequelize";
import { Shipment } from "../models/index.js";
import { generateLabel, getAvailableCouriers, getDeliveryStats } from "../services/shippingService.js";
import { generateTrackingNumber } from "../utils/generateOrderNumber.js";

export async function getShipments(req, res) {
  try {
    const { status, courier } = req.query;
    const where = {};
    if (status) where.status = status;
    if (courier) where.courier = { [Op.iLike]: `%${courier}%` };
    const shipments = await Shipment.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getShipment(req, res) {
  try {
    const shipment = await Shipment.findByPk(Number(req.params.id));
    if (!shipment) return res.status(404).json({ error: "Shipment not found" });
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createShipmentForOrder(req, res) {
  try {
    const { orderId, orderNumber, customerName, customerPhone, customerCity, courier } = req.body;
    if (!orderNumber || !customerName || !customerPhone) {
      return res.status(400).json({ error: "orderNumber, customerName and customerPhone are required" });
    }
    const labelData = generateLabel({ orderNumber, customerName, customerPhone, customerCity, courier: courier || "Amana" });
    const shipment = await Shipment.create({ 
      orderId: orderId || null, 
      orderNumber, 
      customerName, 
      customerPhone, 
      customerCity, 
      courier: labelData.courier, 
      trackingNumber: labelData.trackingNumber, 
      labelUrl: labelData.labelUrl, 
      estimatedDelivery: labelData.estimatedDelivery 
    });
    res.status(201).json({ ...shipment.get({ plain: true }), labelData: labelData.labelData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function assignCourier(req, res) {
  try {
    const { courier } = req.body;
    if (!courier) return res.status(400).json({ error: "courier is required" });
    const shipment = await Shipment.findByPk(Number(req.params.id));
    if (!shipment) return res.status(404).json({ error: "Shipment not found" });
    
    shipment.courier = courier;
    shipment.trackingNumber = generateTrackingNumber(courier);
    shipment.status = "assigned";
    await shipment.save();
    
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateTracking(req, res) {
  try {
    const { status, trackingNumber, estimatedDelivery } = req.body;
    if (!status) return res.status(400).json({ error: "status is required" });
    const shipment = await Shipment.findByPk(Number(req.params.id));
    if (!shipment) return res.status(404).json({ error: "Shipment not found" });
    
    shipment.status = status;
    if (trackingNumber) shipment.trackingNumber = trackingNumber;
    if (estimatedDelivery) shipment.estimatedDelivery = estimatedDelivery;
    await shipment.save();
    
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getShipmentForOrder(req, res) {
  try {
    const shipment = await Shipment.findOne({ where: { orderId: Number(req.params.orderId) } });
    if (!shipment) return res.status(404).json({ error: "No shipment for this order" });
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCouriers(_req, res) { res.json(getAvailableCouriers()); }

export async function getShippingStats(_req, res) {
  try {
    const shipments = await Shipment.findAll();
    res.json(getDeliveryStats(shipments.map(s => s.get({ plain: true }))));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
