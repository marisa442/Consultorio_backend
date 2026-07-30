import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

const DetalleReceta = sequelize.define('DetalleReceta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  frecuencia: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  duracion_tratamiento: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  indicaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'detalle_recetas',
  timestamps: false
});

export default DetalleReceta;