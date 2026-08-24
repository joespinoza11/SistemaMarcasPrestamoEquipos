const ICONOS = {
  success: "bi-check-circle-fill",
  danger: "bi-x-circle-fill",
  warning: "bi-exclamation-triangle-fill",
  info: "bi-info-circle-fill",
};

export default function Alert({ tipo = "info", mensaje }) {
  if (!mensaje) return null;

  return (
    <div className={`alert alert-${tipo} d-flex align-items-center gap-2`} role="alert">
      <i className={`bi ${ICONOS[tipo] || ICONOS.info}`}></i>
      <span>{mensaje}</span>
    </div>
  );
}
