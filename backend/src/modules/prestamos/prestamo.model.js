import pool from "../../config/db.js";

export async function buscarUsuarioPorId(id) {
  const [result] = await pool.execute(
    `SELECT id, nombre_completo, username
     FROM usuarios
     WHERE id = ?`,
    [id],
  );
  return result[0];
}

export async function buscarEquipoPorId(id) {
  const [result] = await pool.execute(
    `SELECT id, codigo, descripcion, estado
     FROM equipos
     WHERE id = ?`,
    [id],
  );
  return result[0];
}

export async function actualizarEstadoEquipo(id, estado) {
  const [result] = await pool.execute(
    `UPDATE equipos
     SET estado = ?
     WHERE id = ?`,
    [estado, id],
  );
  return result.affectedRows;
}

export async function crearPrestamo(usuarioId, encargadoId) {
  const [result] = await pool.execute(
    `INSERT INTO prestamos (usuario_id, encargado_id, fecha, estado)
     VALUES (?, ?, CURDATE(), 'ACTIVO')`,
    [usuarioId, encargadoId],
  );
  return result.insertId;
}

export async function crearDetallePrestamo(prestamoId, equipoId) {
  const [result] = await pool.execute(
    `INSERT INTO prestamo_detalle (prestamo_id, equipo_id, estado_devolucion)
     VALUES (?, ?, 'PENDIENTE')`,
    [prestamoId, equipoId],
  );
  return result.insertId;
}

export async function listarPrestamos(filtros) {
  const { usuarioId, fecha, estado, equipoId } = filtros;

  let sql = `
    SELECT DISTINCT
        p.id,
        p.usuario_id,
        u.nombre_completo AS usuario_nombre,
        p.encargado_id,
        e.nombre_completo AS encargado_nombre,
        p.fecha,
        p.estado
    FROM prestamos p
    INNER JOIN usuarios u ON u.id = p.usuario_id
    INNER JOIN usuarios e ON e.id = p.encargado_id
    LEFT JOIN prestamo_detalle pd ON pd.prestamo_id = p.id
    WHERE 1 = 1
  `;

  const parametros = [];

  if (usuarioId) {
    sql += " AND p.usuario_id = ?";
    parametros.push(usuarioId);
  }

  if (fecha) {
    sql += " AND p.fecha = ?";
    parametros.push(fecha);
  }

  if (estado) {
    sql += " AND p.estado = ?";
    parametros.push(estado);
  }

  if (equipoId) {
    sql += " AND pd.equipo_id = ?";
    parametros.push(equipoId);
  }

  sql += " ORDER BY p.id DESC";

  const [result] = await pool.query(sql, parametros);
  return result;
}

export async function buscarPrestamoPorId(id) {
  const [result] = await pool.execute(
    `SELECT
        p.id,
        p.usuario_id,
        u.nombre_completo AS usuario_nombre,
        p.encargado_id,
        e.nombre_completo AS encargado_nombre,
        p.fecha,
        p.estado
     FROM prestamos p
     INNER JOIN usuarios u ON u.id = p.usuario_id
     INNER JOIN usuarios e ON e.id = p.encargado_id
     WHERE p.id = ?`,
    [id],
  );
  return result[0];
}

export async function buscarDetallePorPrestamo(prestamoId) {
  const [result] = await pool.execute(
    `SELECT
        pd.id,
        pd.equipo_id,
        eq.codigo,
        eq.descripcion,
        pd.estado_devolucion,
        pd.fecha_devolucion
     FROM prestamo_detalle pd
     INNER JOIN equipos eq ON eq.id = pd.equipo_id
     WHERE pd.prestamo_id = ?
     ORDER BY pd.id ASC`,
    [prestamoId],
  );
  return result;
}

export async function buscarDetalle(prestamoId, equipoId) {
  const [result] = await pool.execute(
    `SELECT id, estado_devolucion
     FROM prestamo_detalle
     WHERE prestamo_id = ? AND equipo_id = ?`,
    [prestamoId, equipoId],
  );
  return result[0];
}

export async function marcarDetalleDevuelto(detalleId) {
  const [result] = await pool.execute(
    `UPDATE prestamo_detalle
     SET estado_devolucion = 'DEVUELTO', fecha_devolucion = NOW()
     WHERE id = ?`,
    [detalleId],
  );
  return result.affectedRows;
}

export async function marcarTodosDetallesDevueltos(prestamoId) {
  const [result] = await pool.execute(
    `UPDATE prestamo_detalle
     SET estado_devolucion = 'DEVUELTO', fecha_devolucion = NOW()
     WHERE prestamo_id = ? AND estado_devolucion = 'PENDIENTE'`,
    [prestamoId],
  );
  return result.affectedRows;
}

export async function contarPendientes(prestamoId) {
  const [result] = await pool.execute(
    `SELECT COUNT(*) AS pendientes
     FROM prestamo_detalle
     WHERE prestamo_id = ? AND estado_devolucion = 'PENDIENTE'`,
    [prestamoId],
  );
  return result[0].pendientes;
}

export async function actualizarEstadoPrestamo(id, estado) {
  const [result] = await pool.execute(
    `UPDATE prestamos
     SET estado = ?
     WHERE id = ?`,
    [estado, id],
  );
  return result.affectedRows;
}
