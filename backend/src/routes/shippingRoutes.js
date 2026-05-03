import { Router } from "express";
import { getShipments, getShipment, createShipmentForOrder, assignCourier, updateTracking, getShipmentForOrder, getCouriers, getShippingStats } from "../controllers/shipping.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();
router.use(authenticateToken);
router.get("/shipping", getShipments);
router.get("/couriers", getCouriers);
router.get("/stats", getShippingStats);
router.post("/shipping", createShipmentForOrder);
router.get("/order/:orderId", getShipmentForOrder);
router.get("/:id", getShipment);
router.patch("/:id/courier", assignCourier);
router.patch("/:id/tracking", updateTracking);
export default router;
