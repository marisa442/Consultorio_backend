import { where } from "sequelize";        
import { Op } from 'sequelize'; 
import { ExamenModel } from "../models/ExamenModel.js";


export const getExamenes = async (req, res) => {
  try {
    const examenes = await ExamenModel.findAll();
    return res.status(200).json({ examenes, mensaje: "datos obtenidos" });
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los exámenes" });
  }
};

export const getExamenByCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;  
    const examen = await ExamenModel.findByPk(codigo);
    if (!examen) {
      return res.status(404).json({ error: "Examen no encontrado" });
    }
    return res.status(200).json({ examen, mensaje: "examen obtenido" });
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener el examen" });
  }
};


export const createExamen = async (req, res) => {
  try {
    const { codigo, nombre, descripcion, costo } = req.body;

    if ((!codigo )|| (!nombre )|| (!descripcion) ||( costo === undefined)) {
      return res.status(400).json({ error: "Faltan datos obligatorios: codigo, nombre, descripcion y costo" });
    }

    const existente = await ExamenModel.findByPk(codigo);
    if (existente) {
      return res.status(400).json({ error: "Ya existe un examen con ese código" });
    }
    const nuevoExamen = await ExamenModel.create({
      codigo:codigo,
      nombre:nombre,
      descripcion:descripcion,
      costo:costo
    });

    return res.status(201).json({ nuevoExamen, mensaje: "Examen creado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error al crear el examen" });
  }
};


export const updateExamen = async (req, res) => {
  try {
    const { codigo } = req.params;      
    const { nombre, descripcion, costo, nuevoCodigo } = req.body; 

    const examen = await ExamenModel.findByPk(codigo);
    if (!examen) {
      return res.status(404).json({ error: "Examen no encontrado" });
    }

    if (!nombre && !descripcion && costo === undefined && !nuevoCodigo) {
      return res.status(400).json({ error: "Debe enviar al menos un campo para actualizar" });
    }

   
    const datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre;
    if (descripcion) datosActualizados.descripcion = descripcion;
    if (costo !== undefined) datosActualizados.costo = costo;
    if (nuevoCodigo) datosActualizados.codigo = nuevoCodigo; 

    await examen.update(datosActualizados);

    return res.status(200).json({ mensaje: "Examen actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar el examen" });
  }
};

export const deleteExamen = async (req, res) => {
  try {
    const { codigo } = req.params;
    const examen = await ExamenModel.findByPk(codigo);
    if (!examen) {
      return res.status(404).json({ error: "Examen no encontrado" });
    }
    await examen.destroy();
    return res.status(200).json({ mensaje: "Examen eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error al eliminar el examen" });
  }
};