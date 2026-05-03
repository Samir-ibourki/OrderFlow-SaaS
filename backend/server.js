import express from "express";
import cors from "cors";
import sequelize from "./src/config/database.js";

// Models (Import for side effects and sync)
import "./src/models/User.js";
import "./src/models/Customer.js";
import "./src/models/Product.js";
import "./src/models/Order.js";
import "./src/models/Shipment.js";
import "./src/models/WebhookEvent.js";

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import customerRoutes from "./src/routes/customerRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import shippingRoutes from "./src/routes/shippingRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";
import webhookRoutes from "./src/routes/webhookRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Middleware
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/webhooks", webhookRoutes);

app.use(errorHandler);

// Sync Database
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced successfully!"))
  .catch((err) => console.log("Error DB:", err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
