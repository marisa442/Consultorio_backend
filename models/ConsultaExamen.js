const { DataTypes } = require('sequelize');
const sequelize = require('../db/conexion');
const Consulta = require('./Consulta');

const ConsultaExamen = sequelize.define('ConsultaExamen', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  consulta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Consulta,
      key: 'id'
    }
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

module.exports = ConsultaExamen;