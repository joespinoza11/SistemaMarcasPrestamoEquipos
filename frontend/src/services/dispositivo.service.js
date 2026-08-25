import { apiFetch } from "./api.js";

// El backend monta este router bajo /api/usuarios/dispositivos
// (ver app.js: app.use("/api/usuarios/dispositivos", dispositivoRoutes)),
// no bajo /api/dispositivos. Ojo si el backend cambia este mount path.
const BASE = "/usuarios/dispositivos";

// LISTAR DISPOSITIVOS DEL USUARIO EN SESIÓN
export function listarDispositivos() {
  return apiFetch(BASE, { method: "GET" });
}

// REGISTRAR UN DISPOSITIVO NUEVO
// No se envía identificadorUnico: el backend lo genera automáticamente
// (crypto.randomUUID()) cuando no viene del cliente.
export function crearDispositivo(datos) {
  return apiFetch(BASE, {
    method: "POST",
    body: {
      nombre: datos.nombre,
      descripcion: datos.descripcion || undefined,
    },
  });
}

// ACTUALIZAR DISPOSITIVO (nombre, descripción y/o estado)
export function actualizarDispositivo(id, datos) {
  return apiFetch(`${BASE}/${id}`, {
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
  return apiFetch(`${BASE}/${id}`, { method: "DELETE" });
}
