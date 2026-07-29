import { DataTypes } from 'sequelize';
import sequelize from '../db/conexion.js';

const ConsultaExamen = sequelize.define('ConsultaExamen', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  consulta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  examen_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_solicitud: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  resultado: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fecha_resultado: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('solicitado', 'realizado', 'entregado', 'cancelado'),
    allowNull: false,
    defaultValue: 'solicitado',
  }
}, {
  tableName: 'consulta_examenes',
  timestamps: false
});

export default ConsultaExamen;