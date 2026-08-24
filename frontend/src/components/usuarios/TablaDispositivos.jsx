import Table from "../comunes/Table.jsx";
import Badge from "../comunes/Badge.jsx";
import FormularioDispositivo from "./FormularioDispositivo.jsx";
import BotonEliminarDispositivo from "./BotonEliminarDispositivo.jsx";

export default function TablaDispositivos({ dispositivos, dispositivoActualId, onGuardado, onEliminar }) {
  const columnas = [
    {
      key: "nombre",
      label: "Dispositivo",
      render: (fila) => (
        <>
          {fila.nombre}
          {fila.identificador_unico === dispositivoActualId && (
            <span className="badge text-bg-primary ms-2">
              <i className="bi bi-check-circle me-1"></i>
              Este dispositivo
            </span>
          )}
        </>
      ),
    },
    {
      key: "descripcion",
      label: "Descripción",
      render: (fila) => fila.descripcion || "—",
    },
    {
      key: "estado",
      label: "Estado",
      render: (fila) => <Badge estado={fila.estado} />,
    },
    {
      key: "fecha_registro",
      label: "Registrado",
      render: (fila) => new Date(fila.fecha_registro).toLocaleDateString(),
    },
  ];

  return (
    <Table
      columnas={columnas}
      datos={dispositivos}
      acciones={(fila) => (
        <div className="d-flex gap-2">
          <FormularioDispositivo dispositivo={fila} onGuardado={onGuardado} />

          {fila.estado === "ACTIVO" && (
            <BotonEliminarDispositivo dispositivo={fila} onConfirmar={onEliminar} />
          )}
        </div>
      )}
    />
  );
}
