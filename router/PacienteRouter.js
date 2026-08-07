import express from "express";
import {
  getPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente,
  deletePaciente,
} from "../controller/PacienteController.js";
import { verifyToken, verifyRol } from "../middleware/auth.js";

const router = express.Router();

// El listado completo es solo para administrador/medico; un paciente consulta
// o edita su propio registro via /:id (la pertenencia se valida en el controller).
router.get("/pacientes", verifyToken, verifyRol("administrador", "medico"), getPacientes);
router.get("/pacientes/:id", verifyToken, getPacienteById);
router.post("/pacientes", verifyToken, verifyRol("administrador", "medico"), createPaciente);
router.put("/pacientes/:id", verifyToken, updatePaciente);
router.delete("/pacientes/:id", verifyToken, verifyRol("administrador", "medico"), deletePaciente);

export default router;
