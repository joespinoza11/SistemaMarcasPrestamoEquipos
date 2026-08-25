import { apiFetch } from "./api.js";


const BASE = "/usuarios/dispositivos";

// LISTAR DISPOSITIVOS DEL USUARIO EN SESIÓN
export function listarDispositivos() {
  return apiFetch(BASE, { method: "GET" });
}

// REGISTRAR UN DISPOSITIVO NUEVO
export function crearDispositivo(datos) {
  return apiFetch(BASE, {
    method: "POST",
    body: {
      nombre: datos.nombre,
      descripcion: datos.descripcion || undefined,
    },
  });
}

// ACTUALIZAR DISPOSITIVO 
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

// ELIMINAR DISPOSITIVO 
export function eliminarDispositivo(id) {
  return apiFetch(`${BASE}/${id}`, { method: "DELETE" });
}
