import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrarUsuario } from "../../services/auth.service.js";
import { apiFetch } from "../../services/api.js";
import Input from "../../components/comunes/Input.jsx";
import Select from "../../components/comunes/Select.jsx";
import Button from "../../components/comunes/Button.jsx";
import Alert from "../../components/comunes/Alert.jsx";

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_CONTRASENA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const FORM_INICIAL = {
  nombreCompleto: "",
  fechaNacimiento: "",
  correo: "",
  username: "",
  contrasena: "",
  confirmacion: "",
  departamentoId: "",
};

export default function RegistroPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [exito, setExito] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [departamentos, setDepartamentos] = useState([]);

  useEffect(() => {
  async function cargarDepartamentos() {
    try {
      const data = await apiFetch("/departamentos");

      setDepartamentos(
        (data.departamentos || []).map((departamento) => ({
          value: departamento.id,
          label: departamento.nombre
        }))
      );

    } catch (error) {
      console.error(error);
      setErrorGeneral(
        "No se pudieron cargar los departamentos."
      );
    }
  }

  cargarDepartamentos();
}, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validar() {
    const nuevosErrores = {};

    if (!form.nombreCompleto.trim()) {
      nuevosErrores.nombreCompleto = "El nombre completo es obligatorio.";
    }

    if (!form.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    }

    if (!REGEX_CORREO.test(form.correo)) {
      nuevosErrores.correo = "El correo electrónico no es válido.";
    }

    if (!form.username.trim()) {
      nuevosErrores.username = "El nombre de usuario es obligatorio.";
    }

    if (!form.departamentoId) {
      nuevosErrores.departamentoId = "Debe seleccionar un departamento.";
    }

    if (!REGEX_CONTRASENA.test(form.contrasena)) {
      nuevosErrores.contrasena =
        "Mínimo 8 caracteres, con una mayúscula, una minúscula y un número.";
    }

    if (form.contrasena !== form.confirmacion) {
      nuevosErrores.confirmacion = "Las contraseñas no coinciden.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorGeneral("");
    setExito("");

    if (!validar()) return;

    setEnviando(true);

    try {
      await registrarUsuario(form);
      setExito("Cuenta creada correctamente. Ya puede iniciar sesión.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setErrorGeneral(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="auth-card">
          <div className="card-body p-4">
            <h1 className="h4 mb-4 text-center">
              <i className="bi bi-person-plus-fill me-2"></i>
              Crear cuenta
            </h1>

            <Alert tipo="danger" mensaje={errorGeneral} />
            <Alert tipo="success" mensaje={exito} />

            <form onSubmit={handleSubmit} noValidate>
              <Input
                etiqueta="Nombre completo"
                nombre="nombreCompleto"
                valor={form.nombreCompleto}
                onChange={handleChange}
                error={errores.nombreCompleto}
                requerido
              />

              <Input
                etiqueta="Fecha de nacimiento"
                nombre="fechaNacimiento"
                tipo="date"
                valor={form.fechaNacimiento}
                onChange={handleChange}
                error={errores.fechaNacimiento}
                requerido
              />

              <Input
                etiqueta="Correo electrónico"
                nombre="correo"
                tipo="email"
                valor={form.correo}
                onChange={handleChange}
                error={errores.correo}
                requerido
              />

              <Input
                etiqueta="Nombre de usuario"
                nombre="username"
                valor={form.username}
                onChange={handleChange}
                error={errores.username}
                requerido
              />

              <Select
                etiqueta="Departamento o carrera"
                nombre="departamentoId"
                valor={form.departamentoId}
                onChange={handleChange}
                opciones={departamentos}
                requerido
              />

              <Input
                etiqueta="Contraseña"
                nombre="contrasena"
                tipo="password"
                valor={form.contrasena}
                onChange={handleChange}
                error={errores.contrasena}
                requerido
              />

              <Input
                etiqueta="Confirmar contraseña"
                nombre="confirmacion"
                tipo="password"
                valor={form.confirmacion}
                onChange={handleChange}
                error={errores.confirmacion}
                requerido
              />

              <Button
                texto={enviando ? "Creando cuenta..." : "Registrarse"}
                boton="submit"
                anchoCompleto
                deshabilitado={enviando}
              />
            </form>

            <p className="text-center small mt-3">
              ¿Ya tiene cuenta? <Link to="/login">Iniciar sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}