import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Input from "../comunes/Input.jsx";
import Button from "../comunes/Button.jsx";
import Alert from "../comunes/Alert.jsx";
import Loading from "../comunes/Loading.jsx";
import { listarEquipos } from "../../services/equipo.service.js";

export default function FormularioPrestamo({ onSubmit, enviando }) {
  const [usuarioId, setUsuarioId] = useState("");
  const [equipos, setEquipos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarEquipos() {
      try {
        const data = await listarEquipos();
        setEquipos((data.equipos || []).filter((eq) => eq.estado === "DISPONIBLE"));
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarEquipos();
  }, []);

  function toggleEquipo(id) {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((equipoId) => equipoId !== id) : [...prev, id],
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!usuarioId || Number.isNaN(Number(usuarioId))) {
      setError("Debe indicar el ID numérico del usuario que recibe el préstamo.");
      return;
    }

    if (seleccionados.length === 0) {
      setError("Debe seleccionar al menos un equipo disponible.");
      return;
    }

    onSubmit({ usuarioId: Number(usuarioId), equipos: seleccionados });
  }

  if (cargando) {
    return <Loading mensaje="Cargando equipos disponibles..." />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Alert tipo="danger" mensaje={error} />

      <Input
        etiqueta="ID del usuario que recibe el préstamo"
        nombre="usuarioId"
        tipo="number"
        valor={usuarioId}
        onChange={(e) => setUsuarioId(e.target.value)}
        requerido
      />
      <div className="form-text mb-3">
        <i className="bi bi-info-circle me-1"></i>
        Temporal: hasta que el módulo de Usuarios tenga su listado (GET /api/usuarios), el
        ID se ingresa manualmente. Puede verlo en la tabla <code>usuarios</code> de
        phpMyAdmin o al registrar el usuario en <code>/registro</code>.
      </div>

      <label className="form-label">Equipos disponibles</label>

      {equipos.length === 0 ? (
        <div className="alert alert-info d-flex align-items-center justify-content-between">
          <span>
            <i className="bi bi-info-circle-fill me-2"></i>
            No hay equipos disponibles en este momento.
          </span>
          <Link to="/equipos" className="btn btn-outline-primary btn-sm">
            Ir al inventario
          </Link>
        </div>
      ) : (
        <div className="list-group mb-3">
          {equipos.map((equipo) => (
            <label
              key={equipo.id}
              className="list-group-item d-flex align-items-center gap-2"
            >
              <input
                type="checkbox"
                className="form-check-input"
                checked={seleccionados.includes(equipo.id)}
                onChange={() => toggleEquipo(equipo.id)}
                disabled={enviando}
              />
              <span>
                <strong>{equipo.codigo}</strong> &mdash; {equipo.descripcion}
              </span>
            </label>
          ))}
        </div>
      )}

      <Button
        texto={enviando ? "Registrando..." : "Registrar préstamo"}
        boton="submit"
        icono="bi-arrow-left-right"
        deshabilitado={enviando || equipos.length === 0}
      />
    </form>
  );
}