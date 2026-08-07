// Punto central de asociaciones entre modelos.
// Se importa una sola vez (desde index.js del proyecto) para que Sequelize
// conozca todas las relaciones antes de sincronizar la base de datos.
import { UsuarioModel } from "./UsuarioModel.js";
import { EspecialidadModel } from "./EspecialidadModel.js";
import { PacienteModel } from "./PacienteModel.js";
import { MedicoModel } from "./MedicoModel.js";
import { CitaModel } from "./CitaModel.js";
import { ConsultaModel } from "./ConsultaModel.js";
import { MedicamentoModel } from "./MedicamentoModel.js";
import { DetalleRecetaModel } from "./DetalleRecetaModel.js";
import { ExamenModel } from "./ExamenModel.js";
import { ExamenSolicitadoModel } from "./ExamenSolicitadoModel.js";

// Usuario N--1 Paciente / Medico (la cuenta de acceso se vincula a su registro de dominio)
UsuarioModel.belongsTo(PacienteModel, { foreignKey: "paciente_id", as: "paciente" });
UsuarioModel.belongsTo(MedicoModel, { foreignKey: "medico_id", as: "medico" });

// Especialidad 1--N Medico
EspecialidadModel.hasMany(MedicoModel, {
  foreignKey: "especialidad_id",
  as: "medicos",
});
MedicoModel.belongsTo(EspecialidadModel, {
  foreignKey: "especialidad_id",
  as: "especialidad",
});

// Paciente 1--N Cita
PacienteModel.hasMany(CitaModel, { foreignKey: "paciente_id", as: "citas" });
CitaModel.belongsTo(PacienteModel, {
  foreignKey: "paciente_id",
  as: "paciente",
});

// Medico 1--N Cita
MedicoModel.hasMany(CitaModel, { foreignKey: "medico_id", as: "citas" });
CitaModel.belongsTo(MedicoModel, { foreignKey: "medico_id", as: "medico" });

// Cita 1--1 Consulta (una cita atendida genera como maximo una consulta)
CitaModel.hasOne(ConsultaModel, { foreignKey: "cita_id", as: "consulta" });
ConsultaModel.belongsTo(CitaModel, { foreignKey: "cita_id", as: "cita" });

// Consulta N--M Medicamento a traves de DetalleReceta
ConsultaModel.hasMany(DetalleRecetaModel, {
  foreignKey: "consulta_id",
  as: "detalle_recetas",
});
DetalleRecetaModel.belongsTo(ConsultaModel, {
  foreignKey: "consulta_id",
  as: "consulta",
});
MedicamentoModel.hasMany(DetalleRecetaModel, {
  foreignKey: "medicamento_id",
  as: "detalle_recetas",
});
DetalleRecetaModel.belongsTo(MedicamentoModel, {
  foreignKey: "medicamento_id",
  as: "medicamento",
});

// Consulta N--M Examen a traves de ExamenSolicitado
ConsultaModel.hasMany(ExamenSolicitadoModel, {
  foreignKey: "consulta_id",
  as: "examenes_solicitados",
});
ExamenSolicitadoModel.belongsTo(ConsultaModel, {
  foreignKey: "consulta_id",
  as: "consulta",
});
ExamenModel.hasMany(ExamenSolicitadoModel, {
  foreignKey: "examen_id",
  as: "solicitudes",
});
ExamenSolicitadoModel.belongsTo(ExamenModel, {
  foreignKey: "examen_id",
  as: "examen",
});

export {
  UsuarioModel,
  EspecialidadModel,
  PacienteModel,
  MedicoModel,
  CitaModel,
  ConsultaModel,
  MedicamentoModel,
  DetalleRecetaModel,
  ExamenModel,
  ExamenSolicitadoModel,
};
