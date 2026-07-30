import ConsultaExamen from '../models/ConsultaExamen.js'; 

export const obtenerExamenesSolicitados = async (req, res) => {
  try {
    const examenes = await ConsultaExamen.findAll();
    return res.status(200).json(examenes);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener exámenes solicitados', error: error.message });
  }
};

export const obtenerExamenSolicitadoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const examen = await ConsultaExamen.findByPk(id);
    if (!examen) {
      return res.status(404).json({ mensaje: 'Examen solicitado no encontrado' });
    }
    return res.status(200).json(examen);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener el examen', error: error.message });
  }
};

export const obtenerExamenesPorConsulta = async (req, res) => {
  try {
    const { consulta_id } = req.params;
    const examenes = await ConsultaExamen.findAll({ where: { consulta_id } });
    return res.status(200).json(examenes);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener los exámenes de la consulta', error: error.message });
  }
};

export const solicitarExamenes = async (req, res) => {
  try {
    const nuevoExamen = await ConsultaExamen.create(req.body);
    return res.status(201).json({ mensaje: 'Examen solicitado correctamente', examen: nuevoExamen });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al solicitar el examen', error: error.message });
  }
};

export const registrarResultado = async (req, res) => {
  try {
    const { id } = req.params;
    const { resultado } = req.body;
    const examen = await ConsultaExamen.findByPk(id);

    if (!examen) {
      return res.status(404).json({ mensaje: 'Examen solicitado no encontrado' });
    }

    await examen.update({ resultado, estado: 'realizado' });
    return res.status(200).json({ mensaje: 'Resultado registrado correctamente', examen });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al registrar el resultado', error: error.message });
  }
};

export const cambiarEstadoExamen = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const examen = await ConsultaExamen.findByPk(id);

    if (!examen) {
      return res.status(404).json({ mensaje: 'Examen solicitado no encontrado' });
    }

    await examen.update({ estado });
    return res.status(200).json({ mensaje: 'Estado actualizado correctamente', examen });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al cambiar estado', error: error.message });
  }
};