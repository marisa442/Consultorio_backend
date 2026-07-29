import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

const Receta = sequelize.define('Receta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  codigoReceta: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'codigo_receta',
  },
  pacienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'paciente_id',
  },
  medicoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'medico_id',
  },
  fechaEmision: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'fecha_emision',
  },
  diagnostico: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'Activa', // 'Activa', 'Completada', 'Cancelada'
  },
}, {
  tableName: 'recetas',
  timestamps: true,
});

export { Receta };