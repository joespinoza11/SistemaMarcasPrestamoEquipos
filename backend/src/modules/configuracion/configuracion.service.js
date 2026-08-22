import {
  listarConfiguracion,
  buscarConfiguracionPorClave,
  actualizarConfiguracion as actualizarConfiguracionDB,
} from "./configuracion.model.js";

// OBTENER TODA LA CONFIGURACIÓN
export async function obtenerConfiguracion() {
  return await listarConfiguracion();
}

// ACTUALIZAR UNO O VARIOS PARÁMETROS
export async function actualizarParametros(cambios) {
  if (!cambios || typeof cambios !== "object" || Array.isArray(cambios)) {
    throw new Error("Debe enviar un objeto con los parámetros a actualizar.");
  }

  const claves = Object.keys(cambios);

  if (claves.length === 0) {
    throw new Error("Debe enviar al menos un parámetro para actualizar.");
  }

  const resultados = [];

  for (const clave of claves) {
    const valor = cambios[clave];

    if (valor === undefined || valor === null || String(valor).trim() === "") {
      throw new Error(`El valor para "${clave}" no puede estar vacío.`);
    }

    const existente = await buscarConfiguracionPorClave(clave);

    if (!existente) {
      throw new Error(`El parámetro "${clave}" no existe.`);
    }

    await actualizarConfiguracionDB(clave, String(valor));

    resultados.push({ clave, valor: String(valor) });
  }

  return resultados;
}
