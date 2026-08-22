import { Router } from "express";

import { listar, actualizar } from "./configuracion.controller.js";

import { verificarAdministrador } from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/", verificarAdministrador, listar);
router.put("/", verificarAdministrador, actualizar);

export default router;