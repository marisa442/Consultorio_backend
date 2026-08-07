import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsuarioModel, PacienteModel, MedicoModel } from "../models/index.js";
import { TOKEN_KEY } from "../config/config.js";
import { ROLES } from "../utils/rbac.js";

const ATRIBUTOS_PUBLICOS = ["id", "nombre", "email", "rol", "paciente_id", "medico_id"];

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const usuario = await UsuarioModel.findOne({ where: { email, estado: true } });
    if (!usuario) {
      return res.status(401).json({ message: "credenciales invalidas" });
    }

    const passwordOk = await bcrypt.compare(password, usuario.password);
    if (!passwordOk) {
      return res.status(401).json({ message: "credenciales invalidas" });
    }

    // paciente_id/medico_id viajan en el token para que verifyToken pueda
    // resolver "es dueño de este recurso" sin una consulta extra por request.
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        paciente_id: usuario.paciente_id,
        medico_id: usuario.medico_id,
      },
      TOKEN_KEY,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      message: "login",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        paciente_id: usuario.paciente_id,
        medico_id: usuario.medico_id,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Protegido con verifyToken + verifyRol('administrador'): solo un administrador
// crea cuentas de acceso (para si mismo, para un medico o para un paciente ya
// existentes en sus respectivos catalogos).
export const register = async (req, res) => {
  try {
    const { nombre, email, password, rol, paciente_id, medico_id } = req.body;
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ message: "nombre, email, password and rol are required" });
    }
    if (!ROLES.includes(rol)) {
      return res.status(400).json({ message: `rol must be one of: ${ROLES.join(", ")}` });
    }
    if (rol === "medico") {
      if (!medico_id) {
        return res.status(400).json({ message: "medico_id is required when rol is medico" });
      }
      const medico = await MedicoModel.findByPk(medico_id);
      if (!medico) return res.status(400).json({ message: "medico_id does not exist" });
    }
    if (rol === "paciente") {
      if (!paciente_id) {
        return res.status(400).json({ message: "paciente_id is required when rol is paciente" });
      }
      const paciente = await PacienteModel.findByPk(paciente_id);
      if (!paciente) return res.status(400).json({ message: "paciente_id does not exist" });
    }

    const existente = await UsuarioModel.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ message: "ya existe un usuario con ese email" });
    }

    const hash = await bcrypt.hash(password, 10);
    const usuario = await UsuarioModel.create({
      nombre,
      email,
      password: hash,
      rol,
      paciente_id: rol === "paciente" ? paciente_id : null,
      medico_id: rol === "medico" ? medico_id : null,
    });

    res.status(201).json({ message: "create", usuario: usuario.get({ plain: true, attributes: ATRIBUTOS_PUBLICOS }) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Registro publico (sin token): solo puede crear cuentas de rol "paciente",
// creando en el mismo paso el registro de Paciente asociado.
export const registroPaciente = async (req, res) => {
  try {
    const {
      email,
      password,
      numero_identificacion,
      nombres,
      apellidos,
      fecha_nacimiento,
      sexo,
      telefono,
      direccion,
      tipo_paciente,
    } = req.body;

    const requeridos = { email, password, numero_identificacion, nombres, apellidos, fecha_nacimiento, sexo, tipo_paciente };
    for (const [campo, valor] of Object.entries(requeridos)) {
      if (!valor) return res.status(400).json({ message: `${campo} is required` });
    }
    if (!["M", "F"].includes(sexo)) {
      return res.status(400).json({ message: "sexo must be M or F" });
    }
    if (!["estudiante", "docente", "administrativo"].includes(tipo_paciente)) {
      return res
        .status(400)
        .json({ message: "tipo_paciente must be estudiante, docente or administrativo" });
    }

    const existente = await UsuarioModel.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ message: "ya existe un usuario con ese email" });
    }

    const paciente = await PacienteModel.create({
      numero_identificacion,
      nombres,
      apellidos,
      fecha_nacimiento,
      sexo,
      correo_electronico: email,
      telefono,
      direccion,
      tipo_paciente,
    });

    const hash = await bcrypt.hash(password, 10);
    const usuario = await UsuarioModel.create({
      nombre: `${nombres} ${apellidos}`,
      email,
      password: hash,
      rol: "paciente",
      paciente_id: paciente.id,
    });

    res.status(201).json({
      message: "create",
      usuario: usuario.get({ plain: true, attributes: ATRIBUTOS_PUBLICOS }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const perfil = async (req, res) => {
  try {
    const usuario = await UsuarioModel.findByPk(req.user.id, {
      attributes: ATRIBUTOS_PUBLICOS,
    });
    if (!usuario) {
      return res.status(404).json({ message: "usuario not found" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
