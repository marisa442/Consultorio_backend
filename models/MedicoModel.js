import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

const Medico = sequelize.define('Medico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  numeroIdentificacion: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  nombres: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  correoElectronico: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { 
      isEmail: true 
    },
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  numeroLicenciaProfesional: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
  especialidadId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'especialidad_id',
  },
}, {
  tableName: 'medicos',
  timestamps: true,
});

export { Medico };