import { Product } from "../models/index.js";

export async function listProducts(_req, res) {
  try {
    const products = await Product.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(products.map((p) => ({ ...p.get({ plain: true }), price: Number(p.price) })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createProduct(req, res) {
  try {
    const { name, price, stock } = req.body;
    if (!name || price == null) return res.status(400).json({ error: "name and price are required" });
    const product = await Product.create({ name, price, stock: stock || 0 });
    res.status(201).json({ ...product.get({ plain: true }), price: Number(product.price) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const { name, price, stock } = req.body;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    
    if (name  !== undefined) product.name  = name;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    
    await product.save();
    res.json({ ...product.get({ plain: true }), price: Number(product.price) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const deleted = await Product.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
