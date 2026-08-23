import { buscarUsuarioPorId, buscarEquipoPorId, actualizarEstadoEquipo, crearPrestamo as crearPrestamoDB, crearDetallePrestamo, listarPrestamos as listarPrestamosDB,
  buscarPrestamoPorId,
  buscarDetallePorPrestamo,
  buscarDetalle,
  marcarDetalleDevuelto,
  marcarTodosDetallesDevueltos,
  contarPendientes,
  actualizarEstadoPrestamo,
} from "./prestamo.model.js";

const ESTADOS_VALIDOS = ["ACTIVO", "FINALIZADO"];

function crearError(mensaje, status) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

async function obtenerPrestamoConDetalle(id) {
  const prestamo = await buscarPrestamoPorId(id);

  if (!prestamo) {
    return null;
  }

  const detalle = await buscarDetallePorPrestamo(id);

  return { ...prestamo, equipos: detalle };
}

export async function crearPrestamo(datos, encargadoId) {
  const { usuarioId, equipos } = datos;

  if (!usuarioId) {
    throw crearError("Debe indicar el usuario que recibe el préstamo.", 400);
  }

  if (!Array.isArray(equipos) || equipos.length === 0) {
    throw crearError("Debe incluir al menos un equipo en el préstamo.", 400);
  }

  const equiposIds = equipos.map((id) => Number(id));

  if (equiposIds.some((id) => !id || Number.isNaN(id))) {
    throw crearError("La lista de equipos contiene valores inválidos.", 400);
  }

  const equiposUnicos = new Set(equiposIds);

  if (equiposUnicos.size !== equiposIds.length) {
    throw crearError(
      "No se puede incluir el mismo equipo más de una vez en el préstamo.",
      400,
    );
  }

  const usuario = await buscarUsuarioPorId(usuarioId);

  if (!usuario) {
    throw crearError("El usuario indicado no existe.", 404);
  }

  for (const equipoId of equiposIds) {
    const equipo = await buscarEquipoPorId(equipoId);

    if (!equipo) {
      throw crearError(`El equipo con id ${equipoId} no existe.`, 404);
    }

    if (equipo.estado !== "DISPONIBLE") {
      throw crearError(`El equipo ${equipo.codigo} no está disponible.`, 409);
    }
  }

  const prestamoId = await crearPrestamoDB(usuarioId, encargadoId);

  for (const equipoId of equiposIds) {
    await crearDetallePrestamo(prestamoId, equipoId);
    await actualizarEstadoEquipo(equipoId, "PRESTADO");
  }

  return await obtenerPrestamoConDetalle(prestamoId);
}

export async function listarPrestamos(filtros) {
  const { usuario, fecha, estado, equipo } = filtros;

  if (estado && !ESTADOS_VALIDOS.includes(estado)) {
    throw crearError(
      `Estado no válido. Los estados permitidos son: ${ESTADOS_VALIDOS.join(", ")}.`,
      400,
    );
  }

  return await listarPrestamosDB({
    usuarioId: usuario,
    fecha,
    estado,
    equipoId: equipo,
  });
}

export async function obtenerPrestamo(id) {
  const prestamo = await obtenerPrestamoConDetalle(id);

  if (!prestamo) {
    throw crearError("El préstamo no existe.", 404);
  }

  return prestamo;
}

export async function devolverEquipo(prestamoId, equipoId) {
  const prestamo = await buscarPrestamoPorId(prestamoId);

  if (!prestamo) {
    throw crearError("El préstamo no existe.", 404);
  }

  if (prestamo.estado === "FINALIZADO") {
    throw crearError("El préstamo ya fue finalizado.", 409);
  }

  const detalle = await buscarDetalle(prestamoId, equipoId);

  if (!detalle) {
    throw crearError("Ese equipo no pertenece al préstamo indicado.", 404);
  }

  if (detalle.estado_devolucion === "DEVUELTO") {
    throw crearError("Ese equipo ya había sido devuelto.", 409);
  }

  await marcarDetalleDevuelto(detalle.id);
  await actualizarEstadoEquipo(equipoId, "DISPONIBLE");

  const pendientes = await contarPendientes(prestamoId);
  let finalizado = false;

  if (pendientes === 0) {
    await actualizarEstadoPrestamo(prestamoId, "FINALIZADO");
    finalizado = true;
  }

  return {
    mensaje: finalizado
      ? "Equipo devuelto correctamente. El préstamo quedó finalizado."
      : "Equipo devuelto correctamente.",
    prestamo: await obtenerPrestamoConDetalle(prestamoId),
  };
}

export async function devolverPrestamoCompleto(prestamoId) {
  const prestamo = await buscarPrestamoPorId(prestamoId);

  if (!prestamo) {
    throw crearError("El préstamo no existe.", 404);
  }

  if (prestamo.estado === "FINALIZADO") {
    throw crearError("El préstamo ya fue finalizado.", 409);
  }

  const detalle = await buscarDetallePorPrestamo(prestamoId);
  const pendientes = detalle.filter((item) => item.estado_devolucion === "PENDIENTE");

  if (pendientes.length === 0) {
    throw crearError("No hay equipos pendientes de devolución en este préstamo.", 409);
  }

  await marcarTodosDetallesDevueltos(prestamoId);

  for (const item of pendientes) {
    await actualizarEstadoEquipo(item.equipo_id, "DISPONIBLE");
  }

  await actualizarEstadoPrestamo(prestamoId, "FINALIZADO");

  return {
    mensaje: "Préstamo devuelto por completo. El préstamo quedó finalizado.",
    prestamo: await obtenerPrestamoConDetalle(prestamoId),
  };
}