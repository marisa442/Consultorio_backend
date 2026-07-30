import { Router } from "express";
import { getExamenes,getExamenByCodigo, createExamen,updateExamen,deleteExamen} from '../controllers/ExamenController.js';

const router = Router();

router.get("/", getExamenes);
router.get("/:codigo", getExamenByCodigo);
router.post("/", createExamen);
router.put("/:codigo", updateExamen);
router.delete("/:codigo", deleteExamen);

export default router;