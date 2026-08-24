import {
  listarDepartamentos,
  obtenerDepartamentoPorId,
  crearDepartamento,
  actualizarDepartamento,
  eliminarDepartamento,
} from "./departamento.service.js";

// LISTAR DEPARTAMENTOS
export async function listar(req, res) {
  try {
    const departamentos = await listarDepartamentos();

    return res.status(200).json({ departamentos });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "No se pudo obtener la lista de departamentos.",
    });
  }
}

// OBTENER DEPARTAMENTO POR ID
export async function obtener(req, res) {
  try {
    const departamento = await obtenerDepartamentoPorId(req.params.id);

    return res.status(200).json({ departamento });
  } catch (error) {
    console.error(error);

    return res.status(404).json({ error: error.message });
  }
}

// CREAR DEPARTAMENTO
export async function crear(req, res) {
  try {
    const departamento = await crearDepartamento(req.body);

    return res.status(201).json({
      mensaje: "Departamento registrado correctamente.",
      departamento,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({ error: error.message });
  }
}

// ACTUALIZAR DEPARTAMENTO
export async function actualizar(req, res) {
  try {
    const departamento = await actualizarDepartamento(req.params.id, req.body);

    return res.status(200).json({
      mensaje: "Departamento actualizado correctamente.",
      departamento,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({ error: error.message });
  }
}

// ELIMINAR DEPARTAMENTO
export async function eliminar(req, res) {
  try {
    const resultado = await eliminarDepartamento(req.params.id);

    return res.status(200).json(resultado);
  } catch (error) {
    console.error(error);

    return res.status(400).json({ error: error.message });
  }
}
