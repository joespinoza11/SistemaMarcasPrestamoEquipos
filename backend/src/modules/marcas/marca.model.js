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

  // Un mismo usuario puede tener varios ciclos ENTRADA/SALIDA en un mismo
  // día (p. ej. distintos dispositivos a distintas horas). La versión
  // anterior agrupaba únicamente por usuario_id + fecha y usaba
  // MIN()/MAX() sobre TODAS las marcas de ese tipo en el día, lo cual
  // mezclaba dispositivos/IPs de ciclos distintos: MIN(d.nombre) siempre
  // devuelve el mismo nombre (el alfabéticamente menor) sin importar a
  // cuál entrada corresponde realmente. Por eso el reporte funcionaba
  // bien en el primer ciclo del día y luego "se pegaba" al mismo
  // dispositivo.
  //
  // Ahora cada marca se numera dentro de su propio tipo (ENTRADA o
  // SALIDA), por usuario y fecha, ordenada por hora (ROW_NUMBER). Luego
  // se empareja la ENTRADA #1 con la SALIDA #1, la ENTRADA #2 con la
  // SALIDA #2, etc. Así cada fila del reporte es un ciclo real, con su
  // propio dispositivo e IP. Si un ciclo quedó abierto (entrada sin
  // salida aún, o una salida sin entrada previa) también se reporta,
  // con el campo faltante en null.
  const [result] = await pool.execute(
    `WITH marcas_numeradas AS (
             SELECT m.id,
                    m.usuario_id,
                    m.fecha,
                    m.hora,
                    m.tipo,
                    m.ip,
                    u.nombre_completo AS usuario,
                    dep.nombre AS departamento,
                    d.nombre AS dispositivo,
                    ROW_NUMBER() OVER (
                        PARTITION BY m.usuario_id, m.fecha, m.tipo
                        ORDER BY m.hora ASC, m.id ASC
                    ) AS ciclo
             FROM marcas m
             INNER JOIN usuarios u ON u.id = m.usuario_id
             LEFT JOIN departamentos dep ON dep.id = u.departamento_id
             LEFT JOIN dispositivos d ON d.id = m.dispositivo_id
             ${where}
         )
         SELECT e.usuario_id,
                e.usuario,
                e.departamento,
                DATE_FORMAT(e.fecha, '%Y-%m-%d') AS fecha,
                e.hora AS hora_entrada,
                s.hora AS hora_salida,
                e.dispositivo AS dispositivo_entrada,
                s.dispositivo AS dispositivo_salida,
                e.ip AS ip_entrada,
                s.ip AS ip_salida
         FROM marcas_numeradas e
         LEFT JOIN marcas_numeradas s
                ON s.usuario_id = e.usuario_id
               AND s.fecha = e.fecha
               AND s.tipo = 'SALIDA'
               AND s.ciclo = e.ciclo
         WHERE e.tipo = 'ENTRADA'

         UNION ALL

         SELECT s.usuario_id,
                s.usuario,
                s.departamento,
                DATE_FORMAT(s.fecha, '%Y-%m-%d') AS fecha,
                NULL AS hora_entrada,
                s.hora AS hora_salida,
                NULL AS dispositivo_entrada,
                s.dispositivo AS dispositivo_salida,
                NULL AS ip_entrada,
                s.ip AS ip_salida
         FROM marcas_numeradas s
         LEFT JOIN marcas_numeradas e
                ON e.usuario_id = s.usuario_id
               AND e.fecha = s.fecha
               AND e.tipo = 'ENTRADA'
               AND e.ciclo = s.ciclo
         WHERE s.tipo = 'SALIDA'
           AND e.id IS NULL

         ORDER BY fecha DESC, usuario ASC, hora_entrada ASC, hora_salida ASC`,
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