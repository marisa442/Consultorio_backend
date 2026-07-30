import express from 'express';
import cors from "cors";
import { PORT } from './config/config.js';
import { sequelize } from "./db/conexion.js";

import './models/relaciones.js'; 

import citaRoutes from './routers/CitaRouter.js';
import consultaRoutes from './routers/ConsultaRouter.js';
import consultaExamenRoutes from './routers/ConsultaExamenRouter.js';
import especialidadRoutes from './routers/EspecialistaRouter.js';
import examenRoutes from './routers/ExamenRouter.js';
import medicamentoRoutes from './routers/MedicinaRouter.js';
import medicoRoutes from './routers/MedicoRouter.js';
import pacienteRoutes from './routers/PacientesRouter.js';
import recetaRoutes from './routers/RecetaRouter.js';

const _PORT = PORT || 3000;
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// ============ RUTAS ============
app.use('/api/citas', citaRoutes);
app.use('/api/consultas', consultaRoutes);
app.use('/api/examenes-solicitados', consultaExamenRoutes);
app.use('/api/especialidades', especialidadRoutes);
app.use('/api/examenes', examenRoutes);
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/recetas', recetaRoutes);

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

const main = async () => {
    try {
        await sequelize.authenticate();
        console.log('Base de datos conectada.');
        
        await sequelize.sync({ alter: false });
        console.log('Modelos sincronizados correctamente.');

        app.listen(_PORT, () => {
            console.log(`Servidor corriendo en el puerto => ${_PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
}

main();