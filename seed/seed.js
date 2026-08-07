// Script de datos iniciales del sistema: especialidades, catalogo de
// medicamentos/examenes, y 5 cuentas fijas (1 administrador, 2 medicos,
// 2 pacientes) con citas/consultas/recetas ya cargadas para poder probar
// los 3 roles sin partir de cero.
// Idempotente: se puede correr varias veces sin duplicar nada.
// Uso: npm run seed
import bcrypt from "bcrypt";
import { sequelize } from "../db/conexion.js";
import {
  UsuarioModel,
  EspecialidadModel,
  MedicoModel,
  PacienteModel,
  MedicamentoModel,
  ExamenModel,
  CitaModel,
  ConsultaModel,
  DetalleRecetaModel,
  ExamenSolicitadoModel,
} from "../models/index.js";

const ESPECIALIDADES = [
  { nombre: "Medicina General", descripcion: "Atencion medica general" },
  { nombre: "Odontologia", descripcion: "Atencion dental" },
  { nombre: "Psicologia", descripcion: "Atencion psicologica" },
  { nombre: "Nutricion", descripcion: "Atencion nutricional" },
  { nombre: "Fisioterapia", descripcion: "Atencion fisioterapeutica" },
];

const MEDICAMENTOS = [
  {
    codigo: "PAR500",
    nombre: "Paracetamol",
    presentacion: "Tabletas",
    concentracion: "500 mg",
    descripcion: "Analgesico y antipiretico",
    precio: 0.15,
    cantidad_disponible: 500,
  },
  {
    codigo: "IBU400",
    nombre: "Ibuprofeno",
    presentacion: "Tabletas",
    concentracion: "400 mg",
    descripcion: "Antiinflamatorio no esteroideo",
    precio: 0.2,
    cantidad_disponible: 300,
  },
  {
    codigo: "AMOX500",
    nombre: "Amoxicilina",
    presentacion: "Capsulas",
    concentracion: "500 mg",
    descripcion: "Antibiotico de amplio espectro",
    precio: 0.35,
    cantidad_disponible: 200,
  },
];

const EXAMENES = [
  { codigo: "HEMO01", nombre: "Hemograma completo", descripcion: "Analisis general de sangre", costo: 8.5 },
  { codigo: "RXTX01", nombre: "Radiografia de torax", descripcion: "Imagen diagnostica de torax", costo: 15 },
  { codigo: "GLU01", nombre: "Glucosa en ayunas", descripcion: "Nivel de glucosa en sangre", costo: 5 },
];

const ADMIN = {
  nombre: "Administrador",
  email: "admin@espam.edu.ec",
  password: "EspamAdmin#26",
  rol: "administrador",
};

const MEDICO_1 = {
  numero_identificacion: "1300000001",
  nombres: "Elena",
  apellidos: "Vera",
  correo_electronico: "e.vera@espam.edu.ec",
  telefono: "0990000001",
  numero_licencia: "LIC-0001",
  especialidad: "Medicina General",
  password: "EVera#Med26",
};

const MEDICO_2 = {
  numero_identificacion: "1300000003",
  nombres: "Jorge",
  apellidos: "Ponce",
  correo_electronico: "j.ponce@espam.edu.ec",
  telefono: "0990000003",
  numero_licencia: "LIC-0002",
  especialidad: "Fisioterapia",
  password: "JPonce#Med26",
};

const PACIENTE_1 = {
  numero_identificacion: "1300000002",
  nombres: "Carlos",
  apellidos: "Zambrano",
  fecha_nacimiento: "2001-05-14",
  sexo: "M",
  correo_electronico: "c.zambrano@espam.edu.ec",
  telefono: "0990000002",
  direccion: "Campus ESPAM, Calceta",
  tipo_paciente: "estudiante",
  password: "CZambrano#26",
};

const PACIENTE_2 = {
  numero_identificacion: "1300000004",
  nombres: "Maria",
  apellidos: "Delgado",
  fecha_nacimiento: "1985-11-02",
  sexo: "F",
  correo_electronico: "m.delgado@espam.edu.ec",
  telefono: "0990000004",
  direccion: "Campus ESPAM, Calceta",
  tipo_paciente: "docente",
  password: "MDelgado#26",
};

const crearUsuarioSiNoExiste = async ({ nombre, email, password, rol, paciente_id, medico_id }) => {
  const existente = await UsuarioModel.findOne({ where: { email } });
  if (existente) return existente;
  const hash = await bcrypt.hash(password, 10);
  return UsuarioModel.create({ nombre, email, password: hash, rol, paciente_id, medico_id });
};

const crearMedico = async (datos) => {
  const especialidad = await EspecialidadModel.findOne({ where: { nombre: datos.especialidad } });
  const [medico] = await MedicoModel.findOrCreate({
    where: { correo_electronico: datos.correo_electronico },
    defaults: {
      numero_identificacion: datos.numero_identificacion,
      nombres: datos.nombres,
      apellidos: datos.apellidos,
      correo_electronico: datos.correo_electronico,
      telefono: datos.telefono,
      numero_licencia: datos.numero_licencia,
      especialidad_id: especialidad.id,
    },
  });
  await crearUsuarioSiNoExiste({
    nombre: `${datos.nombres} ${datos.apellidos}`,
    email: datos.correo_electronico,
    password: datos.password,
    rol: "medico",
    medico_id: medico.id,
  });
  console.log(`Medico listo -> ${datos.correo_electronico} / ${datos.password}`);
  return medico;
};

const crearPaciente = async (datos) => {
  const [paciente] = await PacienteModel.findOrCreate({
    where: { correo_electronico: datos.correo_electronico },
    defaults: {
      numero_identificacion: datos.numero_identificacion,
      nombres: datos.nombres,
      apellidos: datos.apellidos,
      fecha_nacimiento: datos.fecha_nacimiento,
      sexo: datos.sexo,
      correo_electronico: datos.correo_electronico,
      telefono: datos.telefono,
      direccion: datos.direccion,
      tipo_paciente: datos.tipo_paciente,
    },
  });
  await crearUsuarioSiNoExiste({
    nombre: `${datos.nombres} ${datos.apellidos}`,
    email: datos.correo_electronico,
    password: datos.password,
    rol: "paciente",
    paciente_id: paciente.id,
  });
  console.log(`Paciente listo -> ${datos.correo_electronico} / ${datos.password}`);
  return paciente;
};

// Hoy a una hora fija (para que la "agenda del dia" del medico tenga contenido sin importar cuando se corra el seed).
const hoyA = (horas, minutos) => {
  const fecha = new Date();
  fecha.setHours(horas, minutos, 0, 0);
  return fecha;
};

const haceDiasA = (dias, horas, minutos) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - dias);
  fecha.setHours(horas, minutos, 0, 0);
  return fecha;
};

const run = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });

    for (const especialidad of ESPECIALIDADES) {
      await EspecialidadModel.findOrCreate({ where: { nombre: especialidad.nombre }, defaults: especialidad });
    }
    console.log("Especialidades listas.");

    for (const medicamento of MEDICAMENTOS) {
      await MedicamentoModel.findOrCreate({ where: { codigo: medicamento.codigo }, defaults: medicamento });
    }
    console.log("Medicamentos listos.");

    for (const examen of EXAMENES) {
      await ExamenModel.findOrCreate({ where: { codigo: examen.codigo }, defaults: examen });
    }
    console.log("Examenes listos.");

    await crearUsuarioSiNoExiste(ADMIN);
    console.log(`Administrador listo -> ${ADMIN.email} / ${ADMIN.password}`);

    const medico1 = await crearMedico(MEDICO_1);
    const medico2 = await crearMedico(MEDICO_2);
    const paciente1 = await crearPaciente(PACIENTE_1);
    await crearPaciente(PACIENTE_2); // sin citas a proposito: sirve para probar en vivo la solicitud de una nueva

    // ---- Contexto clinico de Paciente 1 -----------------------------------

    // 1) Cita atendida hace 5 dias con Medico 1 -> genera consulta + receta vigente + examen pendiente.
    const [citaAtendida] = await CitaModel.findOrCreate({
      where: { paciente_id: paciente1.id, medico_id: medico1.id, motivo_consulta: "Dolor de cabeza persistente y fiebre leve" },
      defaults: {
        fecha_solicitud: haceDiasA(6, 8, 0),
        fecha_hora_atencion: haceDiasA(5, 9, 0),
        modalidad: "presencial",
        estado: "atendida",
      },
    });

    const [consulta] = await ConsultaModel.findOrCreate({
      where: { cita_id: citaAtendida.id },
      defaults: {
        diagnostico: "Cefalea tensional con cuadro febril leve",
        sintomas: "Dolor de cabeza, fiebre 38°C, malestar general",
        observaciones: "Paciente estable, sin signos de alarma",
        recomendaciones: "Reposo, hidratacion abundante, control en 5 dias si persisten los sintomas",
        fecha_atencion: haceDiasA(5, 9, 20),
      },
    });

    const paracetamol = await MedicamentoModel.findOne({ where: { codigo: "PAR500" } });
    await DetalleRecetaModel.findOrCreate({
      where: { consulta_id: consulta.id, medicamento_id: paracetamol.id },
      defaults: {
        dosis: "1 tableta",
        frecuencia: "Cada 8 horas",
        duracion_tratamiento: "5 dias",
        indicaciones: "Tomar con alimentos",
      },
    });

    const hemograma = await ExamenModel.findOne({ where: { codigo: "HEMO01" } });
    await ExamenSolicitadoModel.findOrCreate({
      where: { consulta_id: consulta.id, examen_id: hemograma.id },
      defaults: { fecha_solicitud: haceDiasA(5, 9, 20), estado: "solicitado" },
    });

    // 2) Cita de hoy confirmada con Medico 1 -> agenda del dia de Medicina General.
    await CitaModel.findOrCreate({
      where: { paciente_id: paciente1.id, medico_id: medico1.id, motivo_consulta: "Control post-tratamiento" },
      defaults: {
        fecha_solicitud: haceDiasA(2, 10, 0),
        fecha_hora_atencion: hoyA(10, 0),
        modalidad: "presencial",
        estado: "confirmada",
      },
    });

    // 3) Cita de hoy solicitada con Medico 2 -> agenda propia de Fisioterapia.
    await CitaModel.findOrCreate({
      where: { paciente_id: paciente1.id, medico_id: medico2.id, motivo_consulta: "Dolor lumbar por mala postura" },
      defaults: {
        fecha_solicitud: haceDiasA(1, 15, 0),
        fecha_hora_atencion: hoyA(11, 30),
        modalidad: "presencial",
        estado: "solicitada",
      },
    });

    console.log("Citas/consulta/receta/examen iniciales listos.");
    console.log("Seed completado.");
    process.exit(0);
  } catch (error) {
    console.error("Error ejecutando seed:", error);
    process.exit(1);
  }
};

run();
