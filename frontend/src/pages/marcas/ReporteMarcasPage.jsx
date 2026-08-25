import { useEffect, useState } from "react";
import FiltrosMarcas from "../../components/marcas/FiltrosMarcas.jsx";
import TablaReporteMarcas from "../../components/marcas/TablaReporteMarcas.jsx";
import Pagination from "../../components/comunes/Pagination.jsx";
import Loading from "../../components/comunes/Loading.jsx";
import Alert from "../../components/comunes/Alert.jsx";
import Button from "../../components/comunes/Button.jsx";
import { obtenerReporte, exportarReporte } from "../../services/marca.service.js";
import { descargarArchivo, nombreReporte } from "../../utils/marca.util.js";

const POR_PAGINA = 10;

export default function ReporteMarcasPage() {
  const [marcas, setMarcas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [pagina, setPagina] = useState(1);
  const [filtros, setFiltros] = useState({});
  const [exportando, setExportando] = useState("");

  async function cargar(nuevosFiltros = {}) {
    setCargando(true);
    setError("");
    setFiltros(nuevosFiltros);

    try {
      const data = await obtenerReporte(nuevosFiltros);
      setMarcas(data.marcas || []);
      setPagina(1);
    } catch (err) {
      setError(err.message);
      setMarcas([]);
      setPagina(1);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
  }, []);

  async function exportar(formato) {
    setError("");
    setExportando(formato);

    try {
      const blob = await exportarReporte(formato, filtros);
      descargarArchivo(blob, nombreReporte(formato));
    } catch (err) {
      setError(err.message);
    } finally {
      setExportando("");
    }
  }

  const totalPaginas = Math.max(1, Math.ceil(marcas.length / POR_PAGINA));
  const inicio = (pagina - 1) * POR_PAGINA;
  const marcasPagina = marcas.slice(inicio, inicio + POR_PAGINA);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h1 className="h4 mb-0">
          <i className="bi bi-file-earmark-text me-2"></i>
          Reporte de marcas
        </h1>

        <div className="d-flex gap-2">
          <Button
            texto={exportando === "json" ? "Generando..." : "JSON"}
            tipo="outline-secondary"
            icono="bi-filetype-json"
            tamano="sm"
            onClick={() => exportar("json")}
            deshabilitado={exportando !== "" || marcas.length === 0}
          />
          <Button
            texto={exportando === "xml" ? "Generando..." : "XML"}
            tipo="outline-secondary"
            icono="bi-filetype-xml"
            tamano="sm"
            onClick={() => exportar("xml")}
            deshabilitado={exportando !== "" || marcas.length === 0}
          />
          <Button
            texto={exportando === "pdf" ? "Generando..." : "PDF"}
            tipo="outline-danger"
            icono="bi-filetype-pdf"
            tamano="sm"
            onClick={() => exportar("pdf")}
            deshabilitado={exportando !== "" || marcas.length === 0}
          />
        </div>
      </div>

      <FiltrosMarcas onFiltrar={cargar} />

      <Alert tipo="danger" mensaje={error} />

      {cargando ? (
        <Loading mensaje="Cargando reporte de marcas..." />
      ) : (
        <>
          <div className="text-muted small mb-2">
            {marcas.length} registro{marcas.length === 1 ? "" : "s"} encontrado
            {marcas.length === 1 ? "" : "s"}
          </div>

          <TablaReporteMarcas marcas={marcasPagina} />

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
