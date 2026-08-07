import express from "express";
import {
  getDetalleRecetas,
  getDetalleRecetaById,
  createDetalleReceta,
  updateDetalleReceta,
  deleteDetalleReceta,
} from "../controller/DetalleRecetaController.js";
import { verifyToken, verifyRol } from "../middleware/auth.js";

const router = express.Router();

router.get("/detalle-recetas", verifyToken, getDetalleRecetas);
router.get("/detalle-recetas/:id", verifyToken, getDetalleRecetaById);
router.post("/detalle-recetas", verifyToken, verifyRol("administrador", "medico"), createDetalleReceta);
router.put("/detalle-recetas/:id", verifyToken, verifyRol("administrador", "medico"), updateDetalleReceta);
router.delete("/detalle-recetas/:id", verifyToken, verifyRol("administrador", "medico"), deleteDetalleReceta);

export default router;
