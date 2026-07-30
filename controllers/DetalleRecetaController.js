import DetalleReceta from '../models/DetalleReceta.js';
import Consulta from '../models/Consulta.js';
import Medicamento from '../models/MedicamentosModel.js';
import { sequelize } from '../db/conexion.js';

export const getDetallesReceta = async (req, res) => {
  try {
    const detalles = await DetalleReceta.findAll({
      include: [
        { model: Consulta, as: 'consulta' },
        { model: Medicamento, as: 'medicamento' }
      ]
    });
    res.status(200).json(detalles);
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al obtener los detalles de recetas',
      error: error.message 
    });
  }
};

export const getDetallesByConsulta = async (req, res) => {
  try {
    const { consulta_id } = req.params;
    
    const detalles = await DetalleReceta.findAll({
      where: { consulta_id },
      include: [
        { model: Medicamento, as: 'medicamento' }
      ]
    });
    
    res.status(200).json(detalles);
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al obtener los detalles de la consulta',
      error: error.message 
    });
  }
};

export const createDetalleReceta = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { consulta_id, medicamento_id, dosis, frecuencia, duracion_tratamiento, indicaciones } = req.body;

    if (!consulta_id || !medicamento_id || !dosis || !frecuencia || !duracion_tratamiento) {
      await transaction.rollback();
      return res.status(400).json({ 
        mensaje: 'Todos los campos son obligatorios excepto indicaciones' 
      });
    }

    const consulta = await Consulta.findByPk(consulta_id, { transaction });
    if (!consulta) {
      await transaction.rollback();
      return res.status(404).json({ 
        mensaje: 'La consulta no existe' 
      });
    }

    const medicamento = await Medicamento.findByPk(medicamento_id, { transaction });
    if (!medicamento) {
      await transaction.rollback();
      return res.status(404).json({ 
        mensaje: 'El medicamento no existe' 
      });
    }

    const nuevoDetalle = await DetalleReceta.create({
      consulta_id,
      medicamento_id,
      dosis: dosis.trim(),
      frecuencia: frecuencia.trim(),
      duracion_tratamiento: duracion_tratamiento.trim(),
      indicaciones: indicaciones ? indicaciones.trim() : null
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      mensaje: 'Medicamento recetado correctamente',
      detalle: nuevoDetalle
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ 
      mensaje: 'Error al registrar el medicamento en la receta',
      error: error.message 
    });
  }
};

export const deleteDetalleReceta = async (req, res) => {
  try {
    const { id } = req.params;
    
    const detalle = await DetalleReceta.findByPk(id);
    if (!detalle) {
      return res.status(404).json({ 
        mensaje: 'Detalle de receta no encontrado' 
      });
    }

    await detalle.destroy();
    
    res.status(200).json({ 
      mensaje: 'Medicamento eliminado de la receta correctamente' 
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al eliminar el detalle de receta',
      error: error.message 
    });
  }
};