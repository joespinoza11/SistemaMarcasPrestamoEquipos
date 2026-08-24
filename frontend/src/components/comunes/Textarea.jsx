export default function Textarea({
  etiqueta,
  nombre,
  valor,
  onChange,
  placeholder = "",
  filas = 4,
  requerido = false,
}) {
  return (
    <div className="mb-3">
      {etiqueta && <label className="form-label">{etiqueta}</label>}

      <textarea
        className="form-control"
        name={nombre}
        rows={filas}
        value={valor}
        placeholder={placeholder}
        onChange={onChange}
        required={requerido}
      />
    </div>
  );
}
