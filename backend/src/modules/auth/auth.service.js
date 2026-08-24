import bcrypt from "bcrypt";
import crypto from "crypto";

import {
    buscarUsuarioPorCorreo,
    buscarUsuarioPorUsername,
    buscarDepartamentoPorId,
    buscarRolUsuario,
    crearUsuario,
    buscarUsuarioLogin,
    buscarUsuarioRecuperacion,
    tokenRecuperacion,
    buscarTokenRecuperacion,
    actualizarContrasena,
    marcarTokenComoUsado
} from "./auth.model.js";

import {enviarCorreoRecuperacion} from "../../services/mail.service.js";


function crearError(mensaje, estado) {

    const error = new Error(mensaje);

    error.estado = estado;

    return error;
}

export async function registrarUsuario(datos) {

    const {
        nombreCompleto,
        fechaNacimiento,
        correo,
        username,
        contrasena,
        confirmacion,
        departamentoId
    } = datos;

    if (!nombreCompleto || nombreCompleto.trim() === "") {

        throw crearError("El nombre completo es obligatorio.",400);
    }

    if (!fechaNacimiento) {

        throw crearError(
            "La fecha de nacimiento es obligatoria.",400);
    }


    const fecha =
        new Date(fechaNacimiento);


    if (isNaN(fecha.getTime())) {

        throw crearError("La fecha de nacimiento no es válida.",400);
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!correo || !regexCorreo.test(correo)) {

        throw crearError("El correo electrónico no es válido.",400);
    }

    if (!username || username.trim() === "") {

        throw crearError("El nombre de usuario es obligatorio.",400);
    }

    if (!departamentoId) {

        throw crearError("El departamento o carrera es obligatorio.",400);
    }

    const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;


    if (!contrasena || !regexContrasena.test(contrasena)) {

        throw crearError(
            "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.",400);
    }

    if (contrasena !== confirmacion) {

        throw crearError("Las contraseñas no coinciden.",400);
    }


    const departamento = await buscarDepartamentoPorId(departamentoId);

    if (!departamento) {

        throw crearError(
            "El departamento no existe.", 404);
    }


    const correoRegistrado = await buscarUsuarioPorCorreo(correo);


    if (correoRegistrado) {

        throw crearError("El correo ya se encuentra registrado.",409);
    }

    const usernameRegistrado = await buscarUsuarioPorUsername(username);


    if (usernameRegistrado) {

        throw crearError("El nombre de usuario ya se encuentra registrado.",409);
    }

    const rol = await buscarRolUsuario();


    if (!rol) {

        throw crearError("No se encontró el rol de usuario.",500);
    }

    const contrasenaHash = await bcrypt.hash(contrasena,10);

    const id =
        await crearUsuario(
            nombreCompleto,
            fechaNacimiento,
            correo,
            username,
            contrasenaHash,
            departamentoId,
            rol.id
        );


    return {
        id,
        nombreCompleto,
        correo,
        username
    };
}

export async function autenticarUsuario(datos) {

    const {
        usuario,
        contrasena
    } = datos;


    if (!usuario || usuario.trim() === "") {

        throw crearError("Debe ingresar el usuario o correo.",400);
    }

    if (!contrasena) {

        throw crearError("Debe ingresar la contraseña.",400);
    }

    const usuarioEncontrado =await buscarUsuarioLogin(usuario);


    if (!usuarioEncontrado) {

        throw crearError(
            "Usuario o contraseña incorrectos.",401);
    }

    const contrasenaCorrecta = await bcrypt.compare(contrasena,usuarioEncontrado.password_hash);


    if (!contrasenaCorrecta) {

        throw crearError(
            "Usuario o contraseña incorrectos.",
            401
        );
    }


    return {
        id:
            usuarioEncontrado.id,

        nombreCompleto:
            usuarioEncontrado.nombre_completo,

        correo:
            usuarioEncontrado.correo,

        username:
            usuarioEncontrado.username,

        rol:
            usuarioEncontrado.rol
    };
}

export async function solicitarRecuperacion(usuario) {

    if (!usuario || usuario.trim() === "") {

        throw crearError(
            "Debe ingresar el usuario o correo electrónico.", 400);
    }

    const usuarioEncontrado = await buscarUsuarioRecuperacion(usuario);


    if (!usuarioEncontrado) {

        throw crearError("Usuario o correo electrónico no encontrado.",404);
    }

    const token = crypto.randomUUID();

    const fechaExpiracion =
        new Date(
            Date.now() + 30 * 60 * 1000
        );

    await tokenRecuperacion(
        usuarioEncontrado.id,
        token,
        fechaExpiracion
    );


    await enviarCorreoRecuperacion(usuarioEncontrado.correo,token);

    return {
        mensaje:"Se envió el enlace de recuperación al correo registrado."
    };
}


export async function restablecerContrasena(datos) {

    const {
        token,
        nuevaContrasena,
        confirmacion
    } = datos;

    if (!token || token.trim() === "") {

        throw crearError("El token es obligatorio.",400);
    }

    const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;


    if (!nuevaContrasena || !regexContrasena.test(nuevaContrasena)) {

        throw crearError(
            "La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.",400);
    }


    if (nuevaContrasena !== confirmacion) {

        throw crearError(
            "Las contraseñas no coinciden.",400);
    }

    const tokenEncontrado =await buscarTokenRecuperacion(token);


    if (!tokenEncontrado) {

        throw crearError("El token no es válido, ya fue utilizado o expiró.",400);
    }

    const contrasenaHash = await bcrypt.hash(nuevaContrasena,10);

    await actualizarContrasena(
        tokenEncontrado.usuario_id,
        contrasenaHash
    );

    await marcarTokenComoUsado(
        tokenEncontrado.id
    );


    return {
        mensaje:"Contraseña restablecida correctamente."
    };
}