import {
  obtenerConfiguracion,
  actualizarParametros,
} from "./configuracion.service.js";

// LISTAR CONFIGURACIÓN
export async function listar(req, res) {
  try {
    const configuracion = await obtenerConfiguracion();

    return res.status(200).json({ configuracion });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "No se pudo obtener la configuración.",
    });
  }
}

// ACTUALIZAR CONFIGURACIÓN
export async function actualizar(req, res) {
  try {
    const actualizados = await actualizarParametros(req.body);

    return res.status(200).json({
      mensaje: "Configuración actualizada correctamente.",
      actualizados,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({ error: error.message });
  }
}
