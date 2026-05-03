import { Router } from "express";
import { listCustomers, createCustomer, getCustomer } from "../controllers/customers.js";

const router = Router();
router.get("/", listCustomers);
router.post("/", createCustomer);

router.get("/:id", getCustomer);
export default router;
