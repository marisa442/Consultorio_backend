
export const ROLES = ["administrador", "medico", "paciente"];

export const esAdministrador = (user) => user?.rol === "administrador";

export const esDuenoCitaComoPaciente = (user, cita) =>
  user?.rol === "paciente" &&
  user?.paciente_id != null &&
  cita?.paciente_id === user.paciente_id;

export const esDuenoCitaComoMedico = (user, cita) =>
  user?.rol === "medico" && user?.medico_id != null && cita?.medico_id === user.medico_id;

export const puedeVerCita = (user, cita) =>
  esAdministrador(user) || esDuenoCitaComoPaciente(user, cita) || esDuenoCitaComoMedico(user, cita);

export const puedeVerPaciente = (user, pacienteId) =>
  esAdministrador(user) ||
  user?.rol === "medico" ||
  (user?.rol === "paciente" && user?.paciente_id === pacienteId);
