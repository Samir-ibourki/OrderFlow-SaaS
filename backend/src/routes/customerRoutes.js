import { Router } from "express";
import { listCustomers, createCustomer, getCustomer } from "../controllers/customers.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);

router.get("/", listCustomers);
router.post("/", createCustomer);
router.get("/:id", getCustomer);

export default router;
