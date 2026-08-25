import { apiFetch } from "./api.js";

export function obtenerConfiguracion() {
  return apiFetch("/configuracion", { method: "GET" });
}

export function actualizarConfiguracion(cambios) {
  return apiFetch("/configuracion", { method: "PUT", body: cambios });
}