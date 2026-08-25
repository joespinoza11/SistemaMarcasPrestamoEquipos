export default function Table({ columnas = [], datos = [], acciones, idKey = "id" }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            {columnas.map((columna) => <th key={columna.key}>{columna.label}</th>)}
            {acciones && <th className="text-end">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {datos.length > 0 ? (
            datos.map((fila) => (
              <tr key={fila[idKey]}>
                {columnas.map((columna) => <td key={columna.key}>{columna.render ? columna.render(fila) : fila[columna.key]}</td>)}
                {acciones && <td className="text-end">{acciones(fila)}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columnas.length + (acciones ? 1 : 0)}>
                <div className="app-empty">
                  <div className="app-empty-icon"><i className="bi bi-inbox"></i></div>
                  <div className="fw-semibold">No hay registros</div>
                  <small>La información aparecerá aquí cuando exista.</small>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}