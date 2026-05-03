import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Customer = sequelize.define("Customer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  city: {
    type: DataTypes.STRING,
  },
}, {
  tableName: "customers",
  underscored: true,
});

export default Customer;
