import {
  DetalleRecetaModel,
  ConsultaModel,
  MedicamentoModel,
  CitaModel,
} from "../models/index.js";
import { esAdministrador, puedeVerCita } from "../utils/rbac.js";

// Trae la consulta con su cita para poder validar dueño (paciente/medico).
const conCitaDeConsulta = (consultaId) =>
  ConsultaModel.findByPk(consultaId, { include: { model: CitaModel, as: "cita" } });

export const getDetalleRecetas = async (req, res) => {
  try {
    if (!req.query.consulta_id) {
      // Sin filtro no hay forma barata de validar dueño registro por registro;
      // se exige siempre consultar por consulta (el frontend ya navega asi).
      return res.status(400).json({ message: "consulta_id query param is required" });
    }
    const consulta = await conCitaDeConsulta(req.query.consulta_id);
    if (!consulta) return res.status(200).json([]);
    if (!puedeVerCita(req.user, consulta.cita)) {
      return res.status(403).json({ message: "No tienes permiso para ver esta receta" });
    }

    const detalles = await DetalleRecetaModel.findAll({
      where: { consulta_id: req.query.consulta_id },
      include: { model: MedicamentoModel, as: "medicamento" },
    });
    res.status(200).json(detalles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDetalleRecetaById = async (req, res) => {
  try {
    const detalle = await DetalleRecetaModel.findByPk(req.params.id, {
      include: [
        { model: MedicamentoModel, as: "medicamento" },
        { model: ConsultaModel, as: "consulta", include: { model: CitaModel, as: "cita" } },
      ],
    });
    if (!detalle) {
      return res.status(404).json({ message: "detalle_receta not found" });
    }
    if (!puedeVerCita(req.user, detalle.consulta.cita)) {
      return res.status(403).json({ message: "No tienes permiso para ver esta receta" });
    }
    res.status(200).json(detalle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Agrega un medicamento recetado a una consulta existente
export const createDetalleReceta = async (req, res) => {
  try {
    const { consulta_id, medicamento_id, dosis, frecuencia, duracion_tratamiento } = req.body;
    if (!consulta_id || !medicamento_id || !dosis || !frecuencia || !duracion_tratamiento) {
      return res.status(400).json({
        message:
          "consulta_id, medicamento_id, dosis, frecuencia and duracion_tratamiento are required",
      });
    }

    const consulta = await conCitaDeConsulta(consulta_id);
    if (!consulta) return res.status(400).json({ message: "consulta_id does not exist" });
    if (!esAdministrador(req.user) && consulta.cita.medico_id !== req.user.medico_id) {
      return res
        .status(403)
        .json({ message: "solo el medico que atendio la consulta puede recetar" });
    }

    const medicamento = await MedicamentoModel.findByPk(medicamento_id);
    if (!medicamento) return res.status(400).json({ message: "medicamento_id does not exist" });

    const detalle = await DetalleRecetaModel.create(req.body);
    res.status(201).json({ message: "create", detalle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ambos usan la misma regla: solo el medico que atendio la consulta (o administracion) edita/borra.
const verificarDuenoDetalle = async (req, detalle) => {
  const consulta = await conCitaDeConsulta(detalle.consulta_id);
  return esAdministrador(req.user) || consulta?.cita.medico_id === req.user.medico_id;
};

export const updateDetalleReceta = async (req, res) => {
  try {
    const detalle = await DetalleRecetaModel.findByPk(req.params.id);
    if (!detalle) {
      return res.status(404).json({ message: "detalle_receta not found" });
    }
    if (!(await verificarDuenoDetalle(req, detalle))) {
      return res.status(403).json({ message: "No tienes permiso para editar esta receta" });
    }
    delete req.body.consulta_id;
    detalle.set(req.body);
    await detalle.save();
    res.status(200).json({ message: "update", detalle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDetalleReceta = async (req, res) => {
  try {
    const detalle = await DetalleRecetaModel.findByPk(req.params.id);
    if (!detalle) {
      return res.status(404).json({ message: "detalle_receta not found" });
    }
    if (!(await verificarDuenoDetalle(req, detalle))) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esta receta" });
    }
    await detalle.destroy();
    res.status(200).json({ message: "delete" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
