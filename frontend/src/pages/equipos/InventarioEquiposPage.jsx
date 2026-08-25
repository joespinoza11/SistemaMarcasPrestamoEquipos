import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Table from "../../components/comunes/Table";
import Badge from "../../components/comunes/Badge";
import Button from "../../components/comunes/Button";
import Alert from "../../components/comunes/Alert";
import Modal from "../../components/comunes/Modal";
import Loading from "../../components/comunes/Loading";
import { useAuth } from "../../context/AuthContext.jsx";

import {
  listarEquipos,
  eliminarEquipo,
  cambiarEstadoEquipo,
} from "../../services/equipo.service.js";

const ESTADOS = ["DISPONIBLE", "PRESTADO", "MANTENIMIENTO", "INACTIVO"];

const BASE_UPLOADS =
  (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(
    "/api",
    "",
  ) + "/uploads/equipos/";

export default function InventarioEquiposPage() {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === "administrador";

  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  async function cargarEquipos() {
    setCargando(true);
    setError("");

    try {
      const data = await listarEquipos();
      setEquipos(data.equipos);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarEquipos();
  }, []);

  async function handleEliminar() {
    if (!equipoSeleccionado) return;

    try {
      await eliminarEquipo(equipoSeleccionado.id);
      setMensaje("Equipo eliminado correctamente.");
      setError("");
      cargarEquipos();
    } catch (err) {
      setError(err.message);
      setMensaje("");
    }
  }

  async function handleCambiarEstado(equipo, nuevoEstado) {
    if (nuevoEstado === equipo.estado) return;

    try {
      await cambiarEstadoEquipo(equipo.id, nuevoEstado);
      setMensaje(`Estado de ${equipo.codigo} actualizado a ${nuevoEstado}.`);
      setError("");
      cargarEquipos();
    } catch (err) {
      setError(err.message);
      setMensaje("");
    }
  }

  const columnas = [
    {
      key: "imagen",
      label: "Imagen",
      render: (equipo) =>
        equipo.imagen ? (
          <img
            src={`${BASE_UPLOADS}${equipo.imagen}`}
            alt={equipo.codigo}
            width="50"
            height="50"
            style={{ objectFit: "cover", borderRadius: "4px" }}
          />
        ) : (
          <span className="text-muted">—</span>
        ),
    },
    { key: "codigo", label: "Código" },
    { key: "descripcion", label: "Descripción" },
    {
      key: "estado",
      label: "Estado",
      render: (equipo) => (
        <select
          className="form-select form-select-sm w-auto d-inline-block"
          value={equipo.estado}
          onChange={(e) => handleCambiarEstado(equipo, e.target.value)}
          disabled={!esAdmin}
        >
          {ESTADOS.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      ),
    },
  ];

  const acciones = (equipo) => (
    <div className="d-flex gap-2">
      {esAdmin ? (
        <Link to={`/equipos/${equipo.id}/editar`}>
          <Button
            texto="Editar"
            tipo="outline-primary"
            tamano="sm"
            icono="bi-pencil"
          />
        </Link>
      ) : (
        <Button
          texto="Editar"
          tipo="outline-primary"
          tamano="sm"
          icono="bi-pencil"
          deshabilitado
        />
      )}

      <Button
        texto="Eliminar"
        tipo="outline-danger"
        tamano="sm"
        data-bs-toggle={esAdmin ? "modal" : undefined}
        data-bs-target={esAdmin ? "#modalEliminarEquipo" : undefined}
        onClick={esAdmin ? () => setEquipoSeleccionado(equipo) : undefined}
        deshabilitado={!esAdmin}
      />
    </div>
  );

  if (cargando) {
    return <Loading />;
  }

  return (
    <div>
      <div className="page-header">
        <h2>
          <i className="bi bi-laptop me-2"></i>
          Inventario de equipos
        </h2>

        {esAdmin ? (
          <Link to="/equipos/nuevo">
            <Button texto="Nuevo equipo" tipo="primary" icono="bi-plus-lg" />
          </Link>
        ) : (
          <Button
            texto="Nuevo equipo"
            tipo="primary"
            icono="bi-plus-lg"
            deshabilitado
          />
        )}
      </div>

      <Alert tipo="success" mensaje={mensaje} />
      <Alert tipo="danger" mensaje={error} />

      <Table columnas={columnas} datos={equipos} acciones={acciones} />

      <Modal
        id="modalEliminarEquipo"
        titulo="Eliminar equipo"
        mensaje={`¿Seguro que querés eliminar el equipo "${equipoSeleccionado?.codigo}"? Esta acción no se puede deshacer.`}
        confirmar={handleEliminar}
        textoConfirmar="Eliminar"
      />
    </div>
  );
}
