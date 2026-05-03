import { Op, fn, col, cast } from "sequelize";
import { Customer, Order } from "../models/index.js";

async function getCustomerWithStats(where = {}) {
  return Customer.findAll({
    where,
    attributes: {
      include: [
        [fn("COALESCE", fn("COUNT", col("Orders.id")), 0), "ordersCount"],
        [fn("COALESCE", fn("SUM", cast(col("Orders.price"), "NUMERIC")), 0), "totalSpent"],
      ],
    },
    include: [{
      model: Order,
      attributes: [],
      duplicating: false,
    }],
    group: ["Customer.id"],
    order: [["createdAt", "DESC"]],
    raw: true,
  });
}

const fmt = (c) => ({
  ...c,
  ordersCount: Number(c.ordersCount || 0),
  totalSpent: Number(c.totalSpent || 0)
});

export async function listCustomers(req, res) {
  try {
    const { search } = req.query;
    let where = {};
    if (search) {
      where = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } },
          { city: { [Op.iLike]: `%${search}%` } },
        ]
      };
    }
    const customers = await getCustomerWithStats(where);
    res.json(customers.map(fmt));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createCustomer(req, res) {
  try {
    const { name, phone, city } = req.body;
    if (!name || !phone) return res.status(400).json({ error: "name and phone are required" });
    const customer = await Customer.create({ name, phone, city: city || null });
    res.status(201).json({ ...customer.get({ plain: true }), ordersCount: 0, totalSpent: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCustomer(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const customers = await getCustomerWithStats({ id });
    if (!customers.length) return res.status(404).json({ error: "Customer not found" });
    res.json(fmt(customers[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
