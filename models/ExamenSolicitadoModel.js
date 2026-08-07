import { DataTypes } from "sequelize";
import { sequelize } from "../db/conexion.js";

// Examen solicitado: resuelve la relacion N:M entre Consulta y Examen
export const ExamenSolicitadoModel = sequelize.define(
  "examenes_solicitados",
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    consulta_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    examen_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_solicitud: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    resultado: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha_resultado: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("solicitado", "realizado", "entregado", "cancelado"),
      allowNull: false,
      defaultValue: "solicitado",
    },
  },
  {
    timestamps: true,
  }
);
