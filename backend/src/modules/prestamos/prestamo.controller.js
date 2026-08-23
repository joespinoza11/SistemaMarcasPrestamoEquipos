import {crearPrestamo, listarPrestamos, obtenerPrestamo, devolverEquipo, devolverPrestamoCompleto,} from "./prestamo.service.js";

export async function crear(req, res) {
    try {
        const encargadoId = req.session.usuario.id;

        const prestamo = await crearPrestamo(req.body, encargadoId);

        return res.status(201).json({
            mensaje: "Préstamo registrado correctamente.",
            prestamo,
        });
    } catch (error) {
        console.error(error);

        return res.status(error.status || 400).json({ error: error.message });
    }
}

export async function listar(req, res) {
    try {
        const { usuario, fecha, estado, equipo } = req.query;

        const prestamos = await listarPrestamos({ usuario, fecha, estado, equipo });

        return res.status(200).json({ prestamos });
    } catch (error) {
        console.error(error);

        return res.status(error.status || 400).json({ error: error.message });
    }
}

export async function obtener(req, res) {
    try {
        const prestamo = await obtenerPrestamo(req.params.id);

        return res.status(200).json({ prestamo });
    } catch (error) {
        console.error(error);

        return res.status(error.status || 404).json({ error: error.message });
    }
}

export async function devolverUnoIndividual(req, res) {
    try {
        const { prestamoId, equipoId } = req.params;

        const resultado = await devolverEquipo(prestamoId, equipoId);

        return res.status(200).json(resultado);
    } catch (error) {
        console.error(error);

        return res.status(error.status || 400).json({ error: error.message });
    }
}

export async function devolverCompleto(req, res) {
    try {
        const { prestamoId } = req.params;

        const resultado = await devolverPrestamoCompleto(prestamoId);

        return res.status(200).json(resultado);
    } catch (error) {
        console.error(error);

        return res.status(error.status || 400).json({ error: error.message });
    }
}
