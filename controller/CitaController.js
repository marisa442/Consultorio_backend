import { Op } from "sequelize";
import {
  CitaModel,
  PacienteModel,
  MedicoModel,
  EspecialidadModel,
  ConsultaModel,
} from "../models/index.js";
import { puedeVerCita } from "../utils/rbac.js";

const ESTADOS = ["solicitada", "confirmada", "atendida", "cancelada", "no_asistida"];
const MODALIDADES = ["presencial", "virtual"];
const ESTADOS_QUE_NO_BLOQUEAN_HORARIO = ["cancelada", "no_asistida"];
const MARGEN_MINUTOS_ENTRE_CITAS = 30;

// Verifica que el medico no tenga otra cita activa dentro del margen de tiempo indicado.
// citaIdExcluida se usa al editar una cita para no compararla consigo misma.
const tieneConflictoDeHorario = async (medicoId, fechaHoraAtencion, citaIdExcluida = null) => {
  const fecha = new Date(fechaHoraAtencion);
  const inicioVentana = new Date(fecha.getTime() - MARGEN_MINUTOS_ENTRE_CITAS * 60000);
  const finVentana = new Date(fecha.getTime() + MARGEN_MINUTOS_ENTRE_CITAS * 60000);

  const where = {
    medico_id: medicoId,
    estado: { [Op.notIn]: ESTADOS_QUE_NO_BLOQUEAN_HORARIO },
    fecha_hora_atencion: { [Op.between]: [inicioVentana, finVentana] },
  };
  if (citaIdExcluida) {
    where.id = { [Op.ne]: citaIdExcluida };
  }

  const conflicto = await CitaModel.findOne({ where });
  return Boolean(conflicto);
};

const includeRelaciones = [
  { model: PacienteModel, as: "paciente" },
  {
    model: MedicoModel,
    as: "medico",
    include: { model: EspecialidadModel, as: "especialidad" },
  },
  // Solo el id: el listado lo usa para saber si ya existe consulta (botón
  // "Registrar consulta") sin necesitar el resto de sus campos.
  { model: ConsultaModel, as: "consulta", attributes: ["id"], required: false },
];

export const getCitas = async (req, res) => {
  try {
    const where = {};
    if (req.query.estado) where.estado = req.query.estado;

    // Un paciente/medico solo puede listar sus propias citas: se ignora
    // cualquier paciente_id/medico_id que venga por query y se fuerza el propio.
    // (administrador no llega aqui, ver verifyRol en CitaRouter).
    if (req.user.rol === "paciente") {
      where.paciente_id = req.user.paciente_id;
    } else {
      where.medico_id = req.user.medico_id;
    }

    const citas = await CitaModel.findAll({
      where,
      include: includeRelaciones,
      order: [["fecha_hora_atencion", "DESC"]],
    });
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// includeRelaciones ya trae "consulta" (solo el id, para el listado); aqui se
// necesita completa, asi que se reemplaza esa entrada en vez de duplicarla.
const includeRelacionesConConsultaCompleta = [
  ...includeRelaciones.filter((relacion) => relacion.as !== "consulta"),
  { model: ConsultaModel, as: "consulta" },
];

export const getCitaById = async (req, res) => {
  try {
    const cita = await CitaModel.findByPk(req.params.id, {
      include: includeRelacionesConConsultaCompleta,
    });
    if (!cita) {
      return res.status(404).json({ message: "cita not found" });
    }
    if (!puedeVerCita(req.user, cita)) {
      return res.status(403).json({ message: "No tienes permiso para ver esta cita" });
    }
    res.status(200).json(cita);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCita = async (req, res) => {
  try {
    // Regla de negocio explicita: un medico atiende citas, no las solicita.
    // Solo el propio paciente puede crear una (administrador no llega aqui).
    if (req.user.rol === "medico") {
      return res
        .status(403)
        .json({ message: "un medico no puede solicitar citas, solo atenderlas" });
    }

    // Un paciente siempre agenda para si mismo: se ignora cualquier
    // paciente_id ajeno que intente mandar en el body.
    const paciente_id = req.user.rol === "paciente" ? req.user.paciente_id : req.body.paciente_id;
    const { medico_id, fecha_hora_atencion, modalidad, motivo_consulta } = req.body;
    if (!paciente_id || !medico_id || !fecha_hora_atencion || !modalidad || !motivo_consulta) {
      return res.status(400).json({
        message:
          "paciente_id, medico_id, fecha_hora_atencion, modalidad and motivo_consulta are required",
      });
    }
    if (!MODALIDADES.includes(modalidad)) {
      return res.status(400).json({ message: "modalidad must be presencial or virtual" });
    }
    if (new Date(fecha_hora_atencion) < new Date()) {
      return res.status(400).json({ message: "fecha_hora_atencion cannot be in the past" });
    }

    const paciente = await PacienteModel.findByPk(paciente_id);
    if (!paciente) return res.status(400).json({ message: "paciente_id does not exist" });

    const medico = await MedicoModel.findByPk(medico_id);
    if (!medico) return res.status(400).json({ message: "medico_id does not exist" });

    if (await tieneConflictoDeHorario(medico_id, fecha_hora_atencion)) {
      return res.status(409).json({
        message: `el medico ya tiene otra cita dentro de ${MARGEN_MINUTOS_ENTRE_CITAS} minutos de esa hora`,
      });
    }

    const cita = await CitaModel.create({
      paciente_id,
      medico_id,
      fecha_hora_atencion,
      modalidad,
      motivo_consulta,
      fecha_solicitud: new Date(),
      estado: "solicitada",
    });
    res.status(201).json({ message: "create", cita });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualiza datos generales de la cita (fecha, modalidad, motivo, medico, etc.)
export const updateCita = async (req, res) => {
  try {
    const cita = await CitaModel.findByPk(req.params.id);
    if (!cita) {
      return res.status(404).json({ message: "cita not found" });
    }
    // Reprogramar/reasignar una cita es cosa del medico dueño; el paciente
    // solo puede cancelarla (ver updateEstadoCita/deleteCita).
    if (!(req.user.rol === "medico" && cita.medico_id === req.user.medico_id)) {
      return res.status(403).json({ message: "No tienes permiso para modificar esta cita" });
    }
    if (req.body.modalidad && !MODALIDADES.includes(req.body.modalidad)) {
      return res.status(400).json({ message: "modalidad must be presencial or virtual" });
    }

    const nuevaFecha = req.body.fecha_hora_atencion ?? cita.fecha_hora_atencion;
    const nuevoMedicoId = req.body.medico_id ?? cita.medico_id;
    const cambiaHorarioOMedico =
      req.body.fecha_hora_atencion !== undefined || req.body.medico_id !== undefined;

    if (cambiaHorarioOMedico) {
      if (new Date(nuevaFecha) < new Date()) {
        return res.status(400).json({ message: "fecha_hora_atencion cannot be in the past" });
      }
      if (await tieneConflictoDeHorario(nuevoMedicoId, nuevaFecha, cita.id)) {
        return res.status(409).json({
          message: `el medico ya tiene otra cita dentro de ${MARGEN_MINUTOS_ENTRE_CITAS} minutos de esa hora`,
        });
      }
    }

    // el estado se cambia con updateEstadoCita para mantener las reglas de negocio
    delete req.body.estado;
    cita.set(req.body);
    await cita.save();
    res.status(200).json({ message: "update", cita });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cambia el estado de la cita (solicitada -> confirmada -> atendida / cancelada / no_asistida)
export const updateEstadoCita = async (req, res) => {
  try {
    const { estado } = req.body;
    if (!estado || !ESTADOS.includes(estado)) {
      return res.status(400).json({ message: `estado must be one of: ${ESTADOS.join(", ")}` });
    }
    const cita = await CitaModel.findByPk(req.params.id);
    if (!cita) {
      return res.status(404).json({ message: "cita not found" });
    }
    if (!puedeVerCita(req.user, cita)) {
      return res.status(403).json({ message: "No tienes permiso sobre esta cita" });
    }
    // El paciente dueño solo puede cancelar; confirmar/atender/marcar
    // inasistencia es responsabilidad del medico o de administracion.
    if (req.user.rol === "paciente" && estado !== "cancelada") {
      return res.status(403).json({ message: "Un paciente solo puede cancelar su cita" });
    }
    cita.set({ estado });
    await cita.save();
    res.status(200).json({ message: "update", cita });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCita = async (req, res) => {
  try {
    const cita = await CitaModel.findByPk(req.params.id);
    if (!cita) {
      return res.status(404).json({ message: "cita not found" });
    }
    if (!puedeVerCita(req.user, cita)) {
      return res.status(403).json({ message: "No tienes permiso sobre esta cita" });
    }
    cita.set({ estado: "cancelada" });
    await cita.save();
    res.status(200).json({ message: "delete" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
