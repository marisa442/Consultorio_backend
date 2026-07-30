import { Router } from 'express';
import { obtenerExamenesPorConsulta, solicitarExamenes, registrarResultado } from '../controllers/ConsultaExamenController.js';

const router = Router();

router.get('/consulta/:consulta_id', obtenerExamenesPorConsulta);
router.post('/', solicitarExamenes);
router.put('/:id/resultado', registrarResultado);

export default router;