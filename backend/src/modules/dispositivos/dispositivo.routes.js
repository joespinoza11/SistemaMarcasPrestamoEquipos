import { Router } from "express";

import {
  listar,
  crear,
  actualizar,
  eliminar,
} from "./dispositivo.controller.js";

import { verificarSesion } from "../../middlewares/auth.middleware.js";

const router = Router();


router.get("/", verificarSesion, listar);
router.post("/", verificarSesion, crear);
router.put("/:id", verificarSesion, actualizar);
router.delete("/:id", verificarSesion, eliminar);

export default router;
