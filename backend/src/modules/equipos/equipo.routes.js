import { Router } from "express";

import {
  listar,
  obtener,
  crear,
  actualizar,
  cambiarEstado,
  eliminar,
} from "./equipo.controller.js";

import { verificarSesion } from "../../middlewares/auth.middleware.js";
import { verificarAdministrador } from "../../middlewares/role.middleware.js";
import { subirImagenEquipo } from "../../middlewares/upload.middleware.js";

const router = Router();

router.get("/", verificarSesion, listar);
router.get("/:id", verificarSesion, obtener);
router.post("/", verificarAdministrador, subirImagenEquipo, crear);
router.put("/:id", verificarAdministrador, subirImagenEquipo, actualizar);
router.put("/:id/estado", verificarAdministrador, cambiarEstado);
router.delete("/:id", verificarAdministrador, eliminar);

export default router;