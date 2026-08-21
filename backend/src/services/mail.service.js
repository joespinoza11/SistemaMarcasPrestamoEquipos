import nodemailer from "nodemailer";


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
    `http://localhost:5173/restablecer-password?token=${token}`;


  await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to: correo,

    subject: "Recuperar contraseña",

    text:
      `Ingrese al siguiente enlace para restablecer su contraseña: ${enlace}`
  });
}