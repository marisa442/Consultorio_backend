import { Op } from "sequelize";
import Cita from "../models/Cita.js";
import PacientesModel from "../models/PacientesModel.js";
import Medico from "../models/MedicoModel.js";

export const obtenerCitas = async (req, res) => {
  try {
    const citas = await Cita.findAll({
      include: [
        { model: PacientesModel, as: 'paciente' },
        { model: Medico, as: 'medico' }
      ]
    });

    return res.status(200).json(citas);

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener las citas",
      error: error.message
    });
  }
};

export const obtenerCitaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const cita = await Cita.findByPk(id, {
      include: [
        { model: PacientesModel, as: 'paciente' },
        { model: Medico, as: 'medico' }
      ]
    });

    if (!cita) {
      return res.status(404).json({
        mensaje: "Cita no encontrada"
      });
    }

    return res.status(200).json(cita);

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener la cita",
      error: error.message
    });
  }
};

export const crearCita = async (req, res) => {
  try {
    const {
      paciente_id,
      medico_id,
      fecha_atencion,
      hora_atencion,
      modalidad,
      motivo
    } = req.body;

    if (!paciente_id || !medico_id || !fecha_atencion || !hora_atencion || !motivo) {
      return res.status(400).json({
        mensaje: "Todos los campos obligatorios deben ser proporcionados."
      });
    }

    const paciente = await PacientesModel.findByPk(paciente_id);
    if (!paciente) {
      return res.status(404).json({
        mensaje: "El paciente no existe."
      });
    }

    const medico = await Medico.findByPk(medico_id);
    if (!medico) {
      return res.status(404).json({
        mensaje: "El médico no existe."
      });
    }

    const modalidadesValidas = ["presencial", "virtual"];
    if (modalidad && !modalidadesValidas.includes(modalidad)) {
      return res.status(400).json({
        mensaje: "Modalidad no válida."
      });
    }

    const citaExistente = await Cita.findOne({
      where: {
        medico_id,
        fecha_atencion,
        hora_atencion,
        estado: {
          [Op.in]: ["solicitada", "confirmada"]
        }
      }
    });

    if (citaExistente) {
      return res.status(400).json({
        mensaje: "El médico ya tiene una cita programada en ese horario."
      });
    }

    const nuevaCita = await Cita.create({
      paciente_id,
      medico_id,
      fecha_atencion,
      hora_atencion,
      modalidad: modalidad || "presencial",
      motivo,
      estado: "solicitada"
    });

    return res.status(201).json({
      mensaje: "Cita registrada correctamente.",
      cita: nuevaCita
    });

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al registrar la cita",
      error: error.message
    });
  }
};

export const actualizarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      medico_id,
      fecha_atencion,
      hora_atencion,
      modalidad,
      motivo
    } = req.body;

    const cita = await Cita.findByPk(id);

    if (!cita) {
      return res.status(404).json({
        mensaje: "Cita no encontrada"
      });
    }

    if (modalidad) {
      const modalidadesValidas = ["presencial", "virtual"];
      if (!modalidadesValidas.includes(modalidad)) {
        return res.status(400).json({
          mensaje: "Modalidad no válida."
        });
      }
    }

    if (medico_id && fecha_atencion && hora_atencion) {
      const citaExistente = await Cita.findOne({
        where: {
          id: {
            [Op.ne]: id
          },
          medico_id,
          fecha_atencion,
          hora_atencion,
          estado: {
            [Op.in]: ["solicitada", "confirmada"]
          }
        }
      });

      if (citaExistente) {
        return res.status(400).json({
          mensaje: "El médico ya tiene otra cita en ese horario."
        });
      }
    }

    await cita.update({
      medico_id: medico_id !== undefined ? medico_id : cita.medico_id,
      fecha_atencion: fecha_atencion !== undefined ? fecha_atencion : cita.fecha_atencion,
      hora_atencion: hora_atencion !== undefined ? hora_atencion : cita.hora_atencion,
      modalidad: modalidad !== undefined ? modalidad : cita.modalidad,
      motivo: motivo !== undefined ? motivo : cita.motivo
    });

    return res.status(200).json({
      mensaje: "Cita actualizada correctamente.",
      cita
    });

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar la cita",
      error: error.message
    });
  }
};

export const cambiarEstadoCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = [
      "solicitada",
      "confirmada",
      "atendida",
      "cancelada",
      "no_asistida"
    ];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        mensaje: "Estado no válido."
      });
    }

    const cita = await Cita.findByPk(id);

    if (!cita) {
      return res.status(404).json({
        mensaje: "Cita no encontrada."
      });
    }

    cita.estado = estado;
    await cita.save();

    return res.status(200).json({
      mensaje: "Estado actualizado correctamente.",
      cita
    });

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar el estado",
      error: error.message
    });
  }
};

export const obtenerCitasPorPaciente = async (req, res) => {
  try {
    const { paciente_id } = req.params;
    const { estado } = req.query;

    const where = { paciente_id };
    if (estado) {
      where.estado = estado;
    }

    const citas = await Cita.findAll({
      where,
      include: [
        { model: PacientesModel, as: 'paciente' },
        { model: Medico, as: 'medico' }
      ],
      order: [['fecha_atencion', 'DESC']]
    });

    return res.status(200).json(citas);

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener las citas del paciente",
      error: error.message
    });
  }
};

export const obtenerCitasPorMedico = async (req, res) => {
  try {
    const { medico_id } = req.params;

    const citas = await Cita.findAll({
      where: {
        medico_id
      },
      include: [
        { model: PacientesModel, as: 'paciente' },
        { model: Medico, as: 'medico' }
      ]
    });

    return res.status(200).json(citas);

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener las citas del médico",
      error: error.message
    });
  }
};