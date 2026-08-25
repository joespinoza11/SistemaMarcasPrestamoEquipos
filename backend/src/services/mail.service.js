import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); 


const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});


export async function enviarCorreoRecuperacion(
  correo,
  token
) {

  const enlace =
  `${process.env.FRONTEND_URL}/restablecer-password?token=${token}`;


  await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to: correo,

    subject: "Recuperar contraseña",

    text:
      `Ingrese al siguiente enlace para restablecer su contraseña: ${enlace}`
  });
}