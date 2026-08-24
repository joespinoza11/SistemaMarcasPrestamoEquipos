export default function Select({
  etiqueta,
  nombre,
  valor,
  opciones = [],
  onChange,
  requerido = false,
  placeholder = "Seleccione una opción",
}) {
  return (
    <div className="mb-3">
      {etiqueta && <label className="form-label">{etiqueta}</label>}

      <select
        className="form-select"
        name={nombre}
        value={valor}
        onChange={onChange}
        required={requerido}
      >
        <option value="">{placeholder}</option>

        {opciones.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
    </div>
  );
}
