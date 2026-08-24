import { apiFetch } from "./api.js";

export function registrarUsuario(datos) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: {
      nombreCompleto: datos.nombreCompleto,
      fechaNacimiento: datos.fechaNacimiento,
      correo: datos.correo,
      username: datos.username,
      contrasena: datos.contrasena,
      confirmacion: datos.confirmacion,
      departamentoId: datos.departamentoId,
    },
  });
}

export function iniciarSesion({ usuario, contrasena }) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: { usuario, contrasena },
  });
}

export function cerrarSesion() {
  return apiFetch("/auth/logout", { method: "POST" });
}

export function obtenerSesion() {
  return apiFetch("/auth/session", { method: "GET" });
}

export function solicitarRecuperacion(usuario) {
  return apiFetch("/auth/recuperar-contrasena", {
    method: "POST",
    body: { usuario },
  });
}

export function restablecerContrasena({ token, nuevaContrasena, confirmacion }) {
  return apiFetch("/auth/restablecer-contrasena", {
    method: "POST",
    body: { token, nuevaContrasena, confirmacion },
  });
}
