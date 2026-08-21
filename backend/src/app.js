import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";

import authRoutes from "./modules/auth/auth.routes.js";

dotenv.config();

const NAME = process.env.SERVER_NAME;
const PORT = process.env.SERVER_PORT || 3000;

const app = express();


app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);


app.use(express.json());



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



app.use("/api/auth",authRoutes);


app.listen(PORT, () => {

  console.log(
    `${NAME} ejecutándose en http://localhost:${PORT}`
  );
});