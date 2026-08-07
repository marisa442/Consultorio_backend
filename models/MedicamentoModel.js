import { DataTypes } from "sequelize";
import { sequelize } from "../db/conexion.js";

export const MedicamentoModel = sequelize.define(
  "medicamentos",
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    presentacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    concentracion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Inventario/farmacia: precio unitario y unidades en stock.
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    cantidad_disponible: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // true = disponible, false = no disponible
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
  }
);
