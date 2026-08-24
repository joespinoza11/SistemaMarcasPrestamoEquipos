import { useLocation, Link } from "react-router-dom";
import Button from "../components/comunes/Button.jsx";

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="text-center mt-5">
      <i className="bi bi-signpost-2 display-1 text-secondary"></i>

      <h1 className="mt-3">Página no encontrada</h1>

      <p className="lead text-muted">
        La dirección <code>{location.pathname}</code> no corresponde a ninguna
        sección del sistema.
      </p>

      <div className="mt-4">
        <Link to="/">
          <Button texto="Volver al inicio" icono="bi-house" />
        </Link>
      </div>
    </div>
  );
}