import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Accès refusé. Token manquant.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status().json({
        success: false,
        message: "Token expire. Veuillez vous reconnecter",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        successs: false,
        message: "Token invalide",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Erreur d'authentification",
      error: error.message,
    });
  }
};