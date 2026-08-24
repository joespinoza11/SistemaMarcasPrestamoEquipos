import {
    registrarUsuario,
    autenticarUsuario,
    solicitarRecuperacion,
    restablecerContrasena
} from "./auth.service.js";

export async function registrar(req, res) {

    try {

        const usuario =
            await registrarUsuario(
                req.body
            );


        return res.status(201).json({

            mensaje:"Usuario registrado correctamente.", usuario
        });

    } catch (error) {

        console.error(error);


        return res.status(error.estado || 500).json({
            error:
             error.estado? 
             error.message: "Error interno del servidor."
            });
    }
}

export async function login(req, res) {

    try {

        const usuario = await autenticarUsuario(req.body);

        req.session.usuario = {
            id:usuario.id,
            rol:usuario.rol
        };


        return res.status(200).json({
            
            mensaje:"Inicio de sesión correcto.", usuario
        });

    } catch (error) {

        console.error(error);


        return res.status(error.estado || 500)
            .json({
                error:
                error.estado? 
                error.message: "Error interno del servidor."
            });
    }
}

export function logout(req, res) {

    req.session.destroy(
        (error) => {

            if (error) {

                console.error(error);

                return res.status(500).json({
                    
                    error:"Error interno del servidor."

                    });
            }

            res.clearCookie("connect.sid");


            return res.status(200)
                .json({
                    
                 mensaje:"Sesión cerrada correctamente."

                });
        }
    );
}

export function session(req, res) {

    return res.status(200)
        .json({
            
            usuario:
            req.session.usuario
        });
}

export async function recuperarContrasena(req, res) {

    try {

        const {usuario} = req.body;

        const resultado =await solicitarRecuperacion(usuario);

        return res.status(200).json(
                resultado
            );

    } catch (error) {

        console.error(error);


        return res.status(error.estado || 500).json({
            error:
            error.estado? 
            error.message: "Error interno del servidor."
            });
    }
}

export async function restablecerContrasenaUsuario(req, res) {

    try {
        
        const resultado = await restablecerContrasena(req.body);
        
        return res.status(200).json(

                resultado

            );

    } catch (error) {

        console.error(error);


        return res.status(error.estado || 500).json({
            
            error:
            error.estado? 
            error.message: "Error interno del servidor."
            });
    }
}