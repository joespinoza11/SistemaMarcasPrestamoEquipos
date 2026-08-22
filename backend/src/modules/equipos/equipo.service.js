import {
  buscarEquipoPorCodigo,
  buscarEquipoPorId,
  crearEquipo as crearEquipoDB,
  actualizarEquipo as actualizarEquipoDB,
  actualizarEstadoEquipo,
  eliminarEquipo as eliminarEquipoDB,
  listarEquipos as listarEquiposDB,
} from "./equipo.model.js";

const ESTADOS_VALIDOS = ["DISPONIBLE", "PRESTADO", "MANTENIMIENTO", "INACTIVO"];

// LISTAR EQUIPOS
export async function listarEquipos() {
  return await listarEquiposDB();
}

// OBTENER EQUIPO POR ID
export async function obtenerEquipoPorId(id) {
  const equipo = await buscarEquipoPorId(id);

  if (!equipo) {
    throw new Error("El equipo no existe.");
  }

  return equipo;
}

// CREAR EQUIPO
export async function crearEquipo(datos) {
  const { codigo, descripcion, imagen } = datos;

  if (!codigo || codigo.trim().length < 3 || codigo.trim().length > 20) {
    throw new Error("El código debe tener entre 3 y 20 caracteres.");
  }

  if (!descripcion || descripcion.trim() === "") {
    throw new Error("La descripción del equipo es obligatoria.");
  }

  const codigoRegistrado = await buscarEquipoPorCodigo(codigo);

  if (codigoRegistrado) {
    throw new Error("Ya existe un equipo registrado con ese código.");
  }

  const id = await crearEquipoDB(codigo, descripcion, imagen || null);

  return {
    id,
    codigo,
    descripcion,
    imagen: imagen || null,
    estado: "DISPONIBLE",
  };
}

// ACTUALIZAR EQUIPO
export async function actualizarEquipo(id, datos) {
  const { descripcion, imagen } = datos;

  const equipo = await buscarEquipoPorId(id);

  if (!equipo) {
    throw new Error("El equipo no existe.");
  }

  if (!descripcion || descripcion.trim() === "") {
    throw new Error("La descripción del equipo es obligatoria.");
  }

  await actualizarEquipoDB(id, descripcion, imagen ?? equipo.imagen);

  return {
    id,
    descripcion,
    imagen: imagen ?? equipo.imagen,
  };
}

// CAMBIAR ESTADO DEL EQUIPO
export async function cambiarEstadoEquipo(id, estado) {
  const equipo = await buscarEquipoPorId(id);

  if (!equipo) {
    throw new Error("El equipo no existe.");
  }

  if (!ESTADOS_VALIDOS.includes(estado)) {
    throw new Error(
      `Estado no válido. Los estados permitidos son: ${ESTADOS_VALIDOS.join(", ")}.`,
    );
  }

  await actualizarEstadoEquipo(id, estado);

  return { id, estado };
}

// ELIMINAR EQUIPO
export async function eliminarEquipo(id) {
  const equipo = await buscarEquipoPorId(id);

  if (!equipo) {
    throw new Error("El equipo no existe.");
  }

  try {
    await eliminarEquipoDB(id);
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw new Error(
        "No se puede eliminar el equipo porque tiene préstamos asociados.",
      );
    }

    throw error;
  }

  return { mensaje: "Equipo eliminado correctamente." };
}
