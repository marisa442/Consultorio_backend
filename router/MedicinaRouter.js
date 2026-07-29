import express from 'express';
import { 
  getMedicamentos, 
  getMedicamentoById, 
  createMedicamento, 
  updateMedicamento, 
  deleteMedicamento 
} from '../controller/MedicamentoController.js';

const router = express.Router();

router.get('/', getMedicamentos);
router.get('/:id', getMedicamentoById);
router.post('/', createMedicamento);
router.put('/:id', updateMedicamento);
router.delete('/:id', deleteMedicamento);

export default router;