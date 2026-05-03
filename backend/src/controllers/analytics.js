import { sequelize } from "../models/index.js";
import { QueryTypes } from "sequelize";

export async function getSummary(_req, res) {
  try {
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);

    const [todayRes, monthRes, cancelledRes, deliveredRes, totalOrdersRes, totalCustomersRes, shipmentsRes] = await Promise.all([
      sequelize.query(`SELECT COUNT(*) as count, COALESCE(SUM(CAST(price AS NUMERIC) * quantity), 0) as revenue FROM orders WHERE created_at >= :today`, { replacements: { today: todayStart.toISOString() }, type: QueryTypes.SELECT }),
      sequelize.query(`SELECT COUNT(*) as count, COALESCE(SUM(CAST(price AS NUMERIC) * quantity), 0) as revenue FROM orders WHERE created_at >= :month`, { replacements: { month: monthStart.toISOString() }, type: QueryTypes.SELECT }),
      sequelize.query(`SELECT COUNT(*) as count FROM orders WHERE status = 'cancelled'`, { type: QueryTypes.SELECT }),
      sequelize.query(`SELECT COUNT(*) as count FROM orders WHERE status = 'delivered'`, { type: QueryTypes.SELECT }),
      sequelize.query(`SELECT COUNT(*) as count FROM orders`, { type: QueryTypes.SELECT }),
      sequelize.query(`SELECT COUNT(*) as count FROM customers`, { type: QueryTypes.SELECT }),
      sequelize.query(`SELECT COUNT(*) as total, SUM(CASE WHEN status='delivered' THEN 1 ELSE 0 END) as delivered FROM shipments`, { type: QueryTypes.SELECT }).catch(() => [{ total: 0, delivered: 0 }]),
    ]);

    const totalOrders = Number(totalOrdersRes[0].count ?? 0);
    const delivered   = Number(deliveredRes[0].count ?? 0);
    const totalShipments     = Number(shipmentsRes[0]?.total ?? 0);
    const deliveredShipments = Number(shipmentsRes[0]?.delivered ?? 0);

    res.json({
      ordersToday: Number(todayRes[0].count ?? 0),
      ordersThisMonth: Number(monthRes[0].count ?? 0),
      revenueToday: Number(todayRes[0].revenue ?? 0),
      revenueThisMonth: Number(monthRes[0].revenue ?? 0),
      cancelledCount: Number(cancelledRes[0].count ?? 0),
      deliveredCount: delivered,
      conversionRate: totalOrders > 0 ? Math.round((delivered / totalOrders) * 100) : 0,
      totalCustomers: Number(totalCustomersRes[0].count ?? 0),
      deliverySuccessRate: totalShipments > 0 ? Math.round((deliveredShipments / totalShipments) * 100) : 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getTopProducts(req, res) {
  try {
    const limit = Math.min(Number(req.query.limit) || 5, 20);
    const result = await sequelize.query(
      `SELECT product, COUNT(*) as total_orders, COALESCE(SUM(CAST(price AS NUMERIC) * quantity), 0) as total_revenue
       FROM orders GROUP BY product ORDER BY total_orders DESC LIMIT :limit`,
      { replacements: { limit }, type: QueryTypes.SELECT }
    );
    res.json(result.map((r) => ({ product: String(r.product), totalOrders: Number(r.total_orders), totalRevenue: Number(r.total_revenue) })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getOrdersByStatus(_req, res) {
  try {
    const result = await sequelize.query(`SELECT status, COUNT(*) as count FROM orders GROUP BY status`, { type: QueryTypes.SELECT });
    res.json(result.map((r) => ({ status: r.status, count: Number(r.count) })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getOrdersBySource(_req, res) {
  try {
    const result = await sequelize.query(`SELECT source, COUNT(*) as count FROM orders GROUP BY source`, { type: QueryTypes.SELECT });
    res.json(result.map((r) => ({ source: r.source, count: Number(r.count) })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getOrdersByChannel(_req, res) {
  try {
    const result = await sequelize.query(
      `SELECT source as channel, COUNT(*) as orders, COALESCE(SUM(CAST(price AS NUMERIC) * quantity), 0) as revenue FROM orders GROUP BY source ORDER BY orders DESC`,
      { type: QueryTypes.SELECT }
    );
    res.json(result.map((r) => ({ channel: r.channel, orders: Number(r.orders), revenue: Number(r.revenue) })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
