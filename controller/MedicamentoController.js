import { MedicamentoModel } from "../models/index.js";

export const getMedicamentos = async (req, res) => {
  try {
    const medicamentos = await MedicamentoModel.findAll({
      where: { estado: true },
      order: [["nombre", "ASC"]],
    });
    res.status(200).json(medicamentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMedicamentoById = async (req, res) => {
  try {
    const medicamento = await MedicamentoModel.findByPk(req.params.id);
    if (!medicamento) {
      return res.status(404).json({ message: "medicamento not found" });
    }
    res.status(200).json(medicamento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMedicamento = async (req, res) => {
  try {
    const { codigo, nombre } = req.body;
    if (!codigo || !nombre) {
      return res.status(400).json({ message: "codigo and nombre are required" });
    }
    const medicamento = await MedicamentoModel.create(req.body);
    res.status(201).json({ message: "create", medicamento });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMedicamento = async (req, res) => {
  try {
    const medicamento = await MedicamentoModel.findByPk(req.params.id);
    if (!medicamento) {
      return res.status(404).json({ message: "medicamento not found" });
    }
    medicamento.set(req.body);
    await medicamento.save();
    res.status(200).json({ message: "update", medicamento });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMedicamento = async (req, res) => {
  try {
    const medicamento = await MedicamentoModel.findByPk(req.params.id);
    if (!medicamento) {
      return res.status(404).json({ message: "medicamento not found" });
    }
    medicamento.set({ estado: false });
    await medicamento.save();
    res.status(200).json({ message: "delete" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
