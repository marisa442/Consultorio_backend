import { where } from "sequelize";        
import { Op } from 'sequelize';           
import { PacientesModel } from "../models/PacientesModel.js";


export const getPacientes = async (req, res) => {
  try {
    const pacientes = await PacientesModel.findAll();
    return res.status(200).json({ pacientes, mensaje: "datos obtenidos" });
  } catch (error) {
       return res.status(500).json({ error: "Datos no creados" });
  }
  };


export const getPacienteByid = async (req, res) => {
  try {
    const { id } = req.params;
    const paciente = await PacientesModel.findByPk(id);
    if (!paciente) {
      return res.status(404).json({ error: "paciente no encontrado" });
    }
    return res.status(200).json({ paciente, mensaje: "paciente obtenido" });
  } catch (error) {
       return res.status(500).json({ error: "Datos no creados" });
  }
  };


export const createPaciente = async (req, res) => {
  try {
    const {numero_identificacion,nombres,apellidos,fecha_nacimiento,sexo,correo_electronico,telefono,direccion,tipo_paciente} = req.body;
 
    if ((!numero_identificacion )||(!nombres) || (!apellidos )||(!fecha_nacimiento) ||(!sexo) ||(!correo_electronico )||(!tipo_paciente
    )) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const nuevoPaciente = await PacientesModel.create({
      numero_identificacion:numero_identificacion,
      nombres:nombres,
      apellidos:apellidos,
      fecha_nacimiento:fecha_nacimiento,
      sexo:sexo,
      correo_electronico:correo_electronico,
      telefono: telefono || null,      
      direccion: direccion || null,   
      tipo_paciente
    });

    return res.status(201).json({nuevoPaciente});
  } catch (error) {
   return res.status(500).json({ error: "Datos no creados" });
  }
};

export const updatePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const {numero_identificacion,nombres,apellidos,fecha_nacimiento,sexo,correo_electronico,telefono,direccion,tipo_paciente
    } = req.body;

    const paciente = await PacientesModel.findByPk(id);
    if (!paciente) {
      return res.status(404).json({ error: "paciente no encontrado" });
    }

    if ((!numero_identificacion )||(!nombres) || (!apellidos )||(!fecha_nacimiento) ||(!sexo) ||(!correo_electronico )||(!tipo_paciente
    )){
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    await PacientesModel.update(
      {numero_identificacion,nombres,apellidos,fecha_nacimiento,sexo,correo_electronico,
        telefono: telefono || null, 
        direccion: direccion || null,
        tipo_paciente
      },
      { where: { id } }
    );

    return res.status(200).json({ mensaje: "paciente actualizado" });
  } catch (error) {
      return res.status(500).json({ error: "Datos no actualizados" })
  }
};


export const deletePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const paciente = await PacientesModel.findByPk(id);
    if (!paciente) {
      return res.status(404).json({ error: "paciente no encontrado" });
    }
    await PacientesModel.destroy({ where: { id } });
    return res.status(200).json({ mensaje: "paciente eliminado" });
  } catch (error) {
      return res.status(500).json({ error: "Datos no eliminados" });;
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

    const pacientes = await PacientesModel.findAll({ where: whereClause });
    res.json({ pacientes });
  } catch (error) {
    res.status(500).json({ error: "Error en la búsqueda" });
  }
};