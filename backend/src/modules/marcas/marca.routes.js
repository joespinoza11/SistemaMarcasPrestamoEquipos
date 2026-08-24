import { Router } from "express";

import {
  registrar,
  listar,
  reporte,
  exportarJson,
  exportarXml,
  exportarPdf,
  obtener,
} from "./marca.controller.js";

import { verificarSesion } from "../../middlewares/auth.middleware.js";
import { verificarAdministrador } from "../../middlewares/role.middleware.js";

const router = Router();

router.post("/", verificarSesion, registrar);
router.get("/", verificarSesion, listar);

router.get("/reporte", verificarAdministrador, reporte);
router.get("/reporte/exportar/json", verificarAdministrador, exportarJson);
router.get("/reporte/exportar/xml", verificarAdministrador, exportarXml);
router.get("/reporte/exportar/pdf", verificarAdministrador, exportarPdf);

router.get("/:id", verificarSesion, obtener);

export default router;