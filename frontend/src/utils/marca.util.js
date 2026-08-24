export const CLAVE_DISPOSITIVO = "identificadorDispositivo";

export function obtenerIdentificadorDispositivo() {
  return localStorage.getItem(CLAVE_DISPOSITIVO);
}

export function guardarIdentificadorDispositivo(identificador) {
  localStorage.setItem(CLAVE_DISPOSITIVO, identificador);
}

export function descargarArchivo(blob, nombre) {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");

  enlace.href = url;
  enlace.download = nombre;

  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);

  URL.revokeObjectURL(url);
}

export function nombreReporte(formato) {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");

  return `reporte-marcas-${anio}${mes}${dia}.${formato}`;
}
