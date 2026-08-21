import { Router } from "express";

import {
  registrar,
  login,
  logout,
  session,
  recuperarContrasena,
  restablecerContrasena
} from "./auth.controller.js";

import {
  verificarSesion
} from "../../middlewares/auth.middleware.js";


const router = Router();


router.post("/register", registrar);
router.post("/login",login);
router.post("/logout",verificarSesion,logout);
router.get("/session",verificarSesion,session);
router.post("/recuperar-contrasena", recuperarContrasena);
router.post("/restablecer-contrasena",restablecerContrasena);


export default router;