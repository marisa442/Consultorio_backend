import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

const Especialidad = sequelize.define('Especialidad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'especialidades',
  timestamps: true
});

export default Especialidad;