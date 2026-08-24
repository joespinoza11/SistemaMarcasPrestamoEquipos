// Colores por defecto para TODOS los estados que existen en el sistema
// (equipos, préstamos, marcas). Un módulo puede pasar su propio mapa
// mediante la prop `colores` si necesita algo distinto.
const COLORES_POR_DEFECTO = {
  // Equipos
  DISPONIBLE: "success",
  PRESTADO: "warning",
  MANTENIMIENTO: "secondary",
  INACTIVO: "dark",

  // Préstamos
  ACTIVO: "primary",
  FINALIZADO: "success",

  // Detalle de préstamo
  PENDIENTE: "warning",
  DEVUELTO: "success",

  // Marcas
  ENTRADA: "info",
  SALIDA: "secondary",
};

export default function Badge({ estado, colores = {} }) {
  const mapa = { ...COLORES_POR_DEFECTO, ...colores };
  const color = mapa[estado?.toUpperCase()] || "secondary";

  return <span className={`badge text-bg-${color}`}>{estado}</span>;
}
