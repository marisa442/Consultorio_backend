import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const Especialidad = sequelize.define(
    'Especialidad',
    {
        id_especialidad: {
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
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        tableName: 'especialidades',
        timestamps: true,
    }
);

module.exports = Especialista;