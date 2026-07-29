import { DataTypes } from 'sequelize';
import sequelize from '../db/conexion.js';

const Cita = sequelize.define('Cita', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  paciente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  medico_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_solicitud: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fecha_atencion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora_atencion: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  modalidad: {
    type: DataTypes.ENUM('presencial', 'virtual'),
    allowNull: false,
    defaultValue: 'presencial',
  },
  motivo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('solicitada', 'confirmada', 'atendida', 'cancelada', 'no_asistida'),
    allowNull: false,
    defaultValue: 'solicitada',
  }
}, {
  tableName: 'citas',
  timestamps: false
});

export default Cita;