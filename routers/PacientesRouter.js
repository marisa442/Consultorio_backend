import { Router } from "express";
import { getPacientes,getPacienteByid,getPacientesBusqueda,createPaciente,updatePaciente,deletePaciente } from '../controllers/PacientesController.js';

const router = Router();

router.get("/", getPacientes);
router.get("/:id", getPacienteByid);
router.get("/buscar", getPacientesBusqueda);
router.post("/", createPaciente);
router.put("/:id", updatePaciente);
router.delete("/:id", deletePaciente);

export default router;