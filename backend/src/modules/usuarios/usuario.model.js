import pool from "../../config/db.js";

// BUSCAR PERFIL COMPLETO POR ID
export async function buscarPerfilPorId(id) {
  const [result] = await pool.execute(
    `SELECT
            u.id,
            u.nombre_completo,
            u.fecha_nacimiento,
            u.correo,
            u.username,
            u.departamento_id,
            d.nombre AS departamento,
            r.nombre AS rol,
            u.fecha_registro
         FROM usuarios u
         LEFT JOIN departamentos d ON u.departamento_id = d.id
         INNER JOIN roles r ON u.rol_id = r.id
         WHERE u.id = ?`,
    [id],
  );
  return result[0];
}

// BUSCAR USUARIO CON SU HASH DE CONTRASEÑA 
export async function buscarUsuarioConPasswordPorId(id) {
  const [result] = await pool.execute(
    `SELECT id, password_hash
         FROM usuarios
         WHERE id = ?`,
    [id],
  );
  return result[0];
}

// BUSCAR USUARIO POR CORREO 
export async function buscarUsuarioPorCorreo(correo) {
  const [result] = await pool.execute(
    `SELECT id, correo
         FROM usuarios
         WHERE correo = ?`,
    [correo],
  );
  return result[0];
}

// BUSCAR DEPARTAMENTO POR ID 
export async function buscarDepartamentoPorId(departamentoId) {
  const [result] = await pool.execute(
    `SELECT id
         FROM departamentos
         WHERE id = ?`,
    [departamentoId],
  );
  return result[0];
}

// ACTUALIZAR PERFIL 
export async function actualizarPerfil(
  id,
  nombreCompleto,
  fechaNacimiento,
  departamentoId,
) {
  const [result] = await pool.execute(
    `UPDATE usuarios
         SET nombre_completo = ?,
             fecha_nacimiento = ?,
             departamento_id = ?
         WHERE id = ?`,
    [nombreCompleto, fechaNacimiento, departamentoId, id],
  );
  return result.affectedRows;
}

// ACTUALIZAR CONTRASEÑA
export async function actualizarPassword(id, passwordHash) {
  const [result] = await pool.execute(
    `UPDATE usuarios
         SET password_hash = ?
         WHERE id = ?`,
    [passwordHash, id],
  );
  return result.affectedRows;
}

// LISTAR USUARIOS 
export async function listarUsuarios() {
  const [result] = await pool.execute(
    `SELECT
            u.id,
            u.nombre_completo,
            u.correo,
            u.username,
            d.nombre AS departamento,
            r.nombre AS rol
         FROM usuarios u
         LEFT JOIN departamentos d ON u.departamento_id = d.id
         INNER JOIN roles r ON u.rol_id = r.id
         ORDER BY u.nombre_completo ASC`,
  );
  return result;
}
