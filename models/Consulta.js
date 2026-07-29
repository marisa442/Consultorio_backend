import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const Consulta = sequelize.define(
    'Consulta',
    {
        id_consulta: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_cita: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true, // una cita atendida genera como máximo una consulta
        },
        diagnostico: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        sintomas: {
            type: DataTypes.TEXT,
            allowNull: true,
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
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'consultas',
        timestamps: true,
    }
);
