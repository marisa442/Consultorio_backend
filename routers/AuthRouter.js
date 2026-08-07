import express from "express";
import { login, register, registroPaciente, perfil } from "../controller/AuthController.js";
import { verifyToken, verifyRol } from "../middleware/auth.js";

const router = express.Router();

router.post("/auth/login", login);
router.post("/auth/registro-paciente", registroPaciente);
router.post("/auth/register", verifyToken, verifyRol("administrador"), register);
router.get("/auth/perfil", verifyToken, perfil);

export default router;
