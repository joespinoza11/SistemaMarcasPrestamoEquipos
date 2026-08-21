export function verificarSesion(req, res, next) {

    if(!req.session.usuario){

        return res.status(401).json({
            error: "Se de iniciar sesión"
        });
    }

    next();
}