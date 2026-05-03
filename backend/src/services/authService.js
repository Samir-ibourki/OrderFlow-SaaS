import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/jwt.js";

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
