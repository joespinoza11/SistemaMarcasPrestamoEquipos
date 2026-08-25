import { apiFetch } from "./api.js";

export function listarEquipos() {
  return apiFetch("/equipos", { method: "GET" });
}

export function obtenerEquipo(id) {
  return apiFetch(`/equipos/${id}`, { method: "GET" });
}

export function crearEquipo(formData) {
  return apiFetch("/equipos", { method: "POST", formData });
}

export function actualizarEquipo(id, formData) {
  return apiFetch(`/equipos/${id}`, { method: "PUT", formData });
}

export function cambiarEstadoEquipo(id, estado) {
  return apiFetch(`/equipos/${id}/estado`, {
    method: "PUT",
    body: { estado },
  });
}

export function eliminarEquipo(id) {
  return apiFetch(`/equipos/${id}`, { method: "DELETE" });
}