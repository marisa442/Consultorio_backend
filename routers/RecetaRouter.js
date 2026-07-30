import { Router } from 'express';
import { getDetallesReceta, getDetallesByConsulta, createDetalleReceta, deleteDetalleReceta } from '../controllers/DetalleRecetaController.js';

const router = Router();

router.get('/', getDetallesReceta);
router.get('/consulta/:consulta_id', getDetallesByConsulta);
router.post('/', createDetalleReceta);
router.delete('/:id', deleteDetalleReceta);

export default router;