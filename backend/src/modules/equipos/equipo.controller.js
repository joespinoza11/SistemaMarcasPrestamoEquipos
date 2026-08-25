import {
  listarEquipos,
  obtenerEquipoPorId,
  crearEquipo,
  actualizarEquipo,
  cambiarEstadoEquipo,
  eliminarEquipo,
} from "./equipo.service.js";

// LISTAR EQUIPOS
export async function listar(req, res) {
  try {
    const equipos = await listarEquipos();

    return res.status(200).json({ equipos });
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({
      error: "No se pudo obtener la lista de equipos.",
    });
  }
}

// OBTENER EQUIPO POR ID
export async function obtener(req, res) {
  try {
    const equipo = await obtenerEquipoPorId(req.params.id);

    return res.status(200).json({ equipo });
  } catch (error) {
    console.error(error);

    return res.status(error.status || 404).json({ error: error.message });
  }
}

// CREAR EQUIPO
export async function crear(req, res) {
  try {
    const datos = {
      ...req.body,
      imagen: req.file ? req.file.filename : null,
    };

    const equipo = await crearEquipo(datos);

    return res.status(201).json({
      mensaje: "Equipo registrado correctamente.",
      equipo,
    });
  } catch (error) {
    console.error(error);

    return res.status(error.status || 400).json({ error: error.message });
  }
}

// ACTUALIZAR EQUIPO
export async function actualizar(req, res) {
  try {
    const datos = {
      ...req.body,
      imagen: req.file ? req.file.filename : undefined,
    };

    const equipo = await actualizarEquipo(req.params.id, datos);

    return res.status(200).json({
      mensaje: "Equipo actualizado correctamente.",
      equipo,
    });
  } catch (error) {
    console.error(error);

    return res.status(error.status || 400).json({ error: error.message });
  }
}

// CAMBIAR ESTADO DEL EQUIPO
export async function cambiarEstado(req, res) {
  try {
    const { estado } = req.body;

    const equipo = await cambiarEstadoEquipo(req.params.id, estado);

    return res.status(200).json({
      mensaje: "Estado del equipo actualizado correctamente.",
      equipo,
    });
  } catch (error) {
    console.error(error);

    return res.status(error.status || 400).json({ error: error.message });
  }
}

// ELIMINAR EQUIPO
export async function eliminar(req, res) {
  try {
    const resultado = await eliminarEquipo(req.params.id);

    return res.status(200).json(resultado);
  } catch (error) {
    console.error(error);

    return res.status(error.status || 400).json({ error: error.message });
  }
}
