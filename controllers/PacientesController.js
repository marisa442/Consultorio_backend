import { Op } from 'sequelize';
import Paciente from "../models/PacientesModel.js";

export const getPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({
      order: [['apellidos', 'ASC']]
    });
    return res.status(200).json({ pacientes, mensaje: "Datos obtenidos correctamente" });
  } catch (error) {
    return res.status(500).json({ 
      mensaje: 'Error al obtener los pacientes', 
      error: error.message 
    });
  }
};

export const getPacienteByid = async (req, res) => {
  try {
    const { id } = req.params;
    const paciente = await Paciente.findByPk(id);
    if (!paciente) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }
    return res.status(200).json({ paciente, mensaje: "Paciente obtenido" });
  } catch (error) {
    return res.status(500).json({ 
      mensaje: 'Error al obtener el paciente', 
      error: error.message 
    });
  }
};

export const createPaciente = async (req, res) => {
  try {
    const { 
      numero_identificacion, 
      nombres, 
      apellidos, 
      fecha_nacimiento, 
      sexo, 
      correo_electronico, 
      telefono, 
      direccion, 
      tipo_paciente 
    } = req.body;

    if (!numero_identificacion || !nombres || !apellidos || !fecha_nacimiento || !sexo || !correo_electronico || !tipo_paciente) {
      return res.status(400).json({ 
        mensaje: 'Faltan datos obligatorios' 
      });
    }

    const existeIdentificacion = await Paciente.findOne({ 
      where: { numero_identificacion } 
    });
    if (existeIdentificacion) {
      return res.status(400).json({ 
        mensaje: 'Ya existe un paciente con ese número de identificación' 
      });
    }

    const existeCorreo = await Paciente.findOne({ 
      where: { correo_electronico } 
    });
    if (existeCorreo) {
      return res.status(400).json({ 
        mensaje: 'Ya existe un paciente con ese correo electrónico' 
      });
    }

    const sexosValidos = ['M', 'F'];
    if (!sexosValidos.includes(sexo)) {
      return res.status(400).json({ 
        mensaje: 'El sexo debe ser M o F' 
      });
    }

    const tiposValidos = ['estudiante', 'docente', 'administrativo'];
    if (!tiposValidos.includes(tipo_paciente)) {
      return res.status(400).json({ 
        mensaje: 'Tipo de paciente no válido. Debe ser: estudiante, docente o administrativo' 
      });
    }

    const fechaNacimiento = new Date(fecha_nacimiento);
    const hoy = new Date();
    if (fechaNacimiento > hoy) {
      return res.status(400).json({ 
        mensaje: 'La fecha de nacimiento no puede ser futura' 
      });
    }

    const nuevoPaciente = await Paciente.create({
      numero_identificacion: numero_identificacion.trim(),
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      fecha_nacimiento,
      sexo,
      correo_electronico: correo_electronico.trim().toLowerCase(),
      telefono: telefono ? telefono.trim() : null,
      direccion: direccion ? direccion.trim() : null,
      tipo_paciente
    });

    return res.status(201).json({ 
      mensaje: 'Paciente creado correctamente', 
      paciente: nuevoPaciente 
    });
  } catch (error) {
    return res.status(500).json({ 
      mensaje: 'Error al crear el paciente', 
      error: error.message 
    });
  }
};

export const updatePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_identificacion, nombres, apellidos, fecha_nacimiento, sexo, correo_electronico, telefono, direccion, tipo_paciente } = req.body;

    const paciente = await Paciente.findByPk(id);
    if (!paciente) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    if (!numero_identificacion && !nombres && !apellidos && !fecha_nacimiento && !sexo && !correo_electronico && !tipo_paciente) {
      return res.status(400).json({ 
        mensaje: 'Debe enviar al menos un campo para actualizar' 
      });
    }

    if (numero_identificacion && numero_identificacion !== paciente.numero_identificacion) {
      const existe = await Paciente.findOne({ 
        where: { 
          numero_identificacion,
          id: { [Op.ne]: id }
        } 
      });
      if (existe) {
        return res.status(400).json({ 
          mensaje: 'Ya existe otro paciente con ese número de identificación' 
        });
      }
    }

    if (correo_electronico && correo_electronico !== paciente.correo_electronico) {
      const existe = await Paciente.findOne({ 
        where: { 
          correo_electronico,
          id: { [Op.ne]: id }
        } 
      });
      if (existe) {
        return res.status(400).json({ 
          mensaje: 'Ya existe otro paciente con ese correo electrónico' 
        });
      }
    }

    if (sexo) {
      const sexosValidos = ['M', 'F'];
      if (!sexosValidos.includes(sexo)) {
        return res.status(400).json({ 
          mensaje: 'El sexo debe ser M o F' 
        });
      }
    }

    if (tipo_paciente) {
      const tiposValidos = ['estudiante', 'docente', 'administrativo'];
      if (!tiposValidos.includes(tipo_paciente)) {
        return res.status(400).json({ 
          mensaje: 'Tipo de paciente no válido' 
        });
      }
    }

    if (fecha_nacimiento) {
      const fechaNacimiento = new Date(fecha_nacimiento);
      const hoy = new Date();
      if (fechaNacimiento > hoy) {
        return res.status(400).json({ 
          mensaje: 'La fecha de nacimiento no puede ser futura' 
        });
      }
    }

    const datosActualizados = {};
    if (numero_identificacion) datosActualizados.numero_identificacion = numero_identificacion.trim();
    if (nombres) datosActualizados.nombres = nombres.trim();
    if (apellidos) datosActualizados.apellidos = apellidos.trim();
    if (fecha_nacimiento) datosActualizados.fecha_nacimiento = fecha_nacimiento;
    if (sexo) datosActualizados.sexo = sexo;
    if (correo_electronico) datosActualizados.correo_electronico = correo_electronico.trim().toLowerCase();
    if (telefono !== undefined) datosActualizados.telefono = telefono ? telefono.trim() : null;
    if (direccion !== undefined) datosActualizados.direccion = direccion ? direccion.trim() : null;
    if (tipo_paciente) datosActualizados.tipo_paciente = tipo_paciente;

    await paciente.update(datosActualizados);

    const pacienteActualizado = await Paciente.findByPk(id);

    return res.status(200).json({ 
      mensaje: 'Paciente actualizado correctamente', 
      paciente: pacienteActualizado 
    });
  } catch (error) {
    return res.status(500).json({ 
      mensaje: 'Error al actualizar el paciente', 
      error: error.message 
    });
  }
};

export const deletePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const paciente = await Paciente.findByPk(id);
    if (!paciente) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }
    await paciente.destroy();
    return res.status(200).json({ mensaje: "Paciente eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ 
      mensaje: 'Error al eliminar el paciente', 
      error: error.message 
    });
  }
};

export const getPacientesBusqueda = async (req, res) => {
  try {
    const { nombre, identificacion } = req.query;
    const whereClause = {};

    if (nombre) {
      whereClause.nombres = { [Op.like]: `%${nombre}%` };
    }
    if (identificacion) {
      whereClause.numero_identificacion = { [Op.like]: `%${identificacion}%` };
    }

    const pacientes = await Paciente.findAll({ 
      where: whereClause,
      order: [['apellidos', 'ASC']]
    });
    
    return res.status(200).json({ 
      pacientes, 
      total: pacientes.length,
      mensaje: 'Búsqueda realizada correctamente' 
    });
  } catch (error) {
    return res.status(500).json({ 
      mensaje: 'Error en la búsqueda', 
      error: error.message 
    });
  }
};