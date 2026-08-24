import { apiFetch, apiFetchArchivo } from "./api.js";

function construirQuery(filtros = {}) {
  const params = new URLSearchParams();

  if (filtros.usuario) params.append("usuario", filtros.usuario);
  if (filtros.departamento) params.append("departamento", filtros.departamento);
  if (filtros.anio) params.append("anio", filtros.anio);
  if (filtros.mes) params.append("mes", filtros.mes);
  if (filtros.dia) params.append("dia", filtros.dia);

  const query = params.toString();

  return query ? `?${query}` : "";
}

export function registrarMarca(dispositivo) {
  return apiFetch("/marcas", {
    method: "POST",
    body: { dispositivo },
  });
}

export function listarMarcas(filtros = {}) {
  return apiFetch(`/marcas${construirQuery(filtros)}`, { method: "GET" });
}

export function obtenerMarca(id) {
  return apiFetch(`/marcas/${id}`, { method: "GET" });
}

export function obtenerReporte(filtros = {}) {
  return apiFetch(`/marcas/reporte${construirQuery(filtros)}`, { method: "GET" });
}

export function exportarReporte(formato, filtros = {}) {
  return apiFetchArchivo(
    `/marcas/reporte/exportar/${formato}${construirQuery(filtros)}`,
  );
}
