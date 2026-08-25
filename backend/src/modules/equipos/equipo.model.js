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
export async function actualizarEquipo(id, codigo, descripcion, imagen) {
  const [result] = await pool.execute(
    `UPDATE equipos
         SET codigo = ?,
             descripcion = ?,
             imagen = ?
         WHERE id = ?`,
    [codigo, descripcion, imagen, id],
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

// VERIFICAR SI EL EQUIPO TIENE UN PRÉSTAMO PENDIENTE DE DEVOLUCIÓN
export async function tienePrestamoPendiente(equipoId) {
  const [result] = await pool.execute(
    `SELECT id
         FROM prestamo_detalle
         WHERE equipo_id = ?
           AND estado_devolucion = 'PENDIENTE'
         LIMIT 1`,
    [equipoId],
  );
  return result.length > 0;
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
