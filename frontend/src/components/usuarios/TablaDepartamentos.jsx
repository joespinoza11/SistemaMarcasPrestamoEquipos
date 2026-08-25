import Table from "../comunes/Table.jsx";
import FormularioDepartamento from "./FormularioDepartamento.jsx";
import BotonEliminarDepartamento from "./BotonEliminarDepartamento.jsx";

export default function TablaDepartamentos({ departamentos, usuarios, onGuardado, onEliminar }) {
  const nombresRegistrados = (usuarios || []).map((u) => u.nombre_completo);

  const columnas = [
    { key: "nombre", label: "Nombre" },
    {
      key: "encargado",
      label: "Encargado",
      render: (fila) => {
        if (!fila.encargado) return "—";

        const esUsuarioRegistrado = nombresRegistrados.includes(fila.encargado);

        return (
          <>
            {fila.encargado}
            {!esUsuarioRegistrado && (
              <span
                className="badge text-bg-secondary ms-2"
                title="Este nombre no coincide con ningún usuario registrado actualmente"
              >
                Sin cuenta
              </span>
            )}
          </>
        );
      },
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
          <FormularioDepartamento departamento={fila} usuarios={usuarios} onGuardado={onGuardado} />
          <BotonEliminarDepartamento departamento={fila} onConfirmar={onEliminar} />
        </div>
      )}
    />
  );
}
