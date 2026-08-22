import pool from "../../config/db.js";

// LISTAR TODA LA CONFIGURACIÓN
export async function listarConfiguracion() {
  const [result] = await pool.execute(
    `SELECT clave, valor
     FROM configuracion
     ORDER BY clave ASC`,
  );

  return result;
}

// BUSCAR UN VALOR POR SU CLAVE
export async function buscarConfiguracionPorClave(clave) {
  const [result] = await pool.execute(
    `SELECT clave, valor
     FROM configuracion
     WHERE clave = ?`,
    [clave],
  );

  return result[0];
}

// ACTUALIZAR EL VALOR DE UNA CLAVE
export async function actualizarConfiguracion(clave, valor) {
  const [result] = await pool.execute(
    `UPDATE configuracion
     SET valor = ?
     WHERE clave = ?`,
    [valor, clave],
  );

  return result.affectedRows;
}
