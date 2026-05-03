import { Router } from "express";
import { listOrders, getRecentOrders, getOrder, createOrder, updateOrder, deleteOrder, parseOrder } from "../controllers/orders.js";

const router = Router();
router.get("/orders", listOrders);
router.post("/parse", parseOrder);
router.get("/recent", getRecentOrders);
router.get("/:id", getOrder);
router.post("/orders", createOrder);
router.patch("/:id", updateOrder);
router.delete("/:id", deleteOrder);
export default router;
