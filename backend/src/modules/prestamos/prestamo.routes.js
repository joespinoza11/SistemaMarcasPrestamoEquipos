import { Router } from "express";

import { crear, listar, obtener, devolverUnoIndividual, devolverCompleto,} from "./prestamo.controller.js";

import { verificarAdministrador } from "../../middlewares/role.middleware.js";

const router = Router();

router.post("/", verificarAdministrador, crear);
router.get("/", verificarAdministrador, listar);
router.get("/:id", verificarAdministrador, obtener);
router.put("/:prestamoId/devolver/:equipoId", verificarAdministrador, devolverUnoIndividual);
router.put("/:prestamoId/devolver", verificarAdministrador, devolverCompleto);

export default router;