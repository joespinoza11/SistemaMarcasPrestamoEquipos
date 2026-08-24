import { apiFetch } from "./api.js";

// LISTAR DISPOSITIVOS DEL USUARIO EN SESIÓN
export function listarDispositivos() {
  return apiFetch("/dispositivos", { method: "GET" });
}

// REGISTRAR UN DISPOSITIVO NUEVO
// No se envía identificadorUnico: el backend lo genera automáticamente
// (crypto.randomUUID()) cuando no viene del cliente.
export function crearDispositivo(datos) {
  return apiFetch("/dispositivos", {
    method: "POST",
    body: {
      nombre: datos.nombre,
      descripcion: datos.descripcion || undefined,
    },
  });
}

// ACTUALIZAR DISPOSITIVO (nombre, descripción y/o estado)
export function actualizarDispositivo(id, datos) {
  return apiFetch(`/dispositivos/${id}`, {
    method: "PUT",
    body: {
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      estado: datos.estado,
    },
  });
}

// ELIMINAR DISPOSITIVO (el backend lo desactiva, no lo borra físicamente)
export function eliminarDispositivo(id) {
  return apiFetch(`/dispositivos/${id}`, { method: "DELETE" });
}
