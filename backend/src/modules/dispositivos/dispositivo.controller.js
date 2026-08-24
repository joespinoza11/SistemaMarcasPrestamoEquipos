import {
  listarDispositivos,
  crearDispositivo,
  actualizarDispositivo,
  eliminarDispositivo,
} from "./dispositivo.service.js";

// LISTAR DISPOSITIVOS DEL USUARIO EN SESIÓN
export async function listar(req, res) {
  try {
    const dispositivos = await listarDispositivos(req.session.usuario.id);

    return res.status(200).json({ dispositivos });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "No se pudo obtener la lista de dispositivos.",
    });
  }
}

// CREAR DISPOSITIVO
export async function crear(req, res) {
  try {
    const dispositivo = await crearDispositivo(
      req.session.usuario.id,
      req.body,
    );

    return res.status(201).json({
      mensaje: "Dispositivo registrado correctamente.",
      dispositivo,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({ error: error.message });
  }
}

// ACTUALIZAR DISPOSITIVO
export async function actualizar(req, res) {
  try {
    const dispositivo = await actualizarDispositivo(
      req.params.id,
      req.session.usuario.id,
      req.body,
    );

    return res.status(200).json({
      mensaje: "Dispositivo actualizado correctamente.",
      dispositivo,
    });
  } catch (error) {
    console.error(error);

    const status = error.message === "El dispositivo no existe." ? 404 : 400;

    return res.status(status).json({ error: error.message });
  }
}

// ELIMINAR DISPOSITIVO
export async function eliminar(req, res) {
  try {
    const resultado = await eliminarDispositivo(
      req.params.id,
      req.session.usuario.id,
    );

    return res.status(200).json(resultado);
  } catch (error) {
    console.error(error);

    const status = error.message === "El dispositivo no existe." ? 404 : 400;

    return res.status(status).json({ error: error.message });
  }
}
