import express from "express";
import {
  getExamenes,
  getExamenById,
  createExamen,
  updateExamen,
  deleteExamen,
} from "../controller/ExamenController.js";
import { verifyToken, verifyRol } from "../middleware/auth.js";

const router = express.Router();

router.get("/examenes", verifyToken, getExamenes);
router.get("/examenes/:id", verifyToken, getExamenById);
router.post("/examenes", verifyToken, verifyRol("administrador"), createExamen);
router.put("/examenes/:id", verifyToken, verifyRol("administrador"), updateExamen);
router.delete("/examenes/:id", verifyToken, verifyRol("administrador"), deleteExamen);

export default router;
