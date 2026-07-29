import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

const Medicamento = sequelize.define('Medicamento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  codigo: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  formaFarmaceutica: {
    type: DataTypes.STRING(50), // Ejemplo: Jarabe, Pastillas, Inyectable, etc.
    allowNull: false,
  },
  concentracion: {
    type: DataTypes.STRING(50), // Ejemplo: 500mg, 10ml, etc.
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
}, {
  tableName: 'medicamentos',
  timestamps: true,
});

export { Medicamento };