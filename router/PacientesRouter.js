import express from 'express';
import { getPacientes,getPacienteByid,getPacientesBusqueda,createPaciente,updatePaciente,deletePaciente } from '../controller/PacientesController.js';

const router = express.Router();

router.get("/paci",getPacientes);
router.get("/paci/:id", getPacienteByid);
router.get("/paci/buscar", getPacientesBusqueda);
router.post("/paci",createPaciente);
router.put("/paci/:id",updatePaciente);
router.delete("/paci/:id",deletePaciente);

export const pacientesRouter = router;