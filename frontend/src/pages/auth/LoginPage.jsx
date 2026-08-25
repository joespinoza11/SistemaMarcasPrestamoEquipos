import { useState } from "react";
import {useNavigate,useLocation,Link} from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";
import Input from "../../components/comunes/Input.jsx";
import Button from "../../components/comunes/Button.jsx";
import Alert from "../../components/comunes/Alert.jsx";

export default function LoginPage() {

  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    usuario: "",
    contrasena: ""
  });

  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);


  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }


  async function handleSubmit(e) {

    e.preventDefault();

    setError("");


    if (
      !form.usuario.trim() ||
      !form.contrasena
    ) {

      setError(
        "Debe completar usuario/correo y contraseña."
      );

      return;
    }


    setEnviando(true);


    try {

      const data =
        await login(form);


      const destinoAnterior =
        location.state?.from?.pathname;


      if (destinoAnterior) {

        navigate(
          destinoAnterior,
          {
            replace: true
          }
        );

        return;
      }

      if (
        data.usuario.rol === "administrador") {

        navigate("/prestamos",{replace: true}

        );

      } else {

        navigate("/marcas",{replace: true}
        );
      }

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

              <i className="bi bi-box-arrow-in-right me-2"></i>

              Iniciar sesión

            </h1>


            <Alert
              tipo="danger"
              mensaje={error}
            />


            <form onSubmit={handleSubmit}>

              <Input
                etiqueta="Usuario o correo"
                nombre="usuario"
                valor={form.usuario}
                onChange={handleChange}
                requerido
              />


              <Input
                etiqueta="Contraseña"
                nombre="contrasena"
                tipo="password"
                valor={form.contrasena}
                onChange={handleChange}
                requerido
              />


              <Button
                texto={
                  enviando
                    ? "Ingresando..." : "Ingresar"
                }
                boton="submit"
                anchoCompleto
                deshabilitado={enviando}
              />

            </form>

            <div className="d-flex justify-content-between mt-3">

              <Link
                to="/recuperar-password"
                className="small"
              >
                ¿Olvidó su contraseña?
              </Link>

              <Link
                to="/registro"
                className="small"
              >
                Crear cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}