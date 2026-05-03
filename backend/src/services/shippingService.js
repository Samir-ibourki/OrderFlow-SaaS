import { generateTrackingNumber } from "../utils/generateOrderNumber.js";

const COURIERS = ["Amana", "Chronopost", "CTM Messagerie", "GLOVO", "Aramex", "DHL"];

export function getAvailableCouriers() {
  return COURIERS;
}

export function generateLabel({ orderNumber, customerName, customerPhone, customerCity, courier }) {
  const trackingNumber = generateTrackingNumber(courier);
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
  return {
    trackingNumber,
    labelUrl: `/api/shipping/label/${trackingNumber}.pdf`,
    courier,
    estimatedDelivery: estimatedDelivery.toISOString().split("T")[0],
    labelData: { orderNumber, customerName, customerPhone, customerCity, courier, trackingNumber, generatedAt: new Date().toISOString() },
  };
}

export function getDeliveryStats(shipments) {
  const total = shipments.length;
  if (total === 0) return { total: 0, delivered: 0, inTransit: 0, pending: 0, successRate: 0 };
  const delivered = shipments.filter((s) => s.status === "delivered").length;
  const inTransit = shipments.filter((s) => s.status === "in_transit").length;
  const pending   = shipments.filter((s) => s.status === "pending").length;
  return { total, delivered, inTransit, pending, successRate: Math.round((delivered / total) * 100) };
}
