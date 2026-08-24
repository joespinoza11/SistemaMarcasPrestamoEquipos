import Table from "../comunes/Table.jsx";
import FormularioDepartamento from "./FormularioDepartamento.jsx";
import BotonEliminarDepartamento from "./BotonEliminarDepartamento.jsx";

export default function TablaDepartamentos({ departamentos, onGuardado, onEliminar }) {
  const columnas = [
    { key: "nombre", label: "Nombre" },
    {
      key: "encargado",
      label: "Encargado",
      render: (fila) => fila.encargado || "—",
    },
    {
      key: "descripcion",
      label: "Descripción",
      render: (fila) => fila.descripcion || "—",
    },
  ];

  return (
    <Table
      columnas={columnas}
      datos={departamentos}
      acciones={(fila) => (
        <div className="d-flex gap-2">
          <FormularioDepartamento departamento={fila} onGuardado={onGuardado} />
          <BotonEliminarDepartamento departamento={fila} onConfirmar={onEliminar} />
        </div>
      )}
    />
  );
}
