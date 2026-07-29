import Medico from '../models/MedicoModel.js';

// 1. Obtener todos los médicos
export const getMedicos = async (req, res) => {
  try {
    const medicos = await Medico.findAll();
    res.status(200).json(medicos);
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al obtener los médicos', 
      error: error.message 
    });
  }
};



// 2. Obtener un médico por ID
export const getMedicoById = async (req, res) => {
  try {
    const { id } = req.params;
    const medico = await Medico.findByPk(id);

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





// 3. Crear un nuevo médico
export const createMedico = async (req, res) => {
  try {
    const { 
      numeroIdentificacion, 
      nombres, 
      apellidos, 
      correoElectronico, 
      telefono, 
      numeroLicenciaProfesional, 
      especialidadId 
    } = req.body;

    const nuevoMedico = await Medico.create({
      numeroIdentificacion,
      nombres,
      apellidos,
      correoElectronico,
      telefono,
      numeroLicenciaProfesional,
      especialidadId
    });

    res.status(201).json({
      mensaje: 'Médico creado exitosamente',
      medico: nuevoMedico
    });
  } catch (error) {
    res.status(400).json({ 
      mensaje: 'Error al registrar el médico', 
      error: error.message 
    });
  }
};

// 4. Actualizar un médico
export const updateMedico = async (req, res) => {
  try {
    const { id } = req.params;
    const medico = await Medico.findByPk(id);

    if (!medico) {
      return res.status(404).json({ mensaje: 'Médico no encontrado' });
    }

    await medico.update(req.body);

    res.status(200).json({
      mensaje: 'Médico actualizado exitosamente',
      medico
    });
  } catch (error) {
    res.status(400).json({ 
      mensaje: 'Error al actualizar el médico', 
      error: error.message 
    });
  }
};

// 5. Eliminar un médico
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