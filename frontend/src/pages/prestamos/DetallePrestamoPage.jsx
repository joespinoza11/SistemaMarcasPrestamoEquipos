import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/comunes/Loading.jsx";
import Alert from "../../components/comunes/Alert.jsx";
import Badge from "../../components/comunes/Badge.jsx";
import Button from "../../components/comunes/Button.jsx";
import BotonDevolucion from "../../components/prestamos/BotonDevolucion.jsx";
import {
  obtenerPrestamo,
  devolverEquipo,
  devolverPrestamoCompleto,
} from "../../services/prestamo.service.js";
import { formatearFecha, formatearFechaHora } from "../../utils/fechas.util.js";

export default function DetallePrestamoPage() {
  const { id } = useParams();
  const [prestamo, setPrestamo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [procesando, setProcesando] = useState(false);

  async function cargar() {
    setCargando(true);
    setError("");

    try {
      const data = await obtenerPrestamo(id);
      setPrestamo(data.prestamo);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, [id]);

  async function handleDevolverUno(equipoId) {
    setError("");
    setMensaje("");
    setProcesando(true);

    try {
      const data = await devolverEquipo(id, equipoId);
      setPrestamo(data.prestamo);
      setMensaje(data.mensaje);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
    }
  }

  async function handleDevolverTodo() {
    setError("");
    setMensaje("");
    setProcesando(true);

    try {
      const data = await devolverPrestamoCompleto(id);
      setPrestamo(data.prestamo);
      setMensaje(data.mensaje);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
    }
  }

  if (cargando) return <Loading />;
  if (error && !prestamo) return <Alert tipo="danger" mensaje={error} />;
  if (!prestamo) return null;

  const hayPendientes = prestamo.equipos?.some(
    (eq) => eq.estado_devolucion === "PENDIENTE",
  );

  return (
    <div>
      <h1 className="h4 mb-4">
        <i className="bi bi-card-list me-2"></i>
        Préstamo #{prestamo.id}
      </h1>

      <Alert tipo="danger" mensaje={error} />
      <Alert tipo="success" mensaje={mensaje} />

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <strong>Usuario:</strong> {prestamo.usuario_nombre}
            </div>
            <div className="col-md-3">
              <strong>Encargado:</strong> {prestamo.encargado_nombre}
            </div>
            <div className="col-md-3">
              <strong>Fecha:</strong> {formatearFecha(prestamo.fecha)}
            </div>
            <div className="col-md-3">
              <strong>Estado:</strong> <Badge estado={prestamo.estado} />
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Equipos del préstamo</h2>

        {hayPendientes && (
          <Button
            texto={procesando ? "Procesando..." : "Devolver todos"}
            tipo="success"
            icono="bi-check2-all"
            onClick={handleDevolverTodo}
            deshabilitado={procesando}
          />
        )}
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Fecha devolución</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {prestamo.equipos?.map((equipo) => (
              <tr key={equipo.id}>
                <td>{equipo.codigo}</td>
                <td>{equipo.descripcion}</td>
                <td>
                  <Badge estado={equipo.estado_devolucion} />
                </td>
                <td>{formatearFechaHora(equipo.fecha_devolucion)}</td>
                <td>
                  {equipo.estado_devolucion === "PENDIENTE" &&
                  prestamo.estado !== "FINALIZADO" ? (
                    <BotonDevolucion equipo={equipo} onConfirmar={handleDevolverUno} />
                  ) : (
                    <span className="text-muted small">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

