import pool from "../../config/db.js";

export async function crearMarca(usuarioId, fecha, hora, tipo, ip, dispositivoId) {
  const [result] = await pool.execute(
    `INSERT INTO marcas (
            usuario_id,
            fecha,
            hora,
            tipo,
            ip,
            dispositivo_id
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
    [usuarioId, fecha, hora, tipo, ip, dispositivoId],
  );
  return result.insertId;
}

export async function buscarUltimaMarcaDelDia(usuarioId, fecha) {
  const [result] = await pool.execute(
    `SELECT id, tipo, hora
         FROM marcas
         WHERE usuario_id = ?
           AND fecha = ?
         ORDER BY hora DESC, id DESC
         LIMIT 1`,
    [usuarioId, fecha],
  );
  return result[0];
}

export async function buscarMarcaPorId(id) {
  const [result] = await pool.execute(
    `SELECT m.id,
                DATE_FORMAT(m.fecha, '%Y-%m-%d') AS fecha,
                m.hora,
                m.tipo,
                m.ip,
                m.usuario_id,
                u.nombre_completo AS usuario,
                d.nombre AS dispositivo
         FROM marcas m
         INNER JOIN usuarios u ON u.id = m.usuario_id
         LEFT JOIN dispositivos d ON d.id = m.dispositivo_id
         WHERE m.id = ?`,
    [id],
  );
  return result[0];
}

function construirFiltros(filtros) {
  const condiciones = [];
  const valores = [];

  if (filtros.usuario) {
    condiciones.push("m.usuario_id = ?");
    valores.push(filtros.usuario);
  }

  if (filtros.anio) {
    condiciones.push("YEAR(m.fecha) = ?");
    valores.push(filtros.anio);
  }

  if (filtros.mes) {
    condiciones.push("MONTH(m.fecha) = ?");
    valores.push(filtros.mes);
  }

  if (filtros.dia) {
    condiciones.push("DAY(m.fecha) = ?");
    valores.push(filtros.dia);
  }

  if (filtros.departamento) {
    condiciones.push("u.departamento_id = ?");
    valores.push(filtros.departamento);
  }

  const where = condiciones.length > 0 ? `WHERE ${condiciones.join(" AND ")}` : "";

  return { where, valores };
}

export async function listarMarcas(filtros) {
  const { where, valores } = construirFiltros(filtros);

  const [result] = await pool.execute(
    `SELECT m.id,
                DATE_FORMAT(m.fecha, '%Y-%m-%d') AS fecha,
                m.hora,
                m.tipo,
                m.ip,
                m.usuario_id,
                u.nombre_completo AS usuario,
                dep.nombre AS departamento,
                d.nombre AS dispositivo
         FROM marcas m
         INNER JOIN usuarios u ON u.id = m.usuario_id
         LEFT JOIN departamentos dep ON dep.id = u.departamento_id
         LEFT JOIN dispositivos d ON d.id = m.dispositivo_id
         ${where}
         ORDER BY m.fecha DESC, m.hora DESC, m.id DESC`,
    valores,
  );
  return result;
}

export async function obtenerReporteMarcas(filtros) {
  const { where, valores } = construirFiltros(filtros);

  const [result] = await pool.execute(
    `SELECT u.id AS usuario_id,
                u.nombre_completo AS usuario,
                dep.nombre AS departamento,
                DATE_FORMAT(m.fecha, '%Y-%m-%d') AS fecha,
                MIN(CASE WHEN m.tipo = 'ENTRADA' THEN m.hora END) AS hora_entrada,
                MAX(CASE WHEN m.tipo = 'SALIDA' THEN m.hora END) AS hora_salida,
                MIN(d.nombre) AS dispositivo,
                MIN(m.ip) AS ip,
                COUNT(*) AS total_marcas
         FROM marcas m
         INNER JOIN usuarios u ON u.id = m.usuario_id
         LEFT JOIN departamentos dep ON dep.id = u.departamento_id
         LEFT JOIN dispositivos d ON d.id = m.dispositivo_id
         ${where}
         GROUP BY u.id, u.nombre_completo, dep.nombre, m.fecha
         ORDER BY m.fecha DESC, u.nombre_completo ASC`,
    valores,
  );
  return result;
}

export async function buscarDispositivoAutorizado(identificador, usuarioId) {
  const [result] = await pool.execute(
    `SELECT id, nombre, estado
         FROM dispositivos
         WHERE identificador_unico = ?
           AND usuario_id = ?`,
    [identificador, usuarioId],
  );
  return result[0];
}