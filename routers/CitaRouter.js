import { Router } from 'express';
import { obtenerCitas, obtenerCitaPorId, crearCita, actualizarCita, cambiarEstadoCita, obtenerCitasPorPaciente, obtenerCitasPorMedico } from '../controllers/CitaController.js';

const router = Router();

router.get('/', obtenerCitas);
router.post('/', crearCita);

router.get('/:id', obtenerCitaPorId);
router.put('/:id', actualizarCita);
router.patch('/:id/estado', cambiarEstadoCita); 

router.get('/paciente/:paciente_id', obtenerCitasPorPaciente);
router.get('/medico/:medico_id', obtenerCitasPorMedico);

export default router;