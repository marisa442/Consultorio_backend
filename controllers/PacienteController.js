import { PacienteModel } from "../models/index.js";
import { puedeVerPaciente } from "../utils/rbac.js";

// Campos que un paciente jamas puede tocar de si mismo, aunque el admin/medico si.
const CAMPOS_PROTEGIDOS_PARA_PACIENTE = ["numero_identificacion", "tipo_paciente", "estado"];

const REQUIRED_FIELDS = [
  "numero_identificacion",
  "nombres",
  "apellidos",
  "fecha_nacimiento",
  "sexo",
  "correo_electronico",
  "tipo_paciente",
];

const validarPaciente = (body, { parcial = false } = {}) => {
  if (!parcial) {
    for (const field of REQUIRED_FIELDS) {
      if (!body[field]) return `${field} is required`;
    }
  }
  if (body.sexo && !["M", "F"].includes(body.sexo)) return "sexo must be M or F";
  if (body.tipo_paciente && !["estudiante", "docente", "administrativo"].includes(body.tipo_paciente)) {
    return "tipo_paciente must be estudiante, docente or administrativo";
  }
  if (body.fecha_nacimiento && new Date(body.fecha_nacimiento) > new Date()) {
    return "fecha_nacimiento cannot be in the future";
  }
  return null;
};

export const getPacientes = async (req, res) => {
  try {
    const pacientes = await PacienteModel.findAll({
      where: { estado: true },
      order: [["apellidos", "ASC"]],
    });
    res.status(200).json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPacienteById = async (req, res) => {
  try {
    const paciente = await PacienteModel.findByPk(req.params.id);
    if (!paciente) {
      return res.status(404).json({ message: "paciente not found" });
    }
    if (!puedeVerPaciente(req.user, paciente.id)) {
      return res.status(403).json({ message: "No tienes permiso para ver este paciente" });
    }
    res.status(200).json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPaciente = async (req, res) => {
  try {
    const errorMsg = validarPaciente(req.body);
    if (errorMsg) return res.status(400).json({ message: errorMsg });

    const paciente = await PacienteModel.create(req.body);
    res.status(201).json({ message: "create", paciente });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePaciente = async (req, res) => {
  try {
    const paciente = await PacienteModel.findByPk(req.params.id);
    if (!paciente) {
      return res.status(404).json({ message: "paciente not found" });
    }
    if (!puedeVerPaciente(req.user, paciente.id)) {
      return res.status(403).json({ message: "No tienes permiso para editar este paciente" });
    }

    const datos = { ...req.body };
    if (req.user.rol === "paciente") {
      // Un paciente edita sus datos de contacto, nunca su identidad clinica/administrativa.
      for (const campo of CAMPOS_PROTEGIDOS_PARA_PACIENTE) delete datos[campo];
    }

    const errorMsg = validarPaciente(datos, { parcial: true });
    if (errorMsg) return res.status(400).json({ message: errorMsg });

    paciente.set(datos);
    await paciente.save();
    res.status(200).json({ message: "update", paciente });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePaciente = async (req, res) => {
  try {
    const paciente = await PacienteModel.findByPk(req.params.id);
    if (!paciente) {
      return res.status(404).json({ message: "paciente not found" });
    }
    paciente.set({ estado: false });
    await paciente.save();
    res.status(200).json({ message: "delete" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
