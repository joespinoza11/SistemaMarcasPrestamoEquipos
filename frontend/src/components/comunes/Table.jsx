/**
 * Tabla genérica reutilizable entre módulos.
 *
 * columnas: [{ key: "estado", label: "Estado", render: (fila) => <Badge .../> }]
 *   - key: propiedad del objeto a mostrar
 *   - label: texto del encabezado
 *   - render: opcional, para columnas que no son texto plano (badges, fechas formateadas, etc.)
 *
 * datos: arreglo de objetos (las filas)
 * acciones: opcional, función (fila) => JSX con los botones de esa fila
 * idKey: nombre de la propiedad usada como key de React (por defecto "id")
 */
export default function Table({ columnas = [], datos = [], acciones, idKey = "id" }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-dark">
          <tr>
            {columnas.map((columna) => (
              <th key={columna.key}>{columna.label}</th>
            ))}

            {acciones && <th>Acciones</th>}
          </tr>
        </thead>

        <tbody>
          {datos.length > 0 ? (
            datos.map((fila) => (
              <tr key={fila[idKey]}>
                {columnas.map((columna) => (
                  <td key={columna.key}>
                    {columna.render ? columna.render(fila) : fila[columna.key]}
                  </td>
                ))}

                {acciones && <td>{acciones(fila)}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columnas.length + (acciones ? 1 : 0)} className="text-center">
                No hay registros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
