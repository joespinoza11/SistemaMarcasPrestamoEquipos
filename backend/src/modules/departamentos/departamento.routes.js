import { Router } from "express";

import {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
} from "./departamento.controller.js";

import { verificarAdministrador } from "../../middlewares/role.middleware.js";

const router = Router();

// Públicas
router.get("/", listar);
router.get("/:id", obtener);

// Administración
router.post("/", verificarAdministrador, crear);
router.put("/:id", verificarAdministrador, actualizar);
router.delete("/:id", verificarAdministrador, eliminar);

export default router;
