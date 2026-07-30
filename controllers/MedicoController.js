import Medico from '../models/MedicoModel.js';
import Especialidad from '../models/Especialidad.js';
import { Op } from 'sequelize';

export const getMedicos = async (req, res) => {
  try {
    const medicos = await Medico.findAll({
      include: [{ model: Especialidad, as: 'especialidad' }],
      order: [['apellidos', 'ASC']]
    });
    res.status(200).json(medicos);
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al obtener los médicos', 
      error: error.message 
    });
  }
};

export const getMedicoById = async (req, res) => {
  try {
    const { id } = req.params;
    const medico = await Medico.findByPk(id, {
      include: [{ model: Especialidad, as: 'especialidad' }]
    });

    if (!medico) {
      return res.status(404).json({ mensaje: 'Médico no encontrado' });
    }

    res.status(200).json(medico);
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al buscar el médico', 
      error: error.message 
    });
  }
};

export const createMedico = async (req, res) => {
  try {
    const { numeroIdentificacion, nombres, apellidos, correoElectronico, telefono, numeroLicenciaProfesional, especialidadId } = req.body;

    if (!numeroIdentificacion || !nombres || !apellidos || !correoElectronico || !numeroLicenciaProfesional || !especialidadId) {
      return res.status(400).json({ 
        mensaje: 'Todos los campos son obligatorios' 
      });
    }

    const existeIdentificacion = await Medico.findOne({ 
      where: { numeroIdentificacion } 
    });
    
    if (existeIdentificacion) {
      return res.status(400).json({ 
        mensaje: 'Ya existe un médico con ese número de identificación' 
      });
    }

    const existeLicencia = await Medico.findOne({ 
      where: { numeroLicenciaProfesional } 
    });
    
    if (existeLicencia) {
      return res.status(400).json({ 
        mensaje: 'Ya existe un médico con ese número de licencia' 
      });
    }

    const existeCorreo = await Medico.findOne({ 
      where: { correoElectronico } 
    });
    
    if (existeCorreo) {
      return res.status(400).json({ 
        mensaje: 'Ya existe un médico con ese correo electrónico' 
      });
    }

    const especialidad = await Especialidad.findByPk(especialidadId);
    if (!especialidad) {
      return res.status(404).json({ 
        mensaje: 'La especialidad no existe' 
      });
    }

    const nuevoMedico = await Medico.create({
      numeroIdentificacion: numeroIdentificacion.trim(),
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      correoElectronico: correoElectronico.trim().toLowerCase(),
      telefono: telefono ? telefono.trim() : null,
      numeroLicenciaProfesional: numeroLicenciaProfesional.trim().toUpperCase(),
      especialidadId
    });

    const medicoCompleto = await Medico.findByPk(nuevoMedico.id, {
      include: [{ model: Especialidad, as: 'especialidad' }]
    });

    res.status(201).json({
      mensaje: 'Médico creado exitosamente',
      medico: medicoCompleto
    });
  } catch (error) {
    res.status(400).json({ 
      mensaje: 'Error al registrar el médico', 
      error: error.message 
    });
  }
};

export const updateMedico = async (req, res) => {
  try {
    const { id } = req.params;
    const { numeroIdentificacion, nombres, apellidos, correoElectronico, telefono, numeroLicenciaProfesional, especialidadId } = req.body;

    const medico = await Medico.findByPk(id);

    if (!medico) {
      return res.status(404).json({ mensaje: 'Médico no encontrado' });
    }

    if (numeroIdentificacion && numeroIdentificacion !== medico.numeroIdentificacion) {
      const existe = await Medico.findOne({ 
        where: { 
          numeroIdentificacion,
          id: { [Op.ne]: id }
        } 
      });
      
      if (existe) {
        return res.status(400).json({ 
          mensaje: 'Ya existe otro médico con ese número de identificación' 
        });
      }
    }

    if (numeroLicenciaProfesional && numeroLicenciaProfesional !== medico.numeroLicenciaProfesional) {
      const existe = await Medico.findOne({ 
        where: { 
          numeroLicenciaProfesional,
          id: { [Op.ne]: id }
        } 
      });
      
      if (existe) {
        return res.status(400).json({ 
          mensaje: 'Ya existe otro médico con ese número de licencia' 
        });
      }
    }

    if (correoElectronico && correoElectronico !== medico.correoElectronico) {
      const existe = await Medico.findOne({ 
        where: { 
          correoElectronico,
          id: { [Op.ne]: id }
        } 
      });
      
      if (existe) {
        return res.status(400).json({ 
          mensaje: 'Ya existe otro médico con ese correo electrónico' 
        });
      }
    }

    if (especialidadId) {
      const especialidad = await Especialidad.findByPk(especialidadId);
      if (!especialidad) {
        return res.status(404).json({ 
          mensaje: 'La especialidad no existe' 
        });
      }
    }

    const datosActualizados = {};
    if (numeroIdentificacion) datosActualizados.numeroIdentificacion = numeroIdentificacion.trim();
    if (nombres) datosActualizados.nombres = nombres.trim();
    if (apellidos) datosActualizados.apellidos = apellidos.trim();
    if (correoElectronico) datosActualizados.correoElectronico = correoElectronico.trim().toLowerCase();
    if (telefono !== undefined) datosActualizados.telefono = telefono ? telefono.trim() : null;
    if (numeroLicenciaProfesional) datosActualizados.numeroLicenciaProfesional = numeroLicenciaProfesional.trim().toUpperCase();
    if (especialidadId) datosActualizados.especialidadId = especialidadId;

    await medico.update(datosActualizados);

    const medicoActualizado = await Medico.findByPk(id, {
      include: [{ model: Especialidad, as: 'especialidad' }]
    });

    res.status(200).json({
      mensaje: 'Médico actualizado exitosamente',
      medico: medicoActualizado
    });
  } catch (error) {
    res.status(400).json({ 
      mensaje: 'Error al actualizar el médico', 
      error: error.message 
    });
  }
};

export const deleteMedico = async (req, res) => {
  try {
    const { id } = req.params;
    const medico = await Medico.findByPk(id);

    if (!medico) {
      return res.status(404).json({ mensaje: 'Médico no encontrado' });
    }

    await medico.destroy();

    res.status(200).json({ mensaje: 'Médico eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al eliminar el médico', 
      error: error.message 
    });
  }
};