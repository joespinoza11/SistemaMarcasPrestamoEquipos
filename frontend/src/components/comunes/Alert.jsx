import { useEffect, useState } from "react";

const ICONOS = {
  success: "bi-check-circle-fill",
  danger: "bi-x-circle-fill",
  warning: "bi-exclamation-triangle-fill",
  info: "bi-info-circle-fill",
};

const DURACION_POR_TIPO = {
  success: 4000,
  info: 4000,
  warning: 5000,
  danger: 6000,
};

export default function Alert({ tipo = "info", mensaje, duracion }) {
  const [visible, setVisible] = useState(true);

  const duracionFinal = duracion ?? DURACION_POR_TIPO[tipo] ?? 4000;

  useEffect(() => {
    setVisible(true);

    if (!mensaje) return;

    const timer = setTimeout(() => setVisible(false), duracionFinal);

    return () => clearTimeout(timer);
  }, [mensaje, duracionFinal]);

  if (!mensaje || !visible) return null;

  return (
    <div
      className={`alert alert-${tipo} d-flex align-items-center gap-2`}
      role="alert"
    >
      <i className={`bi ${ICONOS[tipo] || ICONOS.info}`}></i>
      <span>{mensaje}</span>
    </div>
  );
}
