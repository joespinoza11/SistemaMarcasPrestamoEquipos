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

// Públicas: el formulario de registro (auth) necesita listar los
// departamentos ANTES de que exista una sesión.
router.get("/", listar);
router.get("/:id", obtener);

// Administración: solo un administrador puede modificar el catálogo.
router.post("/", verificarAdministrador, crear);
router.put("/:id", verificarAdministrador, actualizar);
router.delete("/:id", verificarAdministrador, eliminar);

export default router;
