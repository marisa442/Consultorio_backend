import {
  ConsultaModel,
  CitaModel,
  PacienteModel,
  MedicoModel,
  DetalleRecetaModel,
  MedicamentoModel,
  ExamenSolicitadoModel,
  ExamenModel,
} from "../models/index.js";
import { puedeVerCita } from "../utils/rbac.js";

const includeDetalle = [
  {
    model: CitaModel,
    as: "cita",
    include: [
      { model: PacienteModel, as: "paciente" },
      { model: MedicoModel, as: "medico" },
    ],
  },
  {
    model: DetalleRecetaModel,
    as: "detalle_recetas",
    include: { model: MedicamentoModel, as: "medicamento" },
  },
  {
    model: ExamenSolicitadoModel,
    as: "examenes_solicitados",
    include: { model: ExamenModel, as: "examen" },
  },
];

// Reconstruye el include de cita agregando el where de dueño segun el rol,
// para que un medico/paciente solo vea las consultas de sus propias citas.
const includeDetalleParaRol = (user) => {
  const whereCita = {};
  if (user.rol === "paciente") whereCita.paciente_id = user.paciente_id;
  if (user.rol === "medico") whereCita.medico_id = user.medico_id;

  const [citaInclude, ...resto] = includeDetalle;
  if (Object.keys(whereCita).length === 0) return includeDetalle;
  return [{ ...citaInclude, where: whereCita, required: true }, ...resto];
};

export const getConsultas = async (req, res) => {
  try {
    const consultas = await ConsultaModel.findAll({
      include: includeDetalleParaRol(req.user),
      order: [["fecha_atencion", "DESC"]],
    });
    res.status(200).json(consultas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getConsultaById = async (req, res) => {
  try {
    const consulta = await ConsultaModel.findByPk(req.params.id, {
      include: includeDetalle,
    });
    if (!consulta) {
      return res.status(404).json({ message: "consulta not found" });
    }
    if (!puedeVerCita(req.user, consulta.cita)) {
      return res.status(403).json({ message: "No tienes permiso para ver esta consulta" });
    }
    res.status(200).json(consulta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Registra la consulta de una cita atendida (regla: maximo una consulta por cita)
export const createConsulta = async (req, res) => {
  try {
    const { cita_id, diagnostico } = req.body;
    if (!cita_id || !diagnostico) {
      return res.status(400).json({ message: "cita_id and diagnostico are required" });
    }

    const cita = await CitaModel.findByPk(cita_id);
    if (!cita) {
      return res.status(400).json({ message: "cita_id does not exist" });
    }
    if (cita.medico_id !== req.user.medico_id) {
      return res
        .status(403)
        .json({ message: "solo el medico asignado a la cita puede registrar la consulta" });
    }
    if (cita.estado === "cancelada" || cita.estado === "no_asistida") {
      return res
        .status(400)
        .json({ message: "no se puede registrar consulta de una cita cancelada o no asistida" });
    }

    const existente = await ConsultaModel.findOne({ where: { cita_id } });
    if (existente) {
      return res.status(400).json({ message: "esta cita ya tiene una consulta registrada" });
    }

    const consulta = await ConsultaModel.create(req.body);

    // al registrar la consulta, la cita queda marcada como atendida
    cita.set({ estado: "atendida" });
    await cita.save();

    res.status(201).json({ message: "create", consulta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateConsulta = async (req, res) => {
  try {
    const consulta = await ConsultaModel.findByPk(req.params.id, {
      include: { model: CitaModel, as: "cita" },
    });
    if (!consulta) {
      return res.status(404).json({ message: "consulta not found" });
    }
    if (consulta.cita.medico_id !== req.user.medico_id) {
      return res
        .status(403)
        .json({ message: "solo el medico que atendio la cita puede editar la consulta" });
    }
    delete req.body.cita_id; // no se reasigna la cita de una consulta ya creada
    consulta.set(req.body);
    await consulta.save();
    res.status(200).json({ message: "update", consulta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteConsulta = async (req, res) => {
  try {
    const consulta = await ConsultaModel.findByPk(req.params.id, {
      include: { model: CitaModel, as: "cita" },
    });
    if (!consulta) {
      return res.status(404).json({ message: "consulta not found" });
    }
    // Antes esto era exclusivo de administrador (sin chequeo de dueño porque
    // no hacia falta). Ahora que solo medico llega aqui, se valida que sea
    // quien atendio la cita, igual que en updateConsulta.
    if (consulta.cita.medico_id !== req.user.medico_id) {
      return res
        .status(403)
        .json({ message: "solo el medico que atendio la cita puede eliminar la consulta" });
    }
    await consulta.destroy();
    res.status(200).json({ message: "delete" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
