import {
  registrarMarca,
  listarMarcas,
  obtenerMarcaPorId,
  generarReporte,
} from "./marca.service.js";

import { generarXml, generarPdf } from "./marca.export.js";

import { buscarConfiguracionPorClave } from "../configuracion/configuracion.model.js";

function nombreArchivo(extension) {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");

  return `reporte-marcas-${anio}${mes}${dia}.${extension}`;
}

export async function registrar(req, res) {
  try {
    const marca = await registrarMarca(
      req.session.usuario.id,
      req.ip,
      req.body.dispositivo,
    );

    return res.status(201).json({
      mensaje: "Marca registrada correctamente.",
      marca,
    });
  } catch (error) {
    console.error(error);

    return res.status(error.status || 400).json({ error: error.message });
  }
}

export async function listar(req, res) {
  try {
    const marcas = await listarMarcas(req.query, req.session.usuario);

    return res.status(200).json({ marcas });
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({ error: error.message });
  }
}

export async function reporte(req, res) {
  try {
    const marcas = await generarReporte(req.query);

    return res.status(200).json({
      total: marcas.length,
      marcas,
    });
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({ error: error.message });
  }
}

export async function exportarJson(req, res) {
  try {
    const marcas = await generarReporte(req.query);

    const contenido = {
      generadoEn: new Date().toISOString(),
      totalRegistros: marcas.length,
      marcas,
    };

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${nombreArchivo("json")}"`);

    return res.status(200).send(JSON.stringify(contenido, null, 2));
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({ error: error.message });
  }
}

export async function exportarXml(req, res) {
  try {
    const marcas = await generarReporte(req.query);

    const contenido = generarXml(marcas);

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${nombreArchivo("xml")}"`);

    return res.status(200).send(contenido);
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({ error: error.message });
  }
}

export async function exportarPdf(req, res) {
  try {
    const marcas = await generarReporte(req.query);

    const institucion = await buscarConfiguracionPorClave("nombre_institucion");

    const contenido = await generarPdf(marcas, institucion ? institucion.valor : null);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${nombreArchivo("pdf")}"`);

    return res.status(200).send(contenido);
  } catch (error) {
    console.error(error);

    return res.status(error.status || 500).json({ error: error.message });
  }
}

export async function obtener(req, res) {
  try {
    const marca = await obtenerMarcaPorId(req.params.id, req.session.usuario);

    return res.status(200).json({ marca });
  } catch (error) {
    console.error(error);

    return res.status(error.status || 404).json({ error: error.message });
  }
}