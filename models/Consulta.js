const { DataTypes } = require('sequelize');
const sequelize = require('../db/conexion');
const Cita = require('./Cita');

const Consulta = sequelize.define('Consulta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cita_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Garantiza máximo una consulta por cita
    references: {
      model: Cita,
      key: 'id'
    }
  },
  sintomas: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  diagnostico: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  recomendaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fecha_atencion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'consultas',
  timestamps: false
});

module.exports = Consulta;