export function verificarAdministrador(req, res, next) {

  if(!req.session.usuario) {

    return res.status(401).json({
      error:
        "Debe iniciar sesión."
    });
  }

  if(req.session.usuario.rol !== "administrador") {

    return res.status(403).json({
      error:
        "No tiene los permisos."
    });
  }
  next();
}