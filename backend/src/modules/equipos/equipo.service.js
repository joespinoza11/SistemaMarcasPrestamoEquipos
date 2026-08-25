import {
  buscarEquipoPorCodigo,
  buscarEquipoPorId,
  crearEquipo as crearEquipoDB,
  actualizarEquipo as actualizarEquipoDB,
  actualizarEstadoEquipo,
  tienePrestamoPendiente,
  eliminarEquipo as eliminarEquipoDB,
  listarEquipos as listarEquiposDB,
} from "./equipo.model.js";

const ESTADOS_VALIDOS = ["DISPONIBLE", "PRESTADO", "MANTENIMIENTO", "INACTIVO"];
const REGEX_CODIGO = /^EQ-\d{3}$/;

function crearError(mensaje, status) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

// LISTAR EQUIPOS
export async function listarEquipos() {
  return await listarEquiposDB();
}

// OBTENER EQUIPO POR ID
export async function obtenerEquipoPorId(id) {
  const equipo = await buscarEquipoPorId(id);

  if (!equipo) {
    throw crearError("El equipo no existe.", 404);
  }

  return equipo;
}

// CREAR EQUIPO
export async function crearEquipo(datos) {
  const { codigo, descripcion, imagen } = datos;

  if (!codigo || typeof codigo !== "string") {
    throw crearError("El código es obligatorio.", 400);
  }

  const codigoNormalizado = codigo.trim().toUpperCase();

  if (!REGEX_CODIGO.test(codigoNormalizado)) {
    throw crearError(
      "El código debe tener el formato EQ-XXX, con 3 dígitos (ej. EQ-001).",
      400,
    );
  }

  if (!descripcion || descripcion.trim() === "") {
    throw crearError("La descripción del equipo es obligatoria.", 400);
  }

  const codigoRegistrado = await buscarEquipoPorCodigo(codigoNormalizado);

  if (codigoRegistrado) {
    throw crearError("Ya existe un equipo registrado con ese código.", 409);
  }

  const id = await crearEquipoDB(
    codigoNormalizado,
    descripcion,
    imagen || null,
  );

  return {
    id,
    codigo: codigoNormalizado,
    descripcion,
    imagen: imagen || null,
    estado: "DISPONIBLE",
  };
}

// ACTUALIZAR EQUIPO
export async function actualizarEquipo(id, datos) {
  const { codigo, descripcion, imagen } = datos;

  const equipo = await buscarEquipoPorId(id);

  if (!equipo) {
    throw crearError("El equipo no existe.", 404);
  }

  if (!codigo || typeof codigo !== "string") {
    throw crearError("El código es obligatorio.", 400);
  }

  const codigoNormalizado = codigo.trim().toUpperCase();

  if (!REGEX_CODIGO.test(codigoNormalizado)) {
    throw crearError(
      "El código debe tener el formato EQ-XXX, con 3 dígitos (ej. EQ-001).",
      400,
    );
  }

  if (!descripcion || descripcion.trim() === "") {
    throw crearError("La descripción del equipo es obligatoria.", 400);
  }

  const codigoRegistrado = await buscarEquipoPorCodigo(codigoNormalizado);

  if (codigoRegistrado && codigoRegistrado.id !== Number(id)) {
    throw crearError("Ya existe otro equipo registrado con ese código.", 409);
  }

  await actualizarEquipoDB(
    id,
    codigoNormalizado,
    descripcion,
    imagen ?? equipo.imagen,
  );

  return {
    id,
    codigo: codigoNormalizado,
    descripcion,
    imagen: imagen ?? equipo.imagen,
  };
}

// CAMBIAR ESTADO DEL EQUIPO
export async function cambiarEstadoEquipo(id, estado) {
  const equipo = await buscarEquipoPorId(id);

  if (!equipo) {
    throw crearError("El equipo no existe.", 404);
  }

  if (!ESTADOS_VALIDOS.includes(estado)) {
    throw crearError(
      `Estado no válido. Los estados permitidos son: ${ESTADOS_VALIDOS.join(", ")}.`,
      400,
    );
  }

  const enPrestamoActivo = await tienePrestamoPendiente(id);

  if (enPrestamoActivo) {
    throw crearError(
      "Este equipo tiene un préstamo activo. Debe devolverse desde el módulo de préstamos antes de cambiar su estado.",
      409,
    );
  }

  await actualizarEstadoEquipo(id, estado);

  return { id, estado };
}

// ELIMINAR EQUIPO
export async function eliminarEquipo(id) {
  const equipo = await buscarEquipoPorId(id);

  if (!equipo) {
    throw crearError("El equipo no existe.", 404);
  }

  try {
    await eliminarEquipoDB(id);
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw crearError(
        "No se puede eliminar el equipo porque tiene préstamos asociados.",
        409,
      );
    }

    throw error;
  }

  return { mensaje: "Equipo eliminado correctamente." };
}
