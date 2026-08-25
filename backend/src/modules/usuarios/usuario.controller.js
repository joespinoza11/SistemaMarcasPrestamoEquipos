import {
  obtenerPerfil,
  actualizarPerfil,
  cambiarPassword,
  listarUsuarios,
  obtenerUsuarioPorId,
} from "./usuario.service.js";

// OBTENER PERFIL PROPIO
export async function perfil(req, res) {
  try {
    const usuario = await obtenerPerfil(req.session.usuario.id);

    return res.status(200).json({ usuario });
  } catch (error) {
    console.error(error);

    return res.status(404).json({ error: error.message });
  }
}

// ACTUALIZAR PERFIL PROPIO
export async function actualizarPerfilPropio(req, res) {
  try {
    const usuario = await actualizarPerfil(req.session.usuario.id, req.body);

    return res.status(200).json({
      mensaje: "Perfil actualizado correctamente.",
      usuario,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({ error: error.message });
  }
}

// CAMBIAR CONTRASEÑA PROPIA
export async function cambiarPasswordPropia(req, res) {
  try {
    const resultado = await cambiarPassword(
      req.session.usuario.id,
      req.body,
    );

    return res.status(200).json(resultado);
  } catch (error) {
    console.error(error);

    return res.status(400).json({ error: error.message });
  }
}

// LISTAR USUARIOS
export async function listar(req, res) {
  try {
    const usuarios = await listarUsuarios();

    return res.status(200).json({ usuarios });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "No se pudo obtener la lista de usuarios.",
    });
  }
}

// OBTENER USUARIO POR ID
export async function obtener(req, res) {
  try {
    const usuario = await obtenerUsuarioPorId(req.params.id);

    return res.status(200).json({ usuario });
  } catch (error) {
    console.error(error);

    return res.status(404).json({ error: error.message });
  }
}
