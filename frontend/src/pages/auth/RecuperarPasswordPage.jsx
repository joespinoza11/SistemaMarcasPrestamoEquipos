import { useState } from "react";
import { Link } from "react-router-dom";
import { solicitarRecuperacion } from "../../services/auth.service.js";
import Input from "../../components/comunes/Input.jsx";
import Button from "../../components/comunes/Button.jsx";
import Alert from "../../components/comunes/Alert.jsx";

export default function RecuperarPasswordPage() {
  const [usuario, setUsuario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setMensaje("");

    if (!usuario.trim()) {
      setError(
        "Debe ingresar su usuario o correo electrónico."
      );
      return;
    }

    setEnviando(true);

    try {
      const data =
        await solicitarRecuperacion(usuario);

      if (data.enlace) {
        window.location.href = data.enlace;
        return;
      }

      setMensaje(data.mensaje);

    } catch (err) {

      setError(err.message);

    } finally {

      setEnviando(false);
    }
  }

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-12 col-md-6 col-lg-4">

        <div className="card shadow-sm">

          <div className="card-body p-4">

            <h1 className="h4 mb-4 text-center">

              <i className="bi bi-key-fill me-2"></i>

              Recuperar contraseña

            </h1>

            <Alert
              tipo="danger"
              mensaje={error}
            />

            <Alert
              tipo="success"
              mensaje={mensaje}
            />

            <form onSubmit={handleSubmit}>

              <Input
                etiqueta="Usuario o correo electrónico"
                nombre="usuario"
                valor={usuario}
                onChange={(e) =>
                  setUsuario(e.target.value)
                }
                requerido
              />

              <Button
                texto={
                  enviando
                    ? "Procesando..." : "Recuperar contraseña"
                }
                boton="submit"
                anchoCompleto
                deshabilitado={enviando}
              />

            </form>

            <p className="text-center small mt-3">

              <Link to="/login">
                Volver a iniciar sesión
              </Link>

            </p>

          </div>

        </div>

      </div>
    </div>
  );
}
