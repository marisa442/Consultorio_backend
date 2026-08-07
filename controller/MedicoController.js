import { MedicoModel, EspecialidadModel } from "../models/index.js";

const REQUIRED_FIELDS = [
  "numero_identificacion",
  "nombres",
  "apellidos",
  "correo_electronico",
  "numero_licencia",
  "especialidad_id",
];

export const getMedicos = async (req, res) => {
  try {
    const medicos = await MedicoModel.findAll({
      where: { estado: true },
      include: { model: EspecialidadModel, as: "especialidad" },
      order: [["apellidos", "ASC"]],
    });
    res.status(200).json(medicos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMedicoById = async (req, res) => {
  try {
    const medico = await MedicoModel.findByPk(req.params.id, {
      include: { model: EspecialidadModel, as: "especialidad" },
    });
    if (!medico) {
      return res.status(404).json({ message: "medico not found" });
    }
    res.status(200).json(medico);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMedico = async (req, res) => {
  try {
    for (const field of REQUIRED_FIELDS) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }
    const especialidad = await EspecialidadModel.findByPk(req.body.especialidad_id);
    if (!especialidad) {
      return res.status(400).json({ message: "especialidad_id does not exist" });
    }
    const medico = await MedicoModel.create(req.body);
    res.status(201).json({ message: "create", medico });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMedico = async (req, res) => {
  try {
    const medico = await MedicoModel.findByPk(req.params.id);
    if (!medico) {
      return res.status(404).json({ message: "medico not found" });
    }
    if (req.body.especialidad_id) {
      const especialidad = await EspecialidadModel.findByPk(req.body.especialidad_id);
      if (!especialidad) {
        return res.status(400).json({ message: "especialidad_id does not exist" });
      }
    }
    medico.set(req.body);
    await medico.save();
    res.status(200).json({ message: "update", medico });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMedico = async (req, res) => {
  try {
    const medico = await MedicoModel.findByPk(req.params.id);
    if (!medico) {
      return res.status(404).json({ message: "medico not found" });
    }
    medico.set({ estado: false });
    await medico.save();
    res.status(200).json({ message: "delete" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
