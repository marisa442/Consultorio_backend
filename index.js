import express from 'express';
import cors from "cors";
import { PORT } from './config/config.js';
import { sequelize } from "./db/conexion.js";

// Importa todos los modelos y sus asociaciones antes de sincronizar
import './models/index.js';

import authRouter from './router/AuthRouter.js';
import especialidadRouter from './router/EspecialidadRouter.js';
import pacienteRouter from './router/PacienteRouter.js';
import medicoRouter from './router/MedicoRouter.js';
import citaRouter from './router/CitaRouter.js';
import consultaRouter from './router/ConsultaRouter.js';
import medicamentoRouter from './router/MedicamentoRouter.js';
import detalleRecetaRouter from './router/DetalleRecetaRouter.js';
import examenRouter from './router/ExamenRouter.js';
import examenSolicitadoRouter from './router/ExamenSolicitadoRouter.js';

const _PORT = PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', authRouter);
app.use('/api', especialidadRouter);
app.use('/api', pacienteRouter);
app.use('/api', medicoRouter);
app.use('/api', citaRouter);
app.use('/api', consultaRouter);
app.use('/api', medicamentoRouter);
app.use('/api', detalleRecetaRouter);
app.use('/api', examenRouter);
app.use('/api', examenSolicitadoRouter);

app.use((req, res) => {
    res.status(404).json({ message: 'not found' });
});

const main = async () => {
    try {
        await sequelize.authenticate();
        console.log('Base de datos conectada.');
        await sequelize.sync({ alter: false })
        app.listen(_PORT, () => {
            console.log(`Servidor corriendo en el puerto => ${_PORT}`);
        });
    } catch (error) {
        console.log(`Error ${error}`);
    }
}
main();
