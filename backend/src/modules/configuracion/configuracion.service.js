import {
  listarConfiguracion,
  buscarConfiguracionPorClave,
  actualizarConfiguracion as actualizarConfiguracionDB,
} from "./configuracion.model.js";

const CLAVES_NUMERICAS = ["tiempo_max_sesion_min", "tamano_max_archivo_mb"];

const NOMBRES_LEGIBLES = {
  nombre_institucion: "el nombre de la institución",
  rango_ip_permitido: "el rango de IP permitido",
  tiempo_max_sesion_min: "el tiempo máximo de sesión",
  tamano_max_archivo_mb: "el tamaño máximo de archivo",
};

function nombreLegible(clave) {
  return NOMBRES_LEGIBLES[clave] || `el parámetro "${clave}"`;
}

function crearError(mensaje, status) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

// OBTENER TODA LA CONFIGURACIÓN
export async function obtenerConfiguracion() {
  return await listarConfiguracion();
}

// ACTUALIZAR UNO O VARIOS PARÁMETROS
export async function actualizarParametros(cambios) {
  if (!cambios || typeof cambios !== "object" || Array.isArray(cambios)) {
    throw crearError(
      "Debe enviar un objeto con los parámetros a actualizar.",
      400,
    );
  }

  const claves = Object.keys(cambios);

  if (claves.length === 0) {
    throw crearError("Debe enviar al menos un parámetro para actualizar.", 400);
  }

  const resultados = [];

  for (const clave of claves) {
    const valor = cambios[clave];

    if (valor === undefined || valor === null || String(valor).trim() === "") {
      throw crearError(
        `El valor para ${nombreLegible(clave)} no puede estar vacío.`,
        400,
      );
    }

    if (CLAVES_NUMERICAS.includes(clave)) {
      const numero = Number(valor);

      if (isNaN(numero) || numero <= 0) {
        throw crearError(
          `El valor para ${nombreLegible(clave)} debe ser un número mayor a 0.`,
          400,
        );
      }
    }

    const existente = await buscarConfiguracionPorClave(clave);

      if (!existente) {
      throw crearError(`No existe ${nombreLegible(clave)}.`, 404);
    }

    await actualizarConfiguracionDB(clave, String(valor));

    resultados.push({ clave, valor: String(valor) });
  }

  return resultados;
}
