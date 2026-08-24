import Table from "../comunes/Table.jsx";

const COLUMNAS = [
  { key: "usuario", label: "Usuario" },
  { key: "departamento", label: "Departamento" },
  { key: "fecha", label: "Fecha" },
  {
    key: "hora_entrada",
    label: "Entrada",
    render: (fila) =>
      fila.hora_entrada ? (
        <span className="text-success">
          <i className="bi bi-box-arrow-in-right me-1"></i>
          {fila.hora_entrada}
        </span>
      ) : (
        <span className="text-muted">Sin registro</span>
      ),
  },
  {
    key: "hora_salida",
    label: "Salida",
    render: (fila) =>
      fila.hora_salida ? (
        <span className="text-secondary">
          <i className="bi bi-box-arrow-right me-1"></i>
          {fila.hora_salida}
        </span>
      ) : (
        <span className="text-muted">Sin registro</span>
      ),
  },
  {
    key: "dispositivo",
    label: "Dispositivo",
    render: (fila) => fila.dispositivo || <span className="text-muted">No disponible</span>,
  },
  { key: "ip", label: "Dirección IP" },
];

export default function TablaReporteMarcas({ marcas = [] }) {
  const datos = marcas.map((marca) => ({
    ...marca,
    id: `${marca.usuario_id}-${marca.fecha}`,
  }));

  return <Table columnas={COLUMNAS} datos={datos} />;
}
