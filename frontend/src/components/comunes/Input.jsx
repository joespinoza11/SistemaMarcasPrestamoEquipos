export default function Input({
  etiqueta,
  nombre,
  tipo = "text",
  placeholder = "",
  valor,
  onChange,
  requerido = false,
  error,
  disabled = false,
  min,
  max,
  step,
}) {
  return (
    <div className="mb-3">
      {etiqueta && <label className="form-label">{etiqueta}</label>}

      <input
        className={`form-control ${error ? "is-invalid" : ""}`}
        type={tipo}
        name={nombre}
        placeholder={placeholder}
        value={valor}
        onChange={onChange}
        required={requerido}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
      />

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

