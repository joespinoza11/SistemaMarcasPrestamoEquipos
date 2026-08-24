import {
  listarDepartamentos as listarDepartamentosDB,
  buscarDepartamentoPorId,
  buscarDepartamentoPorNombre,
  crearDepartamento as crearDepartamentoDB,
  actualizarDepartamento as actualizarDepartamentoDB,
  eliminarDepartamento as eliminarDepartamentoDB,
} from "./departamento.model.js";

// VALIDAR NOMBRE DE DEPARTAMENTO
function validarNombre(nombre) {
  if (!nombre || nombre.trim() === "") {
    throw new Error("El nombre del departamento es obligatorio.");
  }

  if (nombre.trim().length < 3 || nombre.trim().length > 100) {
    throw new Error("El nombre debe tener entre 3 y 100 caracteres.");
  }
}

// LISTAR DEPARTAMENTOS
export async function listarDepartamentos() {
  return await listarDepartamentosDB();
}

// OBTENER DEPARTAMENTO POR ID
export async function obtenerDepartamentoPorId(id) {
  const departamento = await buscarDepartamentoPorId(id);

  if (!departamento) {
    throw new Error("El departamento no existe.");
  }

  return departamento;
}

// CREAR DEPARTAMENTO
export async function crearDepartamento(datos) {
  const nombre = datos?.nombre?.trim();
  const descripcion = datos?.descripcion?.trim() || null;
  const encargado = datos?.encargado?.trim() || null;

  validarNombre(nombre);

  // La tabla no tiene UNIQUE en `nombre`, pero se valida a nivel de
  // aplicación para evitar departamentos duplicados por error.
  const existente = await buscarDepartamentoPorNombre(nombre);

  if (existente) {
    throw new Error("Ya existe un departamento registrado con ese nombre.");
  }

  const id = await crearDepartamentoDB(nombre, descripcion, encargado);

  return { id, nombre, descripcion, encargado };
}

// ACTUALIZAR DEPARTAMENTO
export async function actualizarDepartamento(id, datos) {
  const departamento = await buscarDepartamentoPorId(id);

  if (!departamento) {
    throw new Error("El departamento no existe.");
  }

  const nombre = datos?.nombre?.trim();
  const descripcion =
    datos?.descripcion !== undefined
      ? datos.descripcion?.trim() || null
      : departamento.descripcion;
  const encargado =
    datos?.encargado !== undefined
      ? datos.encargado?.trim() || null
      : departamento.encargado;

  validarNombre(nombre);

  const existente = await buscarDepartamentoPorNombre(nombre);

  if (existente && existente.id !== Number(id)) {
    throw new Error("Ya existe un departamento registrado con ese nombre.");
  }

  await actualizarDepartamentoDB(id, nombre, descripcion, encargado);

  return { id: Number(id), nombre, descripcion, encargado };
}

// ELIMINAR DEPARTAMENTO
export async function eliminarDepartamento(id) {
  const departamento = await buscarDepartamentoPorId(id);

  if (!departamento) {
    throw new Error("El departamento no existe.");
  }

  try {
    await eliminarDepartamentoDB(id);
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw new Error(
        "No se puede eliminar el departamento porque tiene usuarios asociados.",
      );
    }

    throw error;
  }

  return { mensaje: "Departamento eliminado correctamente." };
}
