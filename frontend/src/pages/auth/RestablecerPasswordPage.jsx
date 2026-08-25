import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { restablecerContrasena } from "../../services/auth.service.js";
import Input from "../../components/comunes/Input.jsx";
import Button from "../../components/comunes/Button.jsx";
import Alert from "../../components/comunes/Alert.jsx";

const REGEX_CONTRASENA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function RestablecerPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [form, setForm] = useState({ nuevaContrasena: "", confirmacion: "" });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [enviando, setEnviando] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setExito("");

    if (!token) {
      setError("El enlace no incluye un token válido.");
      return;
    }

    if (!REGEX_CONTRASENA.test(form.nuevaContrasena)) {
      setError("Mínimo 8 caracteres, con una mayúscula, una minúscula y un número.");
      return;
    }

    if (form.nuevaContrasena !== form.confirmacion) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setEnviando(true);

    try {
      const data = await restablecerContrasena({ token, ...form });
      setExito(data.mensaje);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="col-12 col-md-6 col-lg-4">
        <div className="auth-card">
          <div className="card-body p-4">
            <h1 className="h4 mb-4 text-center">
              <i className="bi bi-shield-lock-fill me-2"></i>
              Restablecer contraseña
            </h1>

            {!token && (
              <Alert
                tipo="warning"
                mensaje="Este enlace no es válido. Solicite uno nuevo desde 'Olvidó su contraseña'."
              />
            )}

            <Alert tipo="danger" mensaje={error} />
            <Alert tipo="success" mensaje={exito} />

            <form onSubmit={handleSubmit}>
              <Input
                etiqueta="Nueva contraseña"
                nombre="nuevaContrasena"
                tipo="password"
                valor={form.nuevaContrasena}
                onChange={handleChange}
                requerido
                disabled={!token}
              />

              <Input
                etiqueta="Confirmar nueva contraseña"
                nombre="confirmacion"
                tipo="password"
                valor={form.confirmacion}
                onChange={handleChange}
                requerido
                disabled={!token}
              />

              <Button
                texto={enviando ? "Guardando..." : "Restablecer contraseña"}
                boton="submit"
                anchoCompleto
                deshabilitado={enviando || !token}
              />
            </form>

            <p className="text-center small mt-3">
              <Link to="/login">Volver a iniciar sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}