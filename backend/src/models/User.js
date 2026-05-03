import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "password_hash",
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "merchant",
  },
}, {
  tableName: "users",
  underscored: true,
});

export default User;
