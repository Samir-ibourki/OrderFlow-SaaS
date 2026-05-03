import { Router } from "express";
import { listProducts, createProduct, updateProduct, deleteProduct } from "../controllers/products.js";

const router = Router();
router.get("/products", listProducts);
router.post("/products", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);
export default router;
