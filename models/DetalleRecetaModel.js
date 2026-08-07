import { DataTypes } from "sequelize";
import { sequelize } from "../db/conexion.js";

// Detalle de receta: resuelve la relacion N:M entre Consulta y Medicamento
export const DetalleRecetaModel = sequelize.define(
  "detalle_recetas",
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
    medicamento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dosis: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    frecuencia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duracion_tratamiento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    indicaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);
