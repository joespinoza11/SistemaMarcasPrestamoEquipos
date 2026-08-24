import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import path from "path";

import authRoutes from "./modules/auth/auth.routes.js";
import equipoRoutes from "./modules/equipos/equipo.routes.js";
import configuracionRoutes from "./modules/configuracion/configuracion.routes.js";
import prestamoRoutes from "./modules/prestamos/prestamo.routes.js";

import { rutaNoEncontrada } from "./middlewares/error.middleware.js";

dotenv.config();

const NAME = process.env.SERVER_NAME || "Sistema de Marcas y Préstamo de Equipos";
const PORT = process.env.PORT || 4000;

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 60 * 60 * 1000
    }
  })
);

app.get("/", (req, res) => {

  res.json({
    nombre: NAME,
    estado: "Servidor funcionando correctamente"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/equipos", equipoRoutes);
app.use("/api/configuracion", configuracionRoutes);
app.use("/api/prestamos", prestamoRoutes);

app.use(rutaNoEncontrada);

app.listen(PORT, () => {

  console.log(
    `${NAME} ejecutándose en http://localhost:${PORT}`
  );
});