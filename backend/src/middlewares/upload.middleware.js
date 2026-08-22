import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";

const DIRECTORIO_DESTINO = path.join(process.cwd(), "uploads", "equipos");

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];

const TAMANO_MAXIMO_BYTES =
  (Number(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024;

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

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: TAMANO_MAXIMO_BYTES },
});

// MIDDLEWARE LISTO PARA USAR EN LAS RUTAS
export function subirImagenEquipo(req, res, next) {
  const middleware = upload.single("imagen");

  middleware(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: `La imagen no debe superar los ${
            TAMANO_MAXIMO_BYTES / (1024 * 1024)
          } MB.`,
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
