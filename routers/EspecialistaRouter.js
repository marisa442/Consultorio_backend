import { Router } from 'express';
import { obtenerEspecialidades, crearEspecialidad, actualizarEspecialidad, eliminarEspecialidad } from '../controllers/EspecialistaController.js';

const router = Router();

router.get('/', obtenerEspecialidades);
router.post('/', crearEspecialidad);
router.put('/:id', actualizarEspecialidad);
router.delete('/:id', eliminarEspecialidad);

export default router;