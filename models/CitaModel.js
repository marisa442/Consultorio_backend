import { DataTypes } from "sequelize";
import { sequelize } from "../db/conexion.js";

export const CitaModel = sequelize.define(
  "citas",
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    paciente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    medico_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_solicitud: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_hora_atencion: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    modalidad: {
      type: DataTypes.ENUM("presencial", "virtual"),
      allowNull: false,
    },
    motivo_consulta: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM(
        "solicitada",
        "confirmada",
        "atendida",
        "cancelada",
        "no_asistida"
      ),
      allowNull: false,
      defaultValue: "solicitada",
    },
  },
  {
    timestamps: true,
  }
);
