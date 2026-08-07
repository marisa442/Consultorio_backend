import express from "express";
import {
  getConsultas,
  getConsultaById,
  createConsulta,
  updateConsulta,
  deleteConsulta,
} from "../controller/ConsultaController.js";
import { verifyToken, verifyRol } from "../middleware/auth.js";

const router = express.Router();

// Igual que citas: consultas es historial clinico, administrador queda fuera.
// Lectura: medico/paciente (filtrado por dueño dentro del controller).
// Escritura y borrado: exclusivo de quien atendio la cita (validado en el
// controller, ver esDuenoDeConsulta).
router.get("/consultas", verifyToken, verifyRol("medico", "paciente"), getConsultas);
router.get("/consultas/:id", verifyToken, verifyRol("medico", "paciente"), getConsultaById);
router.post("/consultas", verifyToken, verifyRol("medico"), createConsulta);
router.put("/consultas/:id", verifyToken, verifyRol("medico"), updateConsulta);
router.delete("/consultas/:id", verifyToken, verifyRol("medico"), deleteConsulta);

export default router;
