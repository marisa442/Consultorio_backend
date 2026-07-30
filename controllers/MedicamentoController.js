import Medicamento from '../models/MedicamentosModel.js';
import { Op } from 'sequelize';

export const getMedicamentos = async (req, res) => {
  try {
    const medicamentos = await Medicamento.findAll({
      order: [['nombre', 'ASC']]
    });
    res.status(200).json(medicamentos);
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al obtener los medicamentos', 
      error: error.message 
    });
  }
};

export const getMedicamentoById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicamento = await Medicamento.findByPk(id);

    if (!medicamento) {
      return res.status(404).json({ mensaje: 'Medicamento no encontrado' });
    }

    res.status(200).json(medicamento);
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al buscar el medicamento', 
      error: error.message 
    });
  }
};

export const createMedicamento = async (req, res) => {
  try {
    const { codigo, nombre, descripcion, formaFarmaceutica, concentracion, stock, precioUnitario } = req.body;

    if (!codigo || !nombre || !formaFarmaceutica || !concentracion) {
      return res.status(400).json({ 
        mensaje: 'Los campos codigo, nombre, formaFarmaceutica y concentracion son obligatorios' 
      });
    }

    const existente = await Medicamento.findOne({ 
      where: { codigo } 
    });
    
    if (existente) {
      return res.status(400).json({ 
        mensaje: 'Ya existe un medicamento con ese código' 
      });
    }

    if (stock !== undefined && (isNaN(stock) || stock < 0)) {
      return res.status(400).json({ 
        mensaje: 'El stock debe ser un número positivo' 
      });
    }

    if (precioUnitario !== undefined && (isNaN(precioUnitario) || precioUnitario < 0)) {
      return res.status(400).json({ 
        mensaje: 'El precio unitario debe ser un número positivo' 
      });
    }

    const nuevoMedicamento = await Medicamento.create({
      codigo: codigo.trim().toUpperCase(),
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      formaFarmaceutica: formaFarmaceutica.trim(),
      concentracion: concentracion.trim(),
      stock: stock || 0,
      precioUnitario: precioUnitario || 0.00
    });

    res.status(201).json({
      mensaje: 'Medicamento registrado exitosamente',
      medicamento: nuevoMedicamento
    });
  } catch (error) {
    res.status(400).json({ 
      mensaje: 'Error al registrar el medicamento', 
      error: error.message 
    });
  }
};

export const updateMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, nombre, descripcion, formaFarmaceutica, concentracion, stock, precioUnitario } = req.body;
    const medicamento = await Medicamento.findByPk(id);

    if (!medicamento) {
      return res.status(404).json({ mensaje: 'Medicamento no encontrado' });
    }

    if (codigo && codigo !== medicamento.codigo) {
      const existente = await Medicamento.findOne({ 
        where: { 
          codigo,
          id: { [Op.ne]: id }
        } 
      });
      
      if (existente) {
        return res.status(400).json({ 
          mensaje: 'Ya existe otro medicamento con ese código' 
        });
      }
    }

    if (stock !== undefined && (isNaN(stock) || stock < 0)) {
      return res.status(400).json({ 
        mensaje: 'El stock debe ser un número positivo' 
      });
    }

    if (precioUnitario !== undefined && (isNaN(precioUnitario) || precioUnitario < 0)) {
      return res.status(400).json({ 
        mensaje: 'El precio unitario debe ser un número positivo' 
      });
    }

    const datosActualizados = {};
    if (codigo) datosActualizados.codigo = codigo.trim().toUpperCase();
    if (nombre) datosActualizados.nombre = nombre.trim();
    if (descripcion !== undefined) datosActualizados.descripcion = descripcion ? descripcion.trim() : null;
    if (formaFarmaceutica) datosActualizados.formaFarmaceutica = formaFarmaceutica.trim();
    if (concentracion) datosActualizados.concentracion = concentracion.trim();
    if (stock !== undefined) datosActualizados.stock = parseInt(stock);
    if (precioUnitario !== undefined) datosActualizados.precioUnitario = parseFloat(precioUnitario);

    await medicamento.update(datosActualizados);

    res.status(200).json({
      mensaje: 'Medicamento actualizado exitosamente',
      medicamento
    });
  } catch (error) {
    res.status(400).json({ 
      mensaje: 'Error al actualizar el medicamento', 
      error: error.message 
    });
  }
};

export const deleteMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const medicamento = await Medicamento.findByPk(id);

    if (!medicamento) {
      return res.status(404).json({ mensaje: 'Medicamento no encontrado' });
    }

    await medicamento.destroy();

    res.status(200).json({ mensaje: 'Medicamento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al eliminar el medicamento', 
      error: error.message 
    });
  }
};