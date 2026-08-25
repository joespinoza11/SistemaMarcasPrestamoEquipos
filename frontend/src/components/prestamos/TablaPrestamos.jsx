import { Link } from "react-router-dom";
import Table from "../comunes/Table.jsx";
import Badge from "../comunes/Badge.jsx";
import { formatearFecha } from "../../utils/fechas.util.js";

export default function TablaPrestamos({ prestamos }) {
  const columnas = [
    { key: "id", label: "#" },
    { key: "usuario_nombre", label: "Usuario" },
    { key: "encargado_nombre", label: "Encargado" },
    {
      key: "fecha",
      label: "Fecha",
      render: (fila) => formatearFecha(fila.fecha),
    },
    {
      key: "estado",
      label: "Estado",
      render: (fila) => <Badge estado={fila.estado} />,
    },
  ];

  return (
    <Table
      columnas={columnas}
      datos={prestamos}
      acciones={(fila) => (
        <Link to={`/prestamos/${fila.id}`} className="btn btn-outline-primary btn-sm">
          <i className="bi bi-eye me-1"></i>
          Ver detalle
        </Link>
      )}
    />
  );
}

