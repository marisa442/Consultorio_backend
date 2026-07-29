import { sequelize } from "sequelize";
import { DataTypes,DATE } from "../db/conexion.js";


export const Paciente = sequelize.define("Pacientes", {
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
    type: DataTypes.STRING(1),
    allowNull: false,
  },
  correo_electronico: {
    type: DataTypes.STRING,
    allowNull: false,
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
}, {
  timestamps: false,
});
