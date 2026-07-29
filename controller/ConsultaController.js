import Consulta from "../models/Consulta.js";
import Cita from "../models/Cita.js";
import sequelize from "../db/conexion.js";

export const obtenerConsultas = async (req, res) => {
  try {
    const consultas = await Consulta.findAll({
      include: [{ model: Cita }]
    });

    return res.status(200).json(consultas);

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener las consultas",
      error: error.message
    });
  }
};

export const obtenerConsultaPorId = async (req, res) => {
  try {

    const { id } = req.params;

    const consulta = await Consulta.findByPk(id, {
      include: [{ model: Cita }]
    });

    if (!consulta) {
      return res.status(404).json({
        mensaje: "Consulta no encontrada"
      });
    }

    return res.status(200).json(consulta);

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener la consulta",
      error: error.message
    });
  }
};

export const crearConsulta = async (req, res) => {

  const transaction = await sequelize.transaction();

  try {

    const {
      cita_id,
      sintomas,
      diagnostico,
      observaciones,
      recomendaciones
    } = req.body;

    if (!cita_id || !sintomas || !diagnostico) {
      await transaction.rollback();

      return res.status(400).json({
        mensaje: "La cita, los síntomas y el diagnóstico son obligatorios."
      });
    }

    const cita = await Cita.findByPk(cita_id, { transaction });

    if (!cita) {
      await transaction.rollback();

      return res.status(404).json({
        mensaje: "La cita no existe."
      });
    }

    if (cita.estado !== "confirmada") {
      await transaction.rollback();

      return res.status(400).json({
        mensaje: "Solo las citas confirmadas pueden registrarse como consulta."
      });
    }

    const consultaExistente = await Consulta.findOne({
      where: {
        cita_id
      },
      transaction
    });

    if (consultaExistente) {
      await transaction.rollback();

      return res.status(400).json({
        mensaje: "Esta cita ya tiene una consulta registrada."
      });
    }

    const nuevaConsulta = await Consulta.create({
      cita_id,
      sintomas,
      diagnostico,
      observaciones,
      recomendaciones,
      fecha_atencion: new Date()
    }, { transaction });

    // Cambiar el estado de la cita
    cita.estado = "atendida";
    await cita.save({ transaction });

    await transaction.commit();

    return res.status(201).json({
      mensaje: "Consulta registrada correctamente.",
      consulta: nuevaConsulta
    });

  } catch (error) {

    await transaction.rollback();

    return res.status(500).json({
      mensaje: "Error al registrar la consulta",
      error: error.message
    });
  }
};

export const actualizarConsulta = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      sintomas,
      diagnostico,
      observaciones,
      recomendaciones
    } = req.body;

    const consulta = await Consulta.findByPk(id);

    if (!consulta) {
      return res.status(404).json({
        mensaje: "Consulta no encontrada."
      });
    }

    await consulta.update({
      sintomas: sintomas ?? consulta.sintomas,
      diagnostico: diagnostico ?? consulta.diagnostico,
      observaciones: observaciones ?? consulta.observaciones,
      recomendaciones: recomendaciones ?? consulta.recomendaciones
    });

    return res.status(200).json({
      mensaje: "Consulta actualizada correctamente.",
      consulta
    });

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar la consulta",
      error: error.message
    });
  }
};