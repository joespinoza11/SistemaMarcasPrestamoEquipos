import { useEffect, useState } from "react";
import Input from "../../components/comunes/Input.jsx";
import Select from "../../components/comunes/Select.jsx";
import Button from "../../components/comunes/Button.jsx";
import Alert from "../../components/comunes/Alert.jsx";
import Loading from "../../components/comunes/Loading.jsx";
import { obtenerPerfil, actualizarPerfil, cambiarPassword } from "../../services/usuario.service.js";
import { listarDepartamentos } from "../../services/departamento.service.js";

const REGEX_CONTRASENA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const FORM_PASSWORD_INICIAL = {
  contrasenaActual: "",
  nuevaContrasena: "",
  confirmacion: "",
};

export default function PerfilPage() {
  const [perfil, setPerfil] = useState(null);
  const [departamentos, setDepartamentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const [form, setForm] = useState({
    nombreCompleto: "",
    fechaNacimiento: "",
    departamentoId: "",
  });
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [errorPerfil, setErrorPerfil] = useState("");
  const [exitoPerfil, setExitoPerfil] = useState("");

  const [passwordForm, setPasswordForm] = useState(FORM_PASSWORD_INICIAL);
  const [guardandoPassword, setGuardandoPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState("");
  const [exitoPassword, setExitoPassword] = useState("");

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      setErrorCarga("");

      try {
        const [datosPerfil, datosDepartamentos] = await Promise.all([
          obtenerPerfil(),
          listarDepartamentos(),
        ]);

        setPerfil(datosPerfil.usuario);
        setDepartamentos(
          (datosDepartamentos.departamentos || []).map((d) => ({
            value: d.id,
            label: d.nombre,
          })),
        );
        setForm({
          nombreCompleto: datosPerfil.usuario.nombre_completo || "",
          fechaNacimiento: String(datosPerfil.usuario.fecha_nacimiento || "").slice(0, 10),
          departamentoId: datosPerfil.usuario.departamento_id || "",
        });
      } catch (err) {
        setErrorCarga(err.message);
      } finally {
        setCargando(false);
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmitPerfil(e) {
    e.preventDefault();
    setErrorPerfil("");
    setExitoPerfil("");

    if (!form.nombreCompleto.trim()) {
      setErrorPerfil("El nombre completo es obligatorio.");
      return;
    }

    if (!form.fechaNacimiento) {
      setErrorPerfil("La fecha de nacimiento es obligatoria.");
      return;
    }

    if (!form.departamentoId) {
      setErrorPerfil("Debe seleccionar un departamento o carrera.");
      return;
    }

    setGuardandoPerfil(true);

    try {
      const data = await actualizarPerfil(form);
      setPerfil(data.usuario);
      setExitoPerfil(data.mensaje || "Perfil actualizado correctamente.");
    } catch (err) {
      setErrorPerfil(err.message);
    } finally {
      setGuardandoPerfil(false);
    }
  }

  function handleChangePassword(e) {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  }

  async function handleSubmitPassword(e) {
    e.preventDefault();
    setErrorPassword("");
    setExitoPassword("");

    if (!passwordForm.contrasenaActual) {
      setErrorPassword("Debe ingresar su contraseña actual.");
      return;
    }

    if (!REGEX_CONTRASENA.test(passwordForm.nuevaContrasena)) {
      setErrorPassword(
        "La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.",
      );
      return;
    }

    if (passwordForm.nuevaContrasena !== passwordForm.confirmacion) {
      setErrorPassword("Las contraseñas no coinciden.");
      return;
    }

    setGuardandoPassword(true);

    try {
      const data = await cambiarPassword(passwordForm);
      setExitoPassword(data.mensaje || "Contraseña actualizada correctamente.");
      setPasswordForm(FORM_PASSWORD_INICIAL);
    } catch (err) {
      setErrorPassword(err.message);
    } finally {
      setGuardandoPassword(false);
    }
  }

  if (cargando) return <Loading />;
  if (errorCarga && !perfil) return <Alert tipo="danger" mensaje={errorCarga} />;

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <h1 className="h4 mb-4">
          <i className="bi bi-person-circle me-2"></i>
          Mi perfil
        </h1>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h6 text-muted mb-3">
              Usuario: <strong>{perfil.username}</strong> &middot; Correo:{" "}
              <strong>{perfil.correo}</strong> &middot; Rol:{" "}
              <strong>{perfil.rol}</strong>
            </h2>

            <div className="form-text mb-3">
              <i className="bi bi-lock me-1"></i>
              El usuario y el correo no se pueden modificar.
            </div>

            <form onSubmit={handleSubmitPerfil}>
              <Alert tipo="danger" mensaje={errorPerfil} />
              <Alert tipo="success" mensaje={exitoPerfil} />

              <Input
                etiqueta="Nombre completo"
                nombre="nombreCompleto"
                valor={form.nombreCompleto}
                onChange={handleChange}
                requerido
              />

              <Input
                etiqueta="Fecha de nacimiento"
                nombre="fechaNacimiento"
                tipo="date"
                valor={form.fechaNacimiento}
                onChange={handleChange}
                requerido
              />

              <Select
                etiqueta="Departamento o carrera"
                nombre="departamentoId"
                valor={form.departamentoId}
                opciones={departamentos}
                onChange={handleChange}
                requerido
              />

              <Button
                texto={guardandoPerfil ? "Guardando..." : "Guardar cambios"}
                boton="submit"
                icono="bi-check-lg"
                deshabilitado={guardandoPerfil}
              />
            </form>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h6 mb-3">
              <i className="bi bi-shield-lock me-2"></i>
              Cambiar contraseña
            </h2>

            <form onSubmit={handleSubmitPassword}>
              <Alert tipo="danger" mensaje={errorPassword} />
              <Alert tipo="success" mensaje={exitoPassword} />

              <Input
                etiqueta="Contraseña actual"
                nombre="contrasenaActual"
                tipo="password"
                valor={passwordForm.contrasenaActual}
                onChange={handleChangePassword}
                requerido
              />

              <Input
                etiqueta="Nueva contraseña"
                nombre="nuevaContrasena"
                tipo="password"
                valor={passwordForm.nuevaContrasena}
                onChange={handleChangePassword}
                requerido
              />

              <Input
                etiqueta="Confirmar nueva contraseña"
                nombre="confirmacion"
                tipo="password"
                valor={passwordForm.confirmacion}
                onChange={handleChangePassword}
                requerido
              />

              <div className="form-text mb-3">
                Mínimo 8 caracteres, con una mayúscula, una minúscula y un número.
              </div>

              <Button
                texto={guardandoPassword ? "Guardando..." : "Cambiar contraseña"}
                boton="submit"
                tipo="warning"
                icono="bi-key"
                deshabilitado={guardandoPassword}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
