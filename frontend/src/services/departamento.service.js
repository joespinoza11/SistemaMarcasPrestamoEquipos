import { apiFetch } from "./api.js";

// LISTAR DEPARTAMENTOS (pública: la usa también /registro sin sesión)
export function listarDepartamentos() {
  return apiFetch("/departamentos", { method: "GET" });
}

// OBTENER DEPARTAMENTO POR ID
export function obtenerDepartamento(id) {
  return apiFetch(`/departamentos/${id}`, { method: "GET" });
}

// CREAR DEPARTAMENTO (administración)
export function crearDepartamento(datos) {
  return apiFetch("/departamentos", {
    method: "POST",
    body: {
      nombre: datos.nombre,
      descripcion: datos.descripcion || undefined,
      encargado: datos.encargado || undefined,
    },
  });
}

// ACTUALIZAR DEPARTAMENTO (administración)
export function actualizarDepartamento(id, datos) {
  return apiFetch(`/departamentos/${id}`, {
    method: "PUT",
    body: {
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      encargado: datos.encargado,
    },
  });
}

// ELIMINAR DEPARTAMENTO (administración)
export function eliminarDepartamento(id) {
  return apiFetch(`/departamentos/${id}`, { method: "DELETE" });
}
