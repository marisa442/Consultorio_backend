import express from "express";
import {
  getExamenesSolicitados,
  getExamenSolicitadoById,
  createExamenSolicitado,
  updateExamenSolicitado,
  deleteExamenSolicitado,
} from "../controller/ExamenSolicitadoController.js";
import { verifyToken, verifyRol } from "../middleware/auth.js";

const router = express.Router();

router.get("/examenes-solicitados", verifyToken, getExamenesSolicitados);
router.get("/examenes-solicitados/:id", verifyToken, getExamenSolicitadoById);
router.post(
  "/examenes-solicitados",
  verifyToken,
  verifyRol("administrador", "medico"),
  createExamenSolicitado
);
router.put(
  "/examenes-solicitados/:id",
  verifyToken,
  verifyRol("administrador", "medico"),
  updateExamenSolicitado
);
router.delete(
  "/examenes-solicitados/:id",
  verifyToken,
  verifyRol("administrador", "medico"),
  deleteExamenSolicitado
);

export default router;
