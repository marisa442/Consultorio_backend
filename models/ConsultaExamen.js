import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const ConsultaExamen = sequelize.define(
    'ConsultaExamen',
    {
        id_consulta_examen: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_consulta: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_examen: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fecha_solicitud: {
            type: DataTypes.DATE,
            allowNull: false,
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
            type: DataTypes.ENUM(
                'solicitado',
                'realizado',
                'entregado',
                'cancelado'
            ),
            allowNull: false,
            defaultValue: 'solicitado',
        },
    },
    {
        tableName: 'consulta_examenes',
        timestamps: true,
    }
);
