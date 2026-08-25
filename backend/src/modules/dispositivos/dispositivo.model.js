import pool from "../../config/db.js";

// LISTAR DISPOSITIVOS DE UN USUARIO
export async function listarDispositivosPorUsuario(usuarioId) {
  const [result] = await pool.execute(
    `SELECT id, identificador_unico, nombre, descripcion, estado, fecha_registro
         FROM dispositivos
         WHERE usuario_id = ?
         ORDER BY fecha_registro DESC`,
    [usuarioId],
  );
  return result;
}

// BUSCAR DISPOSITIVO POR ID
export async function buscarDispositivoPorId(id) {
  const [result] = await pool.execute(
    `SELECT id, usuario_id, identificador_unico, nombre, descripcion, estado, fecha_registro
         FROM dispositivos
         WHERE id = ?`,
    [id],
  );
  return result[0];
}

// BUSCAR DISPOSITIVO POR IDENTIFICADOR ÚNICO
export async function buscarDispositivoPorIdentificador(identificadorUnico) {
  const [result] = await pool.execute(
    `SELECT id, identificador_unico
         FROM dispositivos
         WHERE identificador_unico = ?`,
    [identificadorUnico],
  );
  return result[0];
}

// CREAR DISPOSITIVO
export async function crearDispositivo(usuarioId, identificadorUnico, nombre, descripcion) {
  const [result] = await pool.execute(
    `INSERT INTO dispositivos (usuario_id, identificador_unico, nombre, descripcion)
         VALUES (?, ?, ?, ?)`,
    [usuarioId, identificadorUnico, nombre, descripcion],
  );
  return result.insertId;
}

// ACTUALIZAR DISPOSITIVO 
export async function actualizarDispositivo(id, nombre, descripcion, estado) {
  const [result] = await pool.execute(
    `UPDATE dispositivos
         SET nombre = ?,
             descripcion = ?,
             estado = ?
         WHERE id = ?`,
    [nombre, descripcion, estado, id],
  );
  return result.affectedRows;
}

// ELIMINAR DISPOSITIVO (baja lógica: se marca INACTIVO, no se borra la fila)
export async function eliminarDispositivo(id) {
  const [result] = await pool.execute(
    `UPDATE dispositivos
         SET estado = 'INACTIVO'
         WHERE id = ?`,
    [id],
  );
  return result.affectedRows;
}
