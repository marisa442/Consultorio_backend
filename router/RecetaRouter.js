import express from 'express';
import { 
  getRecetas, 
  getRecetaById, 
  getRecetasByPaciente,
  createReceta, 
  updateReceta, 
  deleteReceta 
} from '../controller/RecetaController.js';

const router = express.Router();

// Rutas de Recetas
router.get('/', getRecetas);
router.get('/:id', getRecetaById);
router.get('/paciente/:pacienteId', getRecetasByPaciente);
router.post('/', createReceta);
router.put('/:id', updateReceta);
router.delete('/:id', deleteReceta);

export default router;