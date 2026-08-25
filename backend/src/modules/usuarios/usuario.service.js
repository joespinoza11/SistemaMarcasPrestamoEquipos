import bcrypt from "bcrypt";

import {
  buscarPerfilPorId,
  buscarUsuarioConPasswordPorId,
  buscarDepartamentoPorId,
  actualizarPerfil as actualizarPerfilDB,
  actualizarPassword as actualizarPasswordDB,
  listarUsuarios as listarUsuariosDB,
} from "./usuario.model.js";

const REGEX_CONTRASENA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// OBTENER PERFIL PROPIO
export async function obtenerPerfil(usuarioId) {
  const perfil = await buscarPerfilPorId(usuarioId);

  if (!perfil) {
    throw new Error("El usuario no existe.");
  }

  return perfil;
}

// ACTUALIZAR PERFIL PROPIO
export async function actualizarPerfil(usuarioId, datos) {
  const { nombreCompleto, fechaNacimiento, departamentoId } = datos;

  const perfilActual = await buscarPerfilPorId(usuarioId);

  if (!perfilActual) {
    throw new Error("El usuario no existe.");
  }

  if (!nombreCompleto || nombreCompleto.trim() === "") {
    throw new Error("El nombre completo es obligatorio.");
  }

  if (!fechaNacimiento) {
    throw new Error("La fecha de nacimiento es obligatoria.");
  }

  const fecha = new Date(fechaNacimiento);

  if (isNaN(fecha.getTime())) {
    throw new Error("La fecha de nacimiento no es válida.");
  }

  if (!departamentoId) {
    throw new Error("El departamento o carrera es obligatorio.");
  }

  const departamento = await buscarDepartamentoPorId(departamentoId);

  if (!departamento) {
    throw new Error("El departamento no existe.");
  }

  await actualizarPerfilDB(
    usuarioId,
    nombreCompleto.trim(),
    fechaNacimiento,
    departamentoId,
  );

  return await buscarPerfilPorId(usuarioId);
}

// CAMBIAR CONTRASEÑA PROPIA
export async function cambiarPassword(usuarioId, datos) {
  const { contrasenaActual, nuevaContrasena, confirmacion } = datos;

  if (!contrasenaActual) {
    throw new Error("Debe ingresar la contraseña actual.");
  }

  if (!nuevaContrasena || !REGEX_CONTRASENA.test(nuevaContrasena)) {
    throw new Error(
      "La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.",
    );
  }

  if (nuevaContrasena !== confirmacion) {
    throw new Error("Las contraseñas no coinciden.");
  }

  const usuario = await buscarUsuarioConPasswordPorId(usuarioId);

  if (!usuario) {
    throw new Error("El usuario no existe.");
  }

  const contrasenaCorrecta = await bcrypt.compare(
    contrasenaActual,
    usuario.password_hash,
  );

  if (!contrasenaCorrecta) {
    throw new Error("La contraseña actual es incorrecta.");
  }

  const mismaContrasena = await bcrypt.compare(
    nuevaContrasena,
    usuario.password_hash,
  );

  if (mismaContrasena) {
    throw new Error(
      "La nueva contraseña debe ser diferente a la contraseña actual.",
    );
  }

  const nuevoHash = await bcrypt.hash(nuevaContrasena, 10);

  await actualizarPasswordDB(usuarioId, nuevoHash);

  return { mensaje: "Contraseña actualizada correctamente." };
}

// LISTAR USUARIOS
export async function listarUsuarios() {
  return await listarUsuariosDB();
}

// OBTENER USUARIO POR ID
export async function obtenerUsuarioPorId(id) {
  const usuario = await buscarPerfilPorId(id);

  if (!usuario) {
    throw new Error("El usuario no existe.");
  }

  return usuario;
}
