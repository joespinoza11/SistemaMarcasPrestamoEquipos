import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FiltrosPrestamos from "../../components/prestamos/FiltrosPrestamos.jsx";
import TablaPrestamos from "../../components/prestamos/TablaPrestamos.jsx";
import Pagination from "../../components/comunes/Pagination.jsx";
import Loading from "../../components/comunes/Loading.jsx";
import Alert from "../../components/comunes/Alert.jsx";
import Button from "../../components/comunes/Button.jsx";
import { listarPrestamos } from "../../services/prestamo.service.js";

const POR_PAGINA = 10;

export default function HistorialPrestamosPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [pagina, setPagina] = useState(1);

  async function cargar(filtros = {}) {
    setCargando(true);
    setError("");

    try {
      const data = await listarPrestamos(filtros);
      setPrestamos(data.prestamos || []);
      setPagina(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
  }, []);

  const totalPaginas = Math.max(1, Math.ceil(prestamos.length / POR_PAGINA));
  const inicio = (pagina - 1) * POR_PAGINA;
  const prestamosPagina = prestamos.slice(inicio, inicio + POR_PAGINA);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 mb-0">
          <i className="bi bi-clock-history me-2"></i>
          Historial de préstamos
        </h1>

        <Link to="/prestamos/nuevo">
          <Button texto="Nuevo préstamo" icono="bi-plus-lg" />
        </Link>
      </div>

      <FiltrosPrestamos onFiltrar={cargar} />

      <Alert tipo="danger" mensaje={error} />

      {cargando ? (
        <Loading />
      ) : (
        <>
          <TablaPrestamos prestamos={prestamosPagina} />
          <Pagination
            paginaActual={pagina}
            totalPaginas={totalPaginas}
            cambiarPagina={setPagina}
          />
        </>
      )}
    </div>
  );
}
