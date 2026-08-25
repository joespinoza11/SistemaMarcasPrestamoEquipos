import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";

import { buscarConfiguracionPorClave } from "../modules/configuracion/configuracion.model.js";

const DIRECTORIO_DESTINO = path.join(process.cwd(), "uploads", "equipos");

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];

// ASEGURAR QUE EXISTA LA CARPETA DE DESTINO
if (!fs.existsSync(DIRECTORIO_DESTINO)) {
  fs.mkdirSync(DIRECTORIO_DESTINO, { recursive: true });
}

// CONFIGURAR DÓNDE Y CON QUÉ NOMBRE SE GUARDA EL ARCHIVO
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIRECTORIO_DESTINO);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const nombreSeguro = `${crypto.randomUUID()}${extension}`;

    cb(null, nombreSeguro);
  },
});

// VALIDAR TIPO DE ARCHIVO
const fileFilter = (req, file, cb) => {
  if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
    return cb(new Error("Solo se permiten imágenes JPG, PNG o WEBP."));
  }

  cb(null, true);
};

// OBTENER EL LÍMITE ACTUAL DESDE LA TABLA CONFIGURACION (CON FALLBACK AL .ENV)
async function obtenerLimiteMB() {
  try {
    const config = await buscarConfiguracionPorClave("tamano_max_archivo_mb");
    const valor = Number(config?.valor);

    if (!isNaN(valor) && valor > 0) {
      return valor;
    }
  } catch (error) {
    console.error("No se pudo leer tamano_max_archivo_mb de la configuración:", error);
  }

  return Number(process.env.MAX_FILE_SIZE_MB) || 5;
}

// MIDDLEWARE LISTO PARA USAR EN LAS RUTAS
export async function subirImagenEquipo(req, res, next) {
  const maxMB = await obtenerLimiteMB();
  const tamanoMaximoBytes = maxMB * 1024 * 1024;

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: tamanoMaximoBytes },
  }).single("imagen");

  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: `La imagen no debe superar los ${maxMB} MB.`,
        });
      }

      return res.status(400).json({ error: error.message });
    }

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    next();
  });
}