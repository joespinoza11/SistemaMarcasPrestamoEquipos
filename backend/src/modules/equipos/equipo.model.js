import pool from "../../config/db.js";

// LISTAR EQUIPOS
export async function listarEquipos() {
  const [result] = await pool.execute(
    `SELECT id, codigo, descripcion, imagen, estado
         FROM equipos
         ORDER BY id DESC`,
  );
  return result;
}

// BUSCAR EQUIPO POR ID
export async function buscarEquipoPorId(id) {
  const [result] = await pool.execute(
    `SELECT id, codigo, descripcion, imagen, estado
         FROM equipos
         WHERE id = ?`,
    [id],
  );
  return result[0];
}

// BUSCAR EQUIPO POR CODIGO
export async function buscarEquipoPorCodigo(codigo) {
  const [result] = await pool.execute(
    `SELECT id, codigo
         FROM equipos
         WHERE codigo = ?`,
    [codigo],
  );
  return result[0];
}

// CREAR EQUIPO
export async function crearEquipo(codigo, descripcion, imagen) {
  const [result] = await pool.execute(
    `INSERT INTO equipos (
            codigo,
            descripcion,
            imagen
        )
        VALUES (?, ?, ?)`,
    [codigo, descripcion, imagen],
  );
  return result.insertId;
}

// ACTUALIZAR EQUIPO
export async function actualizarEquipo(id, descripcion, imagen) {
  const [result] = await pool.execute(
    `UPDATE equipos
         SET descripcion = ?,
             imagen = ?
         WHERE id = ?`,
    [descripcion, imagen, id],
  );
  return result.affectedRows;
}

// ACTUALIZAR ESTADO DEL EQUIPO
export async function actualizarEstadoEquipo(id, estado) {
  const [result] = await pool.execute(
    `UPDATE equipos
         SET estado = ?
         WHERE id = ?`,
    [estado, id],
  );
  return result.affectedRows;
}

// ELIMINAR EQUIPO
export async function eliminarEquipo(id) {
  const [result] = await pool.execute(
    `DELETE FROM equipos
         WHERE id = ?`,
    [id],
  );
  return result.affectedRows;
}