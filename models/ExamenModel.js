import { DataTypes,DATE } from "sequelize";
import { sequelize } from "../db/conexion.js"; 

export const ExamenModel = sequelize.define("examenes", {
  codigo: {
    type: DataTypes.STRING,     
    primaryKey: true,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  costo: {
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false,
  }
}, {
  timestamps: false,
}
);
