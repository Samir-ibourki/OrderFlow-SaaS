import { Router } from "express";
import { getSummary, getTopProducts, getOrdersByStatus, getOrdersBySource, getOrdersByChannel } from "../controllers/analytics.js";

const router = Router();
router.get("/summary", getSummary);
router.get("/top-products", getTopProducts);
router.get("/orders-by-status", getOrdersByStatus);
router.get("/orders-by-source", getOrdersBySource);
router.get("/orders-by-channel", getOrdersByChannel);
export default router;
