import { ExamenModel } from "../models/index.js";

export const getExamenes = async (req, res) => {
  try {
    const examenes = await ExamenModel.findAll({
      where: { estado: true },
      order: [["nombre", "ASC"]],
    });
    res.status(200).json(examenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getExamenById = async (req, res) => {
  try {
    const examen = await ExamenModel.findByPk(req.params.id);
    if (!examen) {
      return res.status(404).json({ message: "examen not found" });
    }
    res.status(200).json(examen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createExamen = async (req, res) => {
  try {
    const { codigo, nombre } = req.body;
    if (!codigo || !nombre) {
      return res.status(400).json({ message: "codigo and nombre are required" });
    }
    const examen = await ExamenModel.create(req.body);
    res.status(201).json({ message: "create", examen });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateExamen = async (req, res) => {
  try {
    const examen = await ExamenModel.findByPk(req.params.id);
    if (!examen) {
      return res.status(404).json({ message: "examen not found" });
    }
    examen.set(req.body);
    await examen.save();
    res.status(200).json({ message: "update", examen });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteExamen = async (req, res) => {
  try {
    const examen = await ExamenModel.findByPk(req.params.id);
    if (!examen) {
      return res.status(404).json({ message: "examen not found" });
    }
    examen.set({ estado: false });
    await examen.save();
    res.status(200).json({ message: "delete" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
