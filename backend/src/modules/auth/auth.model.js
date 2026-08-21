import pool from "../../config/db.js";


export async function buscarUsuarioPorCorreo(correo) {

    const [result] = await pool.execute(
        `SELECT id, correo
         FROM usuarios
         WHERE correo = ?`,
        [correo]
    );

    return result[0];
}


export async function buscarUsuarioPorUsername(username) {

    const [result] = await pool.execute(
        `SELECT id, username
         FROM usuarios
         WHERE username = ?`,
        [username]
    );

    return result[0];
}


export async function buscarDepartamentoPorId(departamentoId) {

    const [result] = await pool.execute(
        `SELECT id
         FROM departamentos
         WHERE id = ?`,
        [departamentoId]
    );

    return result[0];
}


export async function buscarRolUsuario() {

    const [result] = await pool.execute(
        `SELECT id
         FROM roles
         WHERE nombre = 'usuario'`
    );

    return result[0];
}


export async function crearUsuario(
    nombreCompleto,
    fechaNacimiento,
    correo,
    username,
    contrasenaHash,
    departamentoId,
    rolId
) {

    const [result] = await pool.execute(
        `INSERT INTO usuarios (
            nombre_completo,
            fecha_nacimiento,
            correo,
            username,
            password_hash,
            departamento_id,
            rol_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            nombreCompleto,
            fechaNacimiento,
            correo,
            username,
            contrasenaHash,
            departamentoId,
            rolId
        ]
    );

    return result.insertId;
}


export async function buscarUsuarioLogin(usuario) {

    const [result] = await pool.execute(
        `SELECT
            u.id,
            u.nombre_completo,
            u.fecha_nacimiento,
            u.correo,
            u.username,
            u.password_hash,
            r.nombre AS rol
         FROM usuarios u
         INNER JOIN roles r
            ON u.rol_id = r.id
         WHERE u.username = ?
            OR u.correo = ?`,
        [usuario, usuario]
    );

    return result[0];
}


export async function buscarUsuarioRecuperacion(usuario) {

    const [result] = await pool.execute(
        `SELECT id, correo, username
         FROM usuarios
         WHERE username = ?
            OR correo = ?`,
        [usuario, usuario]
    );

    return result[0];
}


export async function tokenRecuperacion(
    usuarioId,
    token,
    fechaExpiracion
) {

    const [result] = await pool.execute(
        `INSERT INTO tokens_recuperacion (
            usuario_id,
            token,
            fecha_expiracion
        )
        VALUES (?, ?, ?)`,
        [
            usuarioId,
            token,
            fechaExpiracion
        ]
    );

    return result.insertId;
}


export async function buscarTokenRecuperacion(token) {

    const [result] = await pool.execute(
        `SELECT
            id,
            usuario_id,
            fecha_expiracion,
            usado
         FROM tokens_recuperacion
         WHERE token = ?
            AND usado = FALSE
            AND fecha_expiracion > NOW()`,
        [token]
    );

    return result[0];
}


export async function actualizarContrasena(
    usuarioId,
    contrasenaHash
) {

    const [result] = await pool.execute(
        `UPDATE usuarios
         SET password_hash = ?
         WHERE id = ?`,
        [
            contrasenaHash,
            usuarioId
        ]
    );

    return result.affectedRows;
}


export async function marcarTokenComoUsado(tokenId) {

    await pool.execute(
        `UPDATE tokens_recuperacion
         SET usado = TRUE
         WHERE id = ?`,
        [tokenId]
    );
}