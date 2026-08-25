import { apiFetch } from "./api.js";

// OBTENER PERFIL PROPIO
export function obtenerPerfil() {
  return apiFetch("/usuarios/perfil", { method: "GET" });
}

// ACTUALIZAR PERFIL PROPIO
// Solo nombre, fecha de nacimiento y departamento son editables
export function actualizarPerfil(datos) {
  return apiFetch("/usuarios/perfil", {
    method: "PUT",
    body: {
      nombreCompleto: datos.nombreCompleto,
      fechaNacimiento: datos.fechaNacimiento,
      departamentoId: datos.departamentoId,
    },
  });
}

// CAMBIAR CONTRASEÑA PROPIA
export function cambiarPassword(datos) {
  return apiFetch("/usuarios/cambiar-password", {
    method: "PUT",
    body: {
      contrasenaActual: datos.contrasenaActual,
      nuevaContrasena: datos.nuevaContrasena,
      confirmacion: datos.confirmacion,
    },
  });
}

// LISTAR USUARIOS (administración; requiere rol administrador)
// No se usa en ninguna pantalla todavía, pero el backend ya lo expone
// (GET /api/usuarios) y otros módulos (p. ej. Préstamos) lo necesitarán
// para reemplazar su selector manual de ID de usuario.
export function listarUsuarios() {
  return apiFetch("/usuarios", { method: "GET" });
}

// OBTENER USUARIO POR ID (administración; requiere rol administrador)
export function obtenerUsuario(id) {
  return apiFetch(`/usuarios/${id}`, { method: "GET" });
}
