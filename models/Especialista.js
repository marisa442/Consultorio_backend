import { DataTypes } from 'sequelize';
import sequelize from '../db/conexion.js';

const Especialista = sequelize.define('Especialista', {
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
  timestamps: false
});

export default Especialista;