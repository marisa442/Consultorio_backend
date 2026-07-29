import express from 'express';
import { 
  getMedicos, 
  getMedicoById, 
  createMedico, 
  updateMedico, 
  deleteMedico 
} from '../controller/MedicoController.js'; // Revisa si tu carpeta se llama controller o controllers

const router = express.Router();

router.get('/', getMedicos);
router.get('/:id', getMedicoById);
router.post('/', createMedico);
router.put('/:id', updateMedico);
router.delete('/:id', deleteMedico);

export default router;