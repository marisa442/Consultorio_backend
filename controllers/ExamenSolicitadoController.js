import {
  ExamenSolicitadoModel,
  ConsultaModel,
  ExamenModel,
  CitaModel,
  PacienteModel,
  MedicoModel,
} from "../models/index.js";
import { esAdministrador, puedeVerCita } from "../utils/rbac.js";

const ESTADOS = ["solicitado", "realizado", "entregado", "cancelado"];

const conCitaDeConsulta = (consultaId) =>
  ConsultaModel.findByPk(consultaId, { include: { model: CitaModel, as: "cita" } });

// Listado global (sin consulta_id): reservado a administrador para la
// pantalla de "Gestion de examenes solicitados" (Solicitado -> Realizado ->
// Entregado). Incluye paciente/medico/examen para mostrarlos en una tabla.
const listarTodasParaAdmin = async (req, res) => {
  const where = {};
  if (req.query.estado) where.estado = req.query.estado;

  const solicitudes = await ExamenSolicitadoModel.findAll({
    where,
    include: [
      { model: ExamenModel, as: "examen" },
      {
        model: ConsultaModel,
        as: "consulta",
        include: {
          model: CitaModel,
          as: "cita",
          include: [
            { model: PacienteModel, as: "paciente" },
            { model: MedicoModel, as: "medico" },
          ],
        },
      },
    ],
    order: [["fecha_solicitud", "DESC"]],
  });
  res.status(200).json(solicitudes);
};

export const getExamenesSolicitados = async (req, res) => {
  try {
    if (!req.query.consulta_id) {
      if (!esAdministrador(req.user)) {
        return res.status(400).json({ message: "consulta_id query param is required" });
      }
      return listarTodasParaAdmin(req, res);
    }
    const consulta = await conCitaDeConsulta(req.query.consulta_id);
    if (!consulta) return res.status(200).json([]);
    if (!puedeVerCita(req.user, consulta.cita)) {
      return res.status(403).json({ message: "No tienes permiso para ver estos examenes" });
    }

    const where = { consulta_id: req.query.consulta_id };
    if (req.query.estado) where.estado = req.query.estado;

    const solicitudes = await ExamenSolicitadoModel.findAll({
      where,
      include: { model: ExamenModel, as: "examen" },
      order: [["fecha_solicitud", "DESC"]],
    });
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getExamenSolicitadoById = async (req, res) => {
  try {
    const solicitud = await ExamenSolicitadoModel.findByPk(req.params.id, {
      include: [
        { model: ExamenModel, as: "examen" },
        { model: ConsultaModel, as: "consulta", include: { model: CitaModel, as: "cita" } },
      ],
    });
    if (!solicitud) {
      return res.status(404).json({ message: "examen_solicitado not found" });
    }
    if (!puedeVerCita(req.user, solicitud.consulta.cita)) {
      return res.status(403).json({ message: "No tienes permiso para ver este examen" });
    }
    res.status(200).json(solicitud);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Solicita un examen durante una consulta
export const createExamenSolicitado = async (req, res) => {
  try {
    const { consulta_id, examen_id } = req.body;
    if (!consulta_id || !examen_id) {
      return res.status(400).json({ message: "consulta_id and examen_id are required" });
    }

    const consulta = await conCitaDeConsulta(consulta_id);
    if (!consulta) return res.status(400).json({ message: "consulta_id does not exist" });
    if (!esAdministrador(req.user) && consulta.cita.medico_id !== req.user.medico_id) {
      return res
        .status(403)
        .json({ message: "solo el medico que atendio la consulta puede solicitar examenes" });
    }

    const examen = await ExamenModel.findByPk(examen_id);
    if (!examen) return res.status(400).json({ message: "examen_id does not exist" });

    const solicitud = await ExamenSolicitadoModel.create({
      consulta_id,
      examen_id,
      fecha_solicitud: new Date(),
      estado: "solicitado",
    });
    res.status(201).json({ message: "create", solicitud });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verificarDuenoSolicitud = async (req, solicitud) => {
  const consulta = await conCitaDeConsulta(solicitud.consulta_id);
  return esAdministrador(req.user) || consulta?.cita.medico_id === req.user.medico_id;
};

// Actualiza resultado/estado de un examen solicitado
export const updateExamenSolicitado = async (req, res) => {
  try {
    const solicitud = await ExamenSolicitadoModel.findByPk(req.params.id);
    if (!solicitud) {
      return res.status(404).json({ message: "examen_solicitado not found" });
    }
    if (!(await verificarDuenoSolicitud(req, solicitud))) {
      return res.status(403).json({ message: "No tienes permiso para editar este examen" });
    }
    if (req.body.estado && !ESTADOS.includes(req.body.estado)) {
      return res.status(400).json({ message: `estado must be one of: ${ESTADOS.join(", ")}` });
    }
    delete req.body.consulta_id;
    delete req.body.examen_id;
    solicitud.set(req.body);
    await solicitud.save();
    res.status(200).json({ message: "update", solicitud });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteExamenSolicitado = async (req, res) => {
  try {
    const solicitud = await ExamenSolicitadoModel.findByPk(req.params.id);
    if (!solicitud) {
      return res.status(404).json({ message: "examen_solicitado not found" });
    }
    if (!(await verificarDuenoSolicitud(req, solicitud))) {
      return res.status(403).json({ message: "No tienes permiso para eliminar este examen" });
    }
    solicitud.set({ estado: "cancelado" });
    await solicitud.save();
    res.status(200).json({ message: "delete" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
