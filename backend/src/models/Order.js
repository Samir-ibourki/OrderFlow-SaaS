import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: "order_number",
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "customer_name",
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "customer_phone",
  },
  customerCity: {
    type: DataTypes.STRING,
    field: "customer_city",
  },
  product: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM(
      "new_order",
      "pending_confirmation",
      "ready_to_ship",
      "in_delivery",
      "delivered",
      "cancelled"
    ),
    allowNull: false,
    defaultValue: "new_order",
  },
  source: {
    type: DataTypes.ENUM(
      "whatsapp",
      "instagram",
      "tiktok",
      "facebook",
      "website",
      "manual"
    ),
    allowNull: false,
    defaultValue: "manual",
  },
}, {
  tableName: "orders",
  underscored: true,
});

export default Order;
