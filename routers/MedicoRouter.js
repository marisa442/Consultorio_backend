import express from "express";
import {
  getMedicos,
  getMedicoById,
  createMedico,
  updateMedico,
  deleteMedico,
} from "../controller/MedicoController.js";
import { verifyToken, verifyRol } from "../middleware/auth.js";

const router = express.Router();

// Lectura abierta a los 3 roles: un paciente necesita ver el listado de
// medicos (por especialidad) para elegir con quien solicitar su cita.
router.get("/medicos", verifyToken, getMedicos);
router.get("/medicos/:id", verifyToken, getMedicoById);
router.post("/medicos", verifyToken, verifyRol("administrador"), createMedico);
router.put("/medicos/:id", verifyToken, verifyRol("administrador"), updateMedico);
router.delete("/medicos/:id", verifyToken, verifyRol("administrador"), deleteMedico);

export default router;
