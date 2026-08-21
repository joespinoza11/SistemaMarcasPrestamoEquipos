import bcrypt from 'bcrypt';
import crypto from 'crypto';

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
    marcarTokenComoUsado,
} from './auth.constants.js';

import enviarCorreoRecuperacion from '../../services/mail.service.js';

export async function registrarUsuario(datos) {

    const {
        nombreCompleto,
        fechaNacimiento,
        correo,
        username,
        cotrasena,
        confirmacion,
        departamentoId
    } = datos;

    if (!nombreCompleto || nombreCompleto.trim() === "") {
        throw new Error("El nombre completo es obligatorio.");
    }


    if (!fechaNacimiento) {
        throw new Error(
            "La fecha de nacimiento es obligatoria."
        );
    }

    const fecha = new Date(fechaNacimiento);

    if (isNaN(fecha.getTime())) {
        throw new Error(
            "La fecha de nacimiento no es válida."
        );
    }


    const Regexcorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correo || !regexCorreo.test(correo)) {
        throw new Error("El correo electrónico no es válido.");
    }


    if (!username || username.trim() === "") {
        throw new Error("El nombre del usuario es obligatorio")
    }


    if (!departamentoId) {
        throw new Error("El departamento o carrera es obligatorio.");
    }


    const regexContrasena =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!contrasena || !regexContrasena.test(contrasena)) {
        throw new Error(
            "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número."
        );
    }


    if (contrasena !== confirmacion) {
        throw new Error("Las contraseñas no coinciden."); //NOTA MUCHACHOS: La parte acá es la confirmacíon de la contraseña
    }


    const departamento =
        await buscarDepartamentoPorId(departamentoId);

    if (!departamento) {
        throw new Error("El departamento no existe.");
    }


    const correoRegistrado =
        await buscarUsuarioPorCorreo(correo);

    if (correoRegistrado) {
        throw new Error("El correo ya se encuentra registrado.");
    }


    const usernameRegistrado =
        await buscarUsuarioPorUsername(username);

    if (usernameRegistrado) {
        throw new Error(
            "El nombre de usuario ya se encuentra registrado."
        );
    }


    const rol =
        await buscarRolUsuario();

    if (!rol) {
        throw new Error("No se encontró el rol de usuario.");
    }


    const contrasenaHash =
        await bcrypt.hash(contrasena, 10);


    const id = await crearUsuario(
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
        throw new Error(
            "Debe ingresar el usuario o correo."
        );
    }

    if (!contrasena) {
        throw new Error(
            "Debe ingresar la contraseña."
        );
    }

    const usuarioEncontrado =
        await buscarUsuarioLogin(usuario);


    if (!usuarioEncontrado) {
        throw new Error(
            "Usuario o contraseña incorrectos."
        );
    }

    //NOTA MUCHAHCOS: Acá es donde se compara la contraseña que el usuario ingresa con la que está en la base de datos, si no son iguales, tira error.
    const contrasenaCorrecta =
        await bcrypt.compare(
            contrasena,
            usuarioEncontrado.password_hash
        );


    if (!contrasenaCorrecta) {
        throw new Error(
            "Usuario o contraseña incorrectos."
        );
    }


    return {
        id: usuarioEncontrado.id,
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
        throw new Error("Debe de ingresar la contraseña o correo electrónico.");
    }

    const usuarioEncontado =
        await buscarUsarioRecuperacion(usuario)
    
    if  (!usuarioEncontado) {
        throw new Error("Usuario o correo electrónico no encontrado.");
    }

    const token =
    crypto.randomUUID();


  const fechaExpiracion =
    new Date(
      Date.now() + 30 * 60 * 1000
    );


  await guardarTokenRecuperacion(
    usuarioEncontrado.id,
    token,
    fechaExpiracion
  );


  await enviarCorreoRecuperacion(
    usuarioEncontrado.correo,
    token
  );


  return {
    mensaje:
      "Se envió el enlace de recuperación al correo registrado."
  };

}

export async function restablecercontrasena(datos) {

  const {
    token,
    nuevaContrasena,
    confirmacion
  } = datos;


 
  if (!token || token.trim() === "") {
    throw new Error(
      "El token es obligatorio."
    );
  }


  // Validar nueva contraseña
  const regexPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;


  if (!nuevaContrasena || !regexPassword.test(nuevaContrasena)) {
    throw new Error(
      "La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número."
    );
  }


  if (nuevaContrasena !== confirmacion) {
    throw new Error("Las contraseñas no coinciden.");
  }


  const tokenEncontrado =
    await buscarTokenRecuperacion(token);


  if (!tokenEncontrado) {
    throw new Error("El token no es válido, ya fue utilizado o expiró.");
  }

  const contrasenaHash =
    await bcrypt.hash(
      nuevaContrasena,
      10
    );


  await actualizarContrasena(
    tokenEncontrado.usuario_id,
    contrasenaHash
  );


  await marcarTokenComoUsado(
    tokenEncontrado.id
  );


  return {
    mensaje:
      "Contraseña restablecida correctamente."
  };
}
