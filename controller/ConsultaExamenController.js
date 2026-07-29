import ConsultaExamen from "../models/ConsultaExamen.js";
import Consulta from "../models/Consulta.js";
import Examen from "../models/Examen.js";

export const obtenerExamenesSolicitados = async (req, res) => {
  try {
    const examenes = await ConsultaExamen.findAll({
      include: [
        { model: Consulta },
        { model: Examen }
      ]
    });

    return res.status(200).json(examenes);

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener los exámenes solicitados",
      error: error.message
    });
  }
};

// Obtener un examen solicitado por ID
export const obtenerExamenSolicitadoPorId = async (req, res) => {
  try {

    const { id } = req.params;

    const examen = await ConsultaExamen.findByPk(id, {
      include: [
        { model: Consulta },
        { model: Examen }
      ]
    });

    if (!examen) {
      return res.status(404).json({
        mensaje: "Examen solicitado no encontrado."
      });
    }

    return res.status(200).json(examen);

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener el examen solicitado",
      error: error.message
    });
  }
};

export const obtenerExamenesPorConsulta = async (req, res) => {
  try {

    const { consulta_id } = req.params;

    const examenes = await ConsultaExamen.findAll({
      where: {
        consulta_id
      },
      include: [
        { model: Examen }
      ]
    });

    return res.status(200).json(examenes);

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener los exámenes de la consulta",
      error: error.message
    });
  }
};

// Solicitar uno o varios exámenes
export const solicitarExamenes = async (req, res) => {
  try {

    const { consulta_id, examenes } = req.body;

    if (!consulta_id || !Array.isArray(examenes) || examenes.length === 0) {
      return res.status(400).json({
        mensaje: "Debe proporcionar una consulta y al menos un examen."
      });
    }

    // Verificar que exista la consulta
    const consulta = await Consulta.findByPk(consulta_id);

    if (!consulta) {
      return res.status(404).json({
        mensaje: "La consulta no existe."
      });
    }

    const registros = [];

    for (const examen_id of examenes) {

      const examen = await Examen.findByPk(examen_id);

      if (!examen) {
        return res.status(404).json({
          mensaje: `El examen con ID ${examen_id} no existe.`
        });
      }

      registros.push({
        consulta_id,
        examen_id,
        fecha_solicitud: new Date(),
        estado: "solicitado"
      });
    }

    const nuevosExamenes = await ConsultaExamen.bulkCreate(registros);

    return res.status(201).json({
      mensaje: "Exámenes solicitados correctamente.",
      examenes: nuevosExamenes
    });

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al solicitar los exámenes",
      error: error.message
    });
  }
};

// Registrar resultado del examen
export const registrarResultado = async (req, res) => {
  try {

    const { id } = req.params;
    const { resultado, estado } = req.body;

    const examenSolicitado = await ConsultaExamen.findByPk(id);

    if (!examenSolicitado) {
      return res.status(404).json({
        mensaje: "Examen solicitado no encontrado."
      });
    }

    if (!resultado) {
      return res.status(400).json({
        mensaje: "El resultado del examen es obligatorio."
      });
    }

    const estadosValidos = [
      "solicitado",
      "realizado",
      "entregado",
      "cancelado"
    ];

    if (estado && !estadosValidos.includes(estado)) {
      return res.status(400).json({
        mensaje: "Estado no válido."
      });
    }

    examenSolicitado.resultado = resultado;
    examenSolicitado.fecha_resultado = new Date();
    examenSolicitado.estado = estado || "realizado";

    await examenSolicitado.save();

    return res.status(200).json({
      mensaje: "Resultado registrado correctamente.",
      examen: examenSolicitado
    });

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al registrar el resultado",
      error: error.message
    });
  }
};

export const cambiarEstadoExamen = async (req, res) => {
  try {

    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = [
      "solicitado",
      "realizado",
      "entregado",
      "cancelado"
    ];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        mensaje: "Estado no válido."
      });
    }

    const examen = await ConsultaExamen.findByPk(id);

    if (!examen) {
      return res.status(404).json({
        mensaje: "Examen solicitado no encontrado."
      });
    }

    examen.estado = estado;

    await examen.save();

    return res.status(200).json({
      mensaje: "Estado actualizado correctamente.",
      examen
    });

  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar el estado",
      error: error.message
    });
  }
};