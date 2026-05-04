import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { sequelize } from "./src/models/index.js";

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

app.use(helmet());

const corsOptions = {
  origin: "http://localhost:5173", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    success: false,
    message: "Trop de requêtes depuis cette adresse IP, veuillez réessayer après 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", apiLimiter, authRoutes);
app.use("/api/orders", apiLimiter, orderRoutes);
app.use("/api/customers", apiLimiter, customerRoutes);
app.use("/api/products", apiLimiter, productRoutes);
app.use("/api/shipping", apiLimiter, shippingRoutes);
app.use("/api/analytics", apiLimiter, analyticsRoutes);

app.use("/api/webhooks", webhookRoutes);

app.use(errorHandler);

sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced successfully!"))
  .catch((err) => console.log("Error DB:", err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});