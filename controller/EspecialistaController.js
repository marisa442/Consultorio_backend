import Especialista from '../models/Especialista.js';

export const obtenerEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialista.findAll();
    return res.status(200).json(especialidades);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener las especialidades', error: error.message });
  }
};

export const crearEspecialidad = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ mensaje: 'El nombre de la especialidad es obligatorio' });
    }

    const nuevaEspecialidad = await Especialista.create({ nombre, descripcion });
    return res.status(201).json(nuevaEspecialidad);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al crear la especialidad', error: error.message });
  }
};

export const actualizarEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const especialidad = await Especialista.findByPk(id);

    if (!especialidad) {
      return res.status(404).json({
        mensaje: "Especialidad no encontrada"
      });
    }

    await especialidad.update({
      nombre,
      descripcion
    });

    return res.status(200).json(especialidad);

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar la especialidad",
      error: error.message
    });
  }
};

import Medico from "../models/Medico.js";

export const eliminarEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;

    const especialidad = await Especialista.findByPk(id);

    if (!especialidad) {
      return res.status(404).json({
        mensaje: "Especialidad no encontrada"
      });
    }

    const medicos = await Medico.count({
      where: {
        especialidadId: id
      }
    });

    if (medicos > 0) {
      return res.status(400).json({
        mensaje: "No se puede eliminar la especialidad porque tiene médicos asociados."
      });
    }

    await especialidad.destroy();

    return res.status(200).json({
      mensaje: "Especialidad eliminada correctamente"
    });

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al eliminar la especialidad",
      error: error.message
    });
  }
};