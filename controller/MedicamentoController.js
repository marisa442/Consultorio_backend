import  Medicamento from '../models/MedicamentoModel.js';




// 1. Obtener todos los medicamentos
export const getMedicamentos = async (req, res) => {
  try {
    const medicamentos = await Medicamento.findAll();
    res.status(200).json(medicamentos);
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al obtener los medicamentos', 
      error: error.message 
    });
  }
};



// 2. Obtener un medicamento por ID
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




// 3. Crear un nuevo medicamento
export const createMedicamento = async (req, res) => {
  try {
    const { 
      codigo, 
      nombre, 
      descripcion, 
      formaFarmaceutica, 
      concentracion, 
      stock, 
      precioUnitario 
    } = req.body;

    const nuevoMedicamento = await Medicamento.create({
      codigo,
      nombre,
      descripcion,
      formaFarmaceutica,
      concentracion,
      stock,
      precioUnitario
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




// 4. Actualizar un medicamento
export const updateMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const medicamento = await Medicamento.findByPk(id);

    if (!medicamento) {
      return res.status(404).json({ mensaje: 'Medicamento no encontrado' });
    }

    await medicamento.update(req.body);

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





// 5. Eliminar un medicamento
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