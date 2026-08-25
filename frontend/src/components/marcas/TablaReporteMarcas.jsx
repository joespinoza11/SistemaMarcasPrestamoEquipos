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
    key: "dispositivo_entrada",
    label: "Disp. entrada",
    render: (fila) =>
      fila.dispositivo_entrada ? (
        <span title={fila.ip_entrada ? `IP: ${fila.ip_entrada}` : undefined}>
          {fila.dispositivo_entrada}
        </span>
      ) : (
        <span className="text-muted">—</span>
      ),
  },
  {
    key: "dispositivo_salida",
    label: "Disp. salida",
    render: (fila) =>
      fila.dispositivo_salida ? (
        <span title={fila.ip_salida ? `IP: ${fila.ip_salida}` : undefined}>
          {fila.dispositivo_salida}
        </span>
      ) : (
        <span className="text-muted">—</span>
      ),
  },
];

export default function TablaReporteMarcas({ marcas = [] }) {
  const datos = marcas.map((marca) => ({
    ...marca,
    id: `${marca.usuario_id}-${marca.fecha}`,
  }));

  return <Table columnas={COLUMNAS} datos={datos} />;
}
