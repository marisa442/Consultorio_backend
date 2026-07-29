import { Receta } from '../models/RecetaModel.js';
import { Medico } from '../models/MedicoModel.js';

// 1. OBTENER TODAS LAS RECETAS
export const getRecetas = async (req, res) => {
  try {
    const { page = 1, limit = 10, estado } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const whereCondition = {};

    if (estado) {
      whereCondition.estado = estado;
    }

    const { count, rows: recetas } = await Receta.findAndCountAll({
      where: whereCondition,
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Medico,
          attributes: ['id', 'nombres', 'apellidos', 'numeroLicenciaProfesional']
        }
      ]
    });

    res.status(200).json({
      ok: true,
      totalRegistros: count,
      paginaActual: Number(page),
      totalPaginas: Math.ceil(count / limit),
      data: recetas
    });
  } catch (error) {
    console.error('Error en getRecetas:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al consultar las recetas',
      error: error.message
    });
  }
};

// 2. OBTENER RECETA POR ID
export const getRecetaById = async (req, res) => {
  try {
    const { id } = req.params;

    const receta = await Receta.findByPk(id, {
      include: [
        {
          model: Medico,
          attributes: ['id', 'nombres', 'apellidos', 'numeroLicenciaProfesional', 'correoElectronico']
        }
      ]
    });

    if (!receta) {
      return res.status(404).json({ ok: false, mensaje: 'Receta no encontrada' });
    }

    res.status(200).json({ ok: true, data: receta });
  } catch (error) {
    console.error('Error en getRecetaById:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener la receta',
      error: error.message
    });
  }
};

// 3. OBTENER RECETAS DE UN PACIENTE ESPECÍFICO
export const getRecetasByPaciente = async (req, res) => {
  try {
    const { pacienteId } = req.params;

    const recetas = await Receta.findAll({
      where: { pacienteId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Medico,
          attributes: ['id', 'nombres', 'apellidos']
        }
      ]
    });

    res.status(200).json({
      ok: true,
      total: recetas.length,
      data: recetas
    });
  } catch (error) {
    console.error('Error en getRecetasByPaciente:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al consultar las recetas del paciente',
      error: error.message
    });
  }
};

// 4. CREAR UNA NUEVA RECETA
export const createReceta = async (req, res) => {
  try {
    const { codigoReceta, pacienteId, medicoId, fechaEmision, diagnostico, observaciones } = req.body;

    if (!pacienteId || !medicoId || !diagnostico) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan campos requeridos: pacienteId, medicoId y diagnostico son obligatorios.'
      });
    }

    const nuevaReceta = await Receta.create({
      codigoReceta: codigoReceta || `REC-${Date.now()}`,
      pacienteId,
      medicoId,
      fechaEmision: fechaEmision || new Date(),
      diagnostico: diagnostico.trim(),
      observaciones: observaciones ? observaciones.trim() : null,
      estado: 'Activa'
    });

    res.status(201).json({
      ok: true,
      mensaje: 'Receta creada exitosamente',
      data: nuevaReceta
    });
  } catch (error) {
    console.error('Error en createReceta:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al registrar la receta',
      error: error.message
    });
  }
};

// 5. ACTUALIZAR RECETA
export const updateReceta = async (req, res) => {
  try {
    const { id } = req.params;

    const receta = await Receta.findByPk(id);
    if (!receta) {
      return res.status(404).json({ ok: false, mensaje: 'Receta no encontrada' });
    }

    await receta.update(req.body);

    res.status(200).json({
      ok: true,
      mensaje: 'Receta actualizada correctamente',
      data: receta
    });
  } catch (error) {
    console.error('Error en updateReceta:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al actualizar la receta',
      error: error.message
    });
  }
};

// 6. ELIMINAR / CANCELAR RECETA
export const deleteReceta = async (req, res) => {
  try {
    const { id } = req.params;

    const receta = await Receta.findByPk(id);
    if (!receta) {
      return res.status(404).json({ ok: false, mensaje: 'Receta no encontrada' });
    }

    await receta.update({ estado: 'Cancelada' });

    res.status(200).json({
      ok: true,
      mensaje: 'Receta cancelada exitosamente'
    });
  } catch (error) {
    console.error('Error en deleteReceta:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al anular la receta',
      error: error.message
    });
  }
};