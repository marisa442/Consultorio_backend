import Examen from '../models/ExamenModel.js';

export const getExamenes = async (req, res) => {
  try {
    const examenes = await Examen.findAll({
      order: [['nombre', 'ASC']]
    });
    return res.status(200).json({ examenes, mensaje: "Datos obtenidos correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los exámenes", detalle: error.message });
  }
};

export const getExamenByCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const examen = await Examen.findByPk(codigo);
    if (!examen) {
      return res.status(404).json({ error: "Examen no encontrado" });
    }
    return res.status(200).json({ examen, mensaje: "Examen obtenido" });
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener el examen", detalle: error.message });
  }
};

export const createExamen = async (req, res) => {
  try {
    const { codigo, nombre, descripcion, costo } = req.body;

    if (!codigo || !nombre || !descripcion || costo === undefined) {
      return res.status(400).json({ error: "Faltan datos obligatorios: codigo, nombre, descripcion y costo" });
    }

    if (isNaN(costo) || costo < 0) {
      return res.status(400).json({ error: "El costo debe ser un número positivo" });
    }

    const existente = await Examen.findByPk(codigo);
    if (existente) {
      return res.status(400).json({ error: "Ya existe un examen con ese código" });
    }

    const nuevoExamen = await Examen.create({
      codigo: codigo.trim().toUpperCase(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      costo: parseFloat(costo)
    });

    return res.status(201).json({ nuevoExamen, mensaje: "Examen creado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error al crear el examen", detalle: error.message });
  }
};

export const updateExamen = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { nombre, descripcion, costo } = req.body;

    const examen = await Examen.findByPk(codigo);
    if (!examen) {
      return res.status(404).json({ error: "Examen no encontrado" });
    }

    if (!nombre && !descripcion && costo === undefined) {
      return res.status(400).json({ error: "Debe enviar al menos un campo para actualizar" });
    }

    if (costo !== undefined && (isNaN(costo) || costo < 0)) {
      return res.status(400).json({ error: "El costo debe ser un número positivo" });
    }

    const datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre.trim();
    if (descripcion) datosActualizados.descripcion = descripcion.trim();
    if (costo !== undefined) datosActualizados.costo = parseFloat(costo);

    await examen.update(datosActualizados);

    return res.status(200).json({ mensaje: "Examen actualizado correctamente", examen });
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar el examen", detalle: error.message });
  }
};

export const deleteExamen = async (req, res) => {
  try {
    const { codigo } = req.params;
    const examen = await Examen.findByPk(codigo);
    if (!examen) {
      return res.status(404).json({ error: "Examen no encontrado" });
    }
    await examen.destroy();
    return res.status(200).json({ mensaje: "Examen eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error al eliminar el examen", detalle: error.message });
  }
};