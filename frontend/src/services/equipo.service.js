import { apiFetch } from "./api.js";

// Versión mínima, solo lectura, necesaria para el selector de equipos
// del módulo de Préstamos. Persona 4 la completa con crear/actualizar/
// eliminar/imagen cuando desarrolle su propio módulo (Inventario).
export function listarEquipos() {
  return apiFetch("/equipos", { method: "GET" });
}
