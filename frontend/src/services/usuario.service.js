import { apiFetch } from "./api.js";

// OBTENER PERFIL PROPIO
export function obtenerPerfil() {
  return apiFetch("/usuarios/perfil", { method: "GET" });
}

// ACTUALIZAR PERFIL PROPIO
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

// LISTAR USUARIOS 
export function listarUsuarios() {
  return apiFetch("/usuarios", { method: "GET" });
}

// OBTENER USUARIO POR ID 
export function obtenerUsuario(id) {
  return apiFetch(`/usuarios/${id}`, { method: "GET" });
}
