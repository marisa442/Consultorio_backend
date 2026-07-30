import { Router } from 'express';
import { obtenerConsultas, obtenerConsultaPorId, crearConsulta, actualizarConsulta } from '../controllers/ConsultaController.js';

const router = Router();

router.get('/', obtenerConsultas);
router.get('/:id', obtenerConsultaPorId);
router.post('/', crearConsulta);
router.put('/:id', actualizarConsulta);

export default router;