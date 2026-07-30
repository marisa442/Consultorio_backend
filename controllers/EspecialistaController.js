import { Op } from "sequelize";
import Especialidad from '../models/Especialidad.js';
import Medico from '../models/MedicoModel.js';

export const obtenerEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidad.findAll({
      order: [['nombre', 'ASC']]
    });
    return res.status(200).json(especialidades);
  } catch (error) {
    return res.status(500).json({ 
      mensaje: 'Error al obtener las especialidades', 
      error: error.message 
    });
  }
};

export const crearEspecialidad = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ 
        mensaje: 'El nombre de la especialidad es obligatorio' 
      });
    }

    const existe = await Especialidad.findOne({ 
      where: { nombre: nombre.trim() } 
    });
    
    if (existe) {
      return res.status(400).json({
        mensaje: 'Ya existe una especialidad con ese nombre.'
      });
    }

    const nuevaEspecialidad = await Especialidad.create({ 
      nombre: nombre.trim(), 
      descripcion 
    });
    
    return res.status(201).json({
      mensaje: 'Especialidad creada correctamente.',
      especialidad: nuevaEspecialidad
    });
  } catch (error) {
    return res.status(500).json({ 
      mensaje: 'Error al crear la especialidad', 
      error: error.message 
    });
  }
};

export const actualizarEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const especialidad = await Especialidad.findByPk(id);

    if (!especialidad) {
      return res.status(404).json({
        mensaje: "Especialidad no encontrada"
      });
    }

    if (nombre && nombre.trim() !== especialidad.nombre) {
      const existe = await Especialidad.findOne({
        where: { 
          nombre: nombre.trim(),
          id: { [Op.ne]: id }
        }
      });

      if (existe) {
        return res.status(400).json({
          mensaje: "Ya existe otra especialidad con ese nombre."
        });
      }
    }

    await especialidad.update({
      nombre: nombre ? nombre.trim() : especialidad.nombre,
      descripcion: descripcion !== undefined ? descripcion : especialidad.descripcion
    });

    return res.status(200).json({
      mensaje: "Especialidad actualizada correctamente.",
      especialidad
    });

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar la especialidad",
      error: error.message
    });
  }
};

export const eliminarEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;

    const especialidad = await Especialidad.findByPk(id);

    if (!especialidad) {
      return res.status(404).json({
        mensaje: "Especialidad no encontrada"
      });
    }

    const medicos = await Medico.count({
      where: {
        especialidad_id: id
      }
    });

    if (medicos > 0) {
      return res.status(400).json({
        mensaje: `No se puede eliminar la especialidad porque tiene ${medicos} médicos asociados.`
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