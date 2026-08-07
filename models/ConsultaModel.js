import { DataTypes } from "sequelize";
import { sequelize } from "../db/conexion.js";

export const ConsultaModel = sequelize.define(
  "consultas",
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    cita_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // maximo una consulta por cita
    },
    diagnostico: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sintomas: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recomendaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha_atencion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
  }
);
