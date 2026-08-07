import { DataTypes } from "sequelize";
import { sequelize } from "../db/conexion.js";

// Usuarios del sistema (personal administrativo/recepcion que usa la aplicacion)
export const UsuarioModel = sequelize.define(
  "usuarios",
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Roles reales del sistema. "administrador" gestiona catalogos y usuarios,
    // "medico" atiende citas/consultas propias, "paciente" solicita citas y
    // consulta su propio historial. Debe coincidir 1:1 con RolUsuario del frontend.
    rol: {
      type: DataTypes.ENUM("administrador", "medico", "paciente"),
      allowNull: false,
      defaultValue: "paciente",
    },
    // Si rol = "paciente", vincula esta cuenta con su registro en Paciente.
    paciente_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // Si rol = "medico", vincula esta cuenta con su registro en Medico.
    medico_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
