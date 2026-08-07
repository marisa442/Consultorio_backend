import { EspecialidadModel } from "../models/index.js";

export const getEspecialidades = async (req, res) => {
  try {
    const especialidades = await EspecialidadModel.findAll({
      where: { estado: true },
      order: [["nombre", "ASC"]],
    });
    res.status(200).json(especialidades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEspecialidadById = async (req, res) => {
  try {
    const especialidad = await EspecialidadModel.findByPk(req.params.id);
    if (!especialidad) {
      return res.status(404).json({ message: "especialidad not found" });
    }
    res.status(200).json(especialidad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createEspecialidad = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ message: "nombre is required" });
    }
    const especialidad = await EspecialidadModel.create(req.body);
    res.status(201).json({ message: "create", especialidad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEspecialidad = async (req, res) => {
  try {
    const especialidad = await EspecialidadModel.findByPk(req.params.id);
    if (!especialidad) {
      return res.status(404).json({ message: "especialidad not found" });
    }
    especialidad.set(req.body);
    await especialidad.save();
    res.status(200).json({ message: "update", especialidad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEspecialidad = async (req, res) => {
  try {
    const especialidad = await EspecialidadModel.findByPk(req.params.id);
    if (!especialidad) {
      return res.status(404).json({ message: "especialidad not found" });
    }
    especialidad.set({ estado: false });
    await especialidad.save();
    res.status(200).json({ message: "delete" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
