import express from "express";
import {
  getCitas,
  getCitaById,
  createCita,
  updateCita,
  updateEstadoCita,
  deleteCita,
} from "../controller/CitaController.js";
import { verifyToken, verifyRol } from "../middleware/auth.js";

const router = express.Router();

// Citas es operativa clinica del dia a dia (paciente solicita, medico
// atiende): administrador queda fuera a proposito, no gestiona la agenda.
// Entre medico/paciente las reglas distintas segun dueño del recurso se
// resuelven dentro de cada controller.
router.get("/citas", verifyToken, verifyRol("medico", "paciente"), getCitas);
router.get("/citas/:id", verifyToken, verifyRol("medico", "paciente"), getCitaById);
router.post("/citas", verifyToken, verifyRol("medico", "paciente"), createCita);
router.put("/citas/:id", verifyToken, verifyRol("medico", "paciente"), updateCita);
router.patch("/citas/:id/estado", verifyToken, verifyRol("medico", "paciente"), updateEstadoCita);
router.delete("/citas/:id", verifyToken, verifyRol("medico", "paciente"), deleteCita);

export default router;
