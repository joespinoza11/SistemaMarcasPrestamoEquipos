import { apiFetch } from "./api.js";

export function crearPrestamo(usuarioId, equipos) {
  return apiFetch("/prestamos", {
    method: "POST",
    body: { usuarioId, equipos },
  });
}

export function listarPrestamos(filtros = {}) {
  const params = new URLSearchParams();

  if (filtros.usuario) params.append("usuario", filtros.usuario);
  if (filtros.fecha) params.append("fecha", filtros.fecha);
  if (filtros.estado) params.append("estado", filtros.estado);
  if (filtros.equipo) params.append("equipo", filtros.equipo);

  const query = params.toString();

  return apiFetch(`/prestamos${query ? `?${query}` : ""}`, { method: "GET" });
}

export function obtenerPrestamo(id) {
  return apiFetch(`/prestamos/${id}`, { method: "GET" });
}

export function devolverEquipo(prestamoId, equipoId) {
  return apiFetch(`/prestamos/${prestamoId}/devolver/${equipoId}`, {
    method: "PUT",
  });
}

export function devolverPrestamoCompleto(prestamoId) {
  return apiFetch(`/prestamos/${prestamoId}/devolver`, { method: "PUT" });
}
