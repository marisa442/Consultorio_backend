import express from "express";
import {
  getEspecialidades,
  getEspecialidadById,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad,
} from "../controller/EspecialidadController.js";
import { verifyToken, verifyRol } from "../middleware/auth.js";

const router = express.Router();

router.get("/especialidades", verifyToken, getEspecialidades);
router.get("/especialidades/:id", verifyToken, getEspecialidadById);
router.post("/especialidades", verifyToken, verifyRol("administrador"), createEspecialidad);
router.put("/especialidades/:id", verifyToken, verifyRol("administrador"), updateEspecialidad);
router.delete("/especialidades/:id", verifyToken, verifyRol("administrador"), deleteEspecialidad);

export default router;
