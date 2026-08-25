export function formatearFecha(fecha) {
  if (!fecha) return "—";

  const soloFecha = String(fecha).slice(0, 10);
  const [anio, mes, dia] = soloFecha.split("-");

  if (!anio || !mes || !dia) return "—";

  return `${dia}/${mes}/${anio}`;
}

export function formatearFechaHora(fechaHora) {
  if (!fechaHora) return "—";

  const [parteFecha, parteHora] = String(fechaHora).split(" ");
  const fecha = formatearFecha(parteFecha);

  if (!parteHora) return fecha;

  const [horaStr, minutoStr] = parteHora.split(":");
  const hora = Number(horaStr);
  const periodo = hora >= 12 ? "p. m." : "a. m.";
  const hora12 = hora % 12 === 0 ? 12 : hora % 12;

  return `${fecha} ${String(hora12).padStart(2, "0")}:${minutoStr} ${periodo}`;
}
