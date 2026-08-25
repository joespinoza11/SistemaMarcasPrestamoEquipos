import { Router } from "express";

import {
  perfil,
  actualizarPerfilPropio,
  cambiarPasswordPropia,
  listar,
  obtener,
} from "./usuario.controller.js";

import { verificarSesion } from "../../middlewares/auth.middleware.js";
import { verificarAdministrador } from "../../middlewares/role.middleware.js";

const router = Router();

// Rutas específicas primero
router.get("/perfil", verificarSesion, perfil);
router.put("/perfil", verificarSesion, actualizarPerfilPropio);
router.put("/cambiar-password", verificarSesion, cambiarPasswordPropia);

// Administración
router.get("/", verificarAdministrador, listar);
router.get("/:id", verificarAdministrador, obtener);

export default router;
