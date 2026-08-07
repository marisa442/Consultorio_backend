import express from "express";
import {
  getMedicamentos,
  getMedicamentoById,
  createMedicamento,
  updateMedicamento,
  deleteMedicamento,
} from "../controller/MedicamentoController.js";
import { verifyToken, verifyRol } from "../middleware/auth.js";

const router = express.Router();

router.get("/medicamentos", verifyToken, getMedicamentos);
router.get("/medicamentos/:id", verifyToken, getMedicamentoById);
router.post("/medicamentos", verifyToken, verifyRol("administrador"), createMedicamento);
router.put("/medicamentos/:id", verifyToken, verifyRol("administrador"), updateMedicamento);
router.delete("/medicamentos/:id", verifyToken, verifyRol("administrador"), deleteMedicamento);

export default router;
