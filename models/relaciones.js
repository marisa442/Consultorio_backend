import Cita from './Cita.js';
import Consulta from './Consulta.js';
import ConsultaExamen from './ConsultaExamen.js';
import Especialidad from './Especialidad.js';
import Examen from './ExamenModel.js';
import Medicamento from './MedicamentosModel.js';
import Medico from './MedicoModel.js';
import Paciente from './PacientesModel.js';
import DetalleReceta from './DetalleReceta.js';

// Relaciones Especialidad - Medico
Especialidad.hasMany(Medico, { foreignKey: 'especialidad_id', as: 'medicos' });
Medico.belongsTo(Especialidad, { foreignKey: 'especialidad_id', as: 'especialidad' });

// Relaciones Paciente - Cita
Paciente.hasMany(Cita, { foreignKey: 'paciente_id', as: 'citas' });
Cita.belongsTo(Paciente, { foreignKey: 'paciente_id', as: 'paciente' });

// Relaciones Medico - Cita
Medico.hasMany(Cita, { foreignKey: 'medico_id', as: 'citas' });
Cita.belongsTo(Medico, { foreignKey: 'medico_id', as: 'medico' });

// Relaciones Cita - Consulta (1 a 1)
Cita.hasOne(Consulta, { foreignKey: 'cita_id', as: 'consulta' });
Consulta.belongsTo(Cita, { foreignKey: 'cita_id', as: 'cita' });

// Relaciones Consulta - ConsultaExamen
Consulta.hasMany(ConsultaExamen, { foreignKey: 'consulta_id', as: 'examenes_solicitados' });
ConsultaExamen.belongsTo(Consulta, { foreignKey: 'consulta_id', as: 'consulta' });

// Relaciones Examen - ConsultaExamen (CORREGIDO)
Examen.hasMany(ConsultaExamen, { foreignKey: 'examen_id', as: 'consultas_asociadas' });
ConsultaExamen.belongsTo(Examen, { foreignKey: 'examen_id', as: 'examen' });

// Relaciones Consulta - DetalleReceta
Consulta.hasMany(DetalleReceta, { foreignKey: 'consulta_id', as: 'recetas' });
DetalleReceta.belongsTo(Consulta, { foreignKey: 'consulta_id', as: 'consulta' });

// Relaciones Medicamento - DetalleReceta
Medicamento.hasMany(DetalleReceta, { foreignKey: 'medicamento_id', as: 'consultas_asociadas' });
DetalleReceta.belongsTo(Medicamento, { foreignKey: 'medicamento_id', as: 'medicamento' });

export { 
  Cita, Consulta, ConsultaExamen, Especialidad, Examen, Medicamento, Medico, Paciente, DetalleReceta 
};