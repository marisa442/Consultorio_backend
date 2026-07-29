import { Router } from "express";
import { getExamenes,getExamenByCodigo, createExamen,updateExamen,deleteExamen} from '../controller/ExamenController.js';
const router = express.Router();
router.get("/examenes", getExamenes);
router.get("/examenes/:codigo", getExamenByCodigo);
router.post("/examenes", createExamen);
router.put("/examenes/:codigo", updateExamen);
router.delete("/examenes/:codigo", deleteExamen);
export const examenesRouter = router;