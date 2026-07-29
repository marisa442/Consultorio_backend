import { Router } from 'express';
import { 
  obtenerExamenesSolicitados, 
  obtenerExamenSolicitadoPorId, 
  obtenerExamenesPorConsulta, 
  solicitarExamenes, 
  registrarResultado, 
  cambiarEstadoExamen 
} from '../controller/ConsultaExamenController.js';

const router = Router();

router.get('/', obtenerExamenesSolicitados);
router.post('/', solicitarExamenes);

router.get('/consulta/:consulta_id', obtenerExamenesPorConsulta);

router.get('/:id', obtenerExamenSolicitadoPorId);
router.put('/:id/resultado', registrarResultado);
router.patch('/:id/estado', cambiarEstadoExamen);

export default router;