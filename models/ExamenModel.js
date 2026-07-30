import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

const Examen = sequelize.define('Examen', {
  id: { 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  costo: {
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false,
  }
}, {
  tableName: 'examens',
  timestamps: true,
});

export default Examen;