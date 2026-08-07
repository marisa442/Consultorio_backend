import { DataTypes } from "sequelize";
import { sequelize } from "../db/conexion.js";

export const PacienteModel = sequelize.define(
  "pacientes",
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    numero_identificacion: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nombres: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    sexo: {
      type: DataTypes.ENUM("M", "F"),
      allowNull: false,
    },
    correo_electronico: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tipo_paciente: {
      type: DataTypes.ENUM("estudiante", "docente", "administrativo"),
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
  }
);
