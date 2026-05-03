import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const WebhookEvent = sequelize.define("WebhookEvent", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  channel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventType: {
    type: DataTypes.STRING,
    defaultValue: "order",
    field: "event_type",
  },
  rawPayload: {
    type: DataTypes.JSONB,
    allowNull: false,
    field: "raw_payload",
  },
  processed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  orderId: {
    type: DataTypes.INTEGER,
    field: "order_id",
  },
}, {
  tableName: "webhook_events",
  underscored: true,
});

export default WebhookEvent;
