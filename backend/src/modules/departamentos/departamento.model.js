import pool from "../../config/db.js";

// LISTAR DEPARTAMENTOS
export async function listarDepartamentos() {
  const [result] = await pool.execute(
    `SELECT id, nombre, descripcion, encargado, fecha_creacion
         FROM departamentos
         ORDER BY nombre ASC`,
  );
  return result;
}

// BUSCAR DEPARTAMENTO POR ID
export async function buscarDepartamentoPorId(id) {
  const [result] = await pool.execute(
    `SELECT id, nombre, descripcion, encargado, fecha_creacion
         FROM departamentos
         WHERE id = ?`,
    [id],
  );
  return result[0];
}

// BUSCAR DEPARTAMENTO POR NOMBRE
export async function buscarDepartamentoPorNombre(nombre) {
  const [result] = await pool.execute(
    `SELECT id, nombre
         FROM departamentos
         WHERE nombre = ?`,
    [nombre],
  );
  return result[0];
}

// CREAR DEPARTAMENTO
export async function crearDepartamento(nombre, descripcion, encargado) {
  const [result] = await pool.execute(
    `INSERT INTO departamentos (nombre, descripcion, encargado)
         VALUES (?, ?, ?)`,
    [nombre, descripcion, encargado],
  );
  return result.insertId;
}

// ACTUALIZAR DEPARTAMENTO
export async function actualizarDepartamento(id, nombre, descripcion, encargado) {
  const [result] = await pool.execute(
    `UPDATE departamentos
         SET nombre = ?,
             descripcion = ?,
             encargado = ?
         WHERE id = ?`,
    [nombre, descripcion, encargado, id],
  );
  return result.affectedRows;
}

// ELIMINAR DEPARTAMENTO
export async function eliminarDepartamento(id) {
  const [result] = await pool.execute(
    `DELETE FROM departamentos
         WHERE id = ?`,
    [id],
  );
  return result.affectedRows;
}
