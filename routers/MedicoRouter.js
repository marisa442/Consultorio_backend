import { Router } from 'express';
import { getMedicos, getMedicoById, createMedico, updateMedico, deleteMedico } from '../controllers/MedicoController.js'; 

const router = Router();

router.get('/', getMedicos);
router.get('/:id', getMedicoById);
router.post('/', createMedico);
router.put('/:id', updateMedico);
router.delete('/:id', deleteMedico);

export default router;