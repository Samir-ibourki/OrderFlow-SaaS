import sequelize from "../config/database.js";
import Customer from "./Customer.js";
import Product from "./Product.js";
import Order from "./Order.js";
import User from "./User.js";
import Shipment from "./Shipment.js";
import WebhookEvent from "./WebhookEvent.js";

Customer.hasMany(Order, { foreignKey: "customerPhone", sourceKey: "phone" });
Order.belongsTo(Customer, { foreignKey: "customerPhone", targetKey: "phone" });

Shipment.belongsTo(Order, { foreignKey: "orderId" });
Order.hasOne(Shipment, { foreignKey: "orderId" });

export {
  sequelize,
  Customer,
  Product,
  Order,
  User,
  Shipment,
  WebhookEvent
};
