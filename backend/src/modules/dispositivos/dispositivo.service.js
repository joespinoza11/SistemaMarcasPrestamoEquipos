import crypto from "crypto";

import {
  listarDispositivosPorUsuario as listarDispositivosPorUsuarioDB,
  buscarDispositivoPorId,
  buscarDispositivoPorIdentificador,
  crearDispositivo as crearDispositivoDB,
  actualizarDispositivo as actualizarDispositivoDB,
  eliminarDispositivo as eliminarDispositivoDB,
} from "./dispositivo.model.js";

const ESTADOS_VALIDOS = ["ACTIVO", "INACTIVO"];

// LISTAR DISPOSITIVOS DEL USUARIO EN SESIÓN
export async function listarDispositivos(usuarioId) {
  return await listarDispositivosPorUsuarioDB(usuarioId);
}

// VERIFICAR QUE EL DISPOSITIVO EXISTA Y PERTENEZCA AL USUARIO
async function obtenerDispositivoDelUsuario(id, usuarioId) {
  const dispositivo = await buscarDispositivoPorId(id);

  if (!dispositivo) {
    throw new Error("El dispositivo no existe.");
  }

  if (dispositivo.usuario_id !== Number(usuarioId)) {
    throw new Error("El dispositivo no le pertenece.");
  }

  return dispositivo;
}

// CREAR DISPOSITIVO
export async function crearDispositivo(usuarioId, datos) {
  const nombre = datos?.nombre?.trim();

  if (!nombre || nombre === "") {
    throw new Error("El nombre o alias del dispositivo es obligatorio.");
  }

  if (nombre.length > 100) {
    throw new Error(
      "El nombre del dispositivo no puede superar los 100 caracteres.",
    );
  }

  const descripcion = datos?.descripcion?.trim() || null;

 
  let identificadorUnico = datos?.identificadorUnico?.trim();

  if (!identificadorUnico || identificadorUnico === "") {
    identificadorUnico = crypto.randomUUID();
  } else {
    const existente = await buscarDispositivoPorIdentificador(identificadorUnico);

    if (existente) {
      throw new Error(
        "Ya existe un dispositivo registrado con ese identificador.",
      );
    }
  }

  const id = await crearDispositivoDB(
    usuarioId,
    identificadorUnico,
    nombre,
    descripcion,
  );

  return {
    id,
    identificadorUnico,
    nombre,
    descripcion,
    estado: "ACTIVO",
  };
}

// ACTUALIZAR DISPOSITIVO 
export async function actualizarDispositivo(id, usuarioId, datos) {
  const dispositivo = await obtenerDispositivoDelUsuario(id, usuarioId);

  const nombre = datos?.nombre?.trim() ?? dispositivo.nombre;

  if (nombre === "") {
    throw new Error("El nombre o alias del dispositivo es obligatorio.");
  }

  const descripcion =
    datos?.descripcion !== undefined
      ? datos.descripcion?.trim() || null
      : dispositivo.descripcion;

  const estado = datos?.estado ?? dispositivo.estado;

  if (!ESTADOS_VALIDOS.includes(estado)) {
    throw new Error("El estado debe ser ACTIVO o INACTIVO.");
  }

  await actualizarDispositivoDB(id, nombre, descripcion, estado);

  return { id: Number(id), nombre, descripcion, estado };
}

// ELIMINAR DISPOSITIVO 
export async function eliminarDispositivo(id, usuarioId) {
  await obtenerDispositivoDelUsuario(id, usuarioId);

  await eliminarDispositivoDB(id);

  return { mensaje: "Dispositivo desactivado correctamente." };
}
