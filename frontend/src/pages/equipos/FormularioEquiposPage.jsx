import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import Input from "../../components/comunes/Input";
import Textarea from "../../components/comunes/Textarea";
import Button from "../../components/comunes/Button";
import Alert from "../../components/comunes/Alert";
import Loading from "../../components/comunes/Loading";

import {
  obtenerEquipo,
  crearEquipo,
  actualizarEquipo,
} from "../../services/equipo.service.js";

const BASE_UPLOADS =
  (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(
    "/api",
    "",
  ) + "/uploads/equipos/";

export default function FormularioEquipoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [codigo, setCodigo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenActual, setImagenActual] = useState(null);
  const [archivoImagen, setArchivoImagen] = useState(null);

  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!esEdicion) return;

    async function cargarEquipo() {
      setCargando(true);
      setError("");

      try {
        const data = await obtenerEquipo(id);
        setCodigo(data.equipo.codigo);
        setDescripcion(data.equipo.descripcion);
        setImagenActual(data.equipo.imagen);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargarEquipo();
  }, [id, esEdicion]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setGuardando(true);

    const formData = new FormData();
    formData.append("codigo", codigo);
    formData.append("descripcion", descripcion);

    if (archivoImagen) {
      formData.append("imagen", archivoImagen);
    }

    try {
      if (esEdicion) {
        await actualizarEquipo(id, formData);
      } else {
        await crearEquipo(formData);
      }

      navigate("/equipos");
    } catch (err) {
      setError(err.message);
      setGuardando(false);
    }
  }

  if (cargando) {
    return <Loading />;
  }

  return (
    <div>
      <h2 className="mb-4">
        <i
          className={`bi ${esEdicion ? "bi-pencil-square" : "bi-plus-circle"} me-2`}
        ></i>
        {esEdicion ? "Editar equipo" : "Nuevo equipo"}
      </h2>

      <Alert tipo="danger" mensaje={error} />

      <form onSubmit={handleSubmit} className="col-md-6">
        <Input
          etiqueta="Código"
          nombre="codigo"
          valor={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Ej. EQ-001"
          requerido
        />

        <Textarea
          etiqueta="Descripción"
          nombre="descripcion"
          valor={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Ej. Laptop HP ProBook 440"
          requerido
        />

        {esEdicion && imagenActual && !archivoImagen && (
          <div className="mb-3">
            <label className="form-label d-block">Imagen actual</label>
            <img
              src={`${BASE_UPLOADS}${imagenActual}`}
              alt={codigo}
              width="120"
              style={{ borderRadius: "4px" }}
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">
            {esEdicion ? "Reemplazar imagen (opcional)" : "Imagen"}
          </label>
          <input
            type="file"
            className="form-control"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setArchivoImagen(e.target.files[0] ?? null)}
          />
        </div>

        <div className="d-flex gap-2 mt-4">
          <Button
            texto={guardando ? "Guardando..." : "Guardar"}
            tipo="primary"
            boton="submit"
            deshabilitado={guardando}
            icono="bi-check-lg"
          />

          <Link to="/equipos">
            <Button texto="Cancelar" tipo="outline-secondary" />
          </Link>
        </div>
      </form>
    </div>
  );
}
