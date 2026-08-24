export default function Button({
  texto,
  tipo = "primary",
  boton = "button",
  onClick,
  deshabilitado = false,
  anchoCompleto = false,
  icono,
  tamano,
}) {
  return (
    <button
      type={boton}
      className={`btn btn-${tipo} ${anchoCompleto ? "w-100" : ""} ${
        tamano ? `btn-${tamano}` : ""
      }`}
      onClick={onClick}
      disabled={deshabilitado}
    >
      {icono && <i className={`bi ${icono} me-1`}></i>}
      {texto}
    </button>
  );
}
