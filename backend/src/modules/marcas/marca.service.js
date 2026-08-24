import {
  crearMarca,
  buscarUltimaMarcaDelDia,
  buscarMarcaPorId,
  listarMarcas as listarMarcasDB,
  obtenerReporteMarcas,
  buscarDispositivoAutorizado,
} from "./marca.model.js";

import { buscarConfiguracionPorClave } from "../configuracion/configuracion.model.js";

function crearError(mensaje, status) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

function tieneValor(dato) {
  return dato !== undefined && dato !== null && String(dato).trim() !== "";
}

function normalizarIp(ip) {
  if (!ip) {
    return "";
  }

  if (ip === "::1") {
    return "127.0.0.1";
  }

  if (ip.startsWith("::ffff:")) {
    return ip.substring(7);
  }

  return ip;
}

function ipANumero(ip) {
  const partes = ip.split(".");

  if (partes.length !== 4) {
    return null;
  }

  let numero = 0;

  for (const parte of partes) {
    const octeto = Number(parte);

    if (!Number.isInteger(octeto) || octeto < 0 || octeto > 255) {
      return null;
    }

    numero = numero * 256 + octeto;
  }

  return numero;
}

function coincideConRango(ip, rango) {
  const texto = rango.trim();

  if (texto === "") {
    return false;
  }

  if (!texto.includes("/")) {
    return texto === ip;
  }

  const [base, bitsTexto] = texto.split("/");
  const bits = Number(bitsTexto);

  if (!Number.isInteger(bits) || bits < 0 || bits > 32) {
    return false;
  }

  if (bits === 0) {
    return true;
  }

  const numeroIp = ipANumero(ip);
  const numeroBase = ipANumero(base);

  if (numeroIp === null || numeroBase === null) {
    return false;
  }

  const mascara = (0xffffffff << (32 - bits)) >>> 0;

  return (numeroIp & mascara) >>> 0 === (numeroBase & mascara) >>> 0;
}

async function validarIp(ip) {
  const configuracion = await buscarConfiguracionPorClave("rango_ip_permitido");

  if (!configuracion || !configuracion.valor || configuracion.valor.trim() === "") {
    return;
  }

  const rangos = configuracion.valor.split(",");

  for (const rango of rangos) {
    if (coincideConRango(ip, rango)) {
      return;
    }
  }

  throw crearError("No es posible realizar la marca desde la red actual.", 403);
}

async function validarDispositivo(identificador, usuarioId) {
  if (!identificador || identificador.trim() === "") {
    throw crearError("El identificador del dispositivo es obligatorio.", 400);
  }

  const dispositivo = await buscarDispositivoAutorizado(identificador.trim(), usuarioId);

  if (!dispositivo) {
    throw crearError("El dispositivo no está registrado para este usuario.", 403);
  }

  if (dispositivo.estado !== "ACTIVO") {
    throw crearError("El dispositivo se encuentra inactivo.", 403);
  }

  return dispositivo;
}

function fechaActual() {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

function horaActual() {
  const ahora = new Date();
  const horas = String(ahora.getHours()).padStart(2, "0");
  const minutos = String(ahora.getMinutes()).padStart(2, "0");
  const segundos = String(ahora.getSeconds()).padStart(2, "0");

  return `${horas}:${minutos}:${segundos}`;
}

export async function registrarMarca(usuarioId, ipSolicitud, identificadorDispositivo) {
  const ip = normalizarIp(ipSolicitud);

  await validarIp(ip);

  const dispositivo = await validarDispositivo(identificadorDispositivo, usuarioId);

  const fecha = fechaActual();
  const hora = horaActual();

  const ultimaMarca = await buscarUltimaMarcaDelDia(usuarioId, fecha);

  let tipo = "ENTRADA";

  if (ultimaMarca) {
    if (ultimaMarca.tipo === "ENTRADA") {
      tipo = "SALIDA";
    } else {
      tipo = "ENTRADA";
    }
  }

  const id = await crearMarca(usuarioId, fecha, hora, tipo, ip, dispositivo.id);

  return {
    id,
    fecha,
    hora,
    tipo,
    ip,
    dispositivo: dispositivo.nombre,
  };
}

function validarFiltrosFecha(filtros, criterios) {
  if (tieneValor(filtros.anio)) {
    const anio = Number(filtros.anio);

    if (!Number.isInteger(anio) || anio < 2000 || anio > 2100) {
      throw crearError("El año indicado no es válido.", 400);
    }

    criterios.anio = anio;
  }

  if (tieneValor(filtros.mes)) {
    const mes = Number(filtros.mes);

    if (!Number.isInteger(mes) || mes < 1 || mes > 12) {
      throw crearError("El mes indicado no es válido.", 400);
    }

    criterios.mes = mes;
  }

  if (tieneValor(filtros.dia)) {
    const dia = Number(filtros.dia);

    if (!Number.isInteger(dia) || dia < 1 || dia > 31) {
      throw crearError("El día indicado no es válido.", 400);
    }

    criterios.dia = dia;
  }
}

function validarFiltrosAdministrador(filtros, criterios) {
  if (tieneValor(filtros.usuario)) {
    const usuario = Number(filtros.usuario);

    if (!Number.isInteger(usuario) || usuario < 1) {
      throw crearError("El usuario indicado no es válido.", 400);
    }

    criterios.usuario = usuario;
  }

  if (tieneValor(filtros.departamento)) {
    const departamento = Number(filtros.departamento);

    if (!Number.isInteger(departamento) || departamento < 1) {
      throw crearError("El departamento indicado no es válido.", 400);
    }

    criterios.departamento = departamento;
  }
}

export async function generarReporte(filtros) {
  const criterios = {};

  validarFiltrosAdministrador(filtros, criterios);
  validarFiltrosFecha(filtros, criterios);

  return await obtenerReporteMarcas(criterios);
}

export async function listarMarcas(filtros, usuarioSesion) {
  const criterios = {};

  if (usuarioSesion.rol === "administrador") {
    validarFiltrosAdministrador(filtros, criterios);
  } else {
    criterios.usuario = usuarioSesion.id;
  }

  validarFiltrosFecha(filtros, criterios);

  return await listarMarcasDB(criterios);
}

export async function obtenerMarcaPorId(id, usuarioSesion) {
  const marca = await buscarMarcaPorId(id);

  if (!marca) {
    throw crearError("La marca no existe.", 404);
  }

  if (usuarioSesion.rol !== "administrador" && marca.usuario_id !== usuarioSesion.id) {
    throw crearError("No tiene permiso para consultar esta marca.", 403);
  }

  return marca;
}