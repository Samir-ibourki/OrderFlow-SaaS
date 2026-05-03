import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Shipment = sequelize.define("Shipment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    field: "order_id",
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
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
  courier: {
    type: DataTypes.STRING,
  },
  trackingNumber: {
    type: DataTypes.STRING,
    field: "tracking_number",
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
  labelUrl: {
    type: DataTypes.STRING,
    field: "label_url",
  },
  estimatedDelivery: {
    type: DataTypes.DATE,
    field: "estimated_delivery",
  },
}, {
  tableName: "shipments",
  underscored: true,
});

export default Shipment;
