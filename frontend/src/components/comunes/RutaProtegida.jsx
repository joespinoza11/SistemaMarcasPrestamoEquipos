import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Loading from "./Loading.jsx";

export default function RutaProtegida({ children, rolRequerido }) {
  const { usuario, cargando, estaAutenticado } = useAuth();
  const location = useLocation();

  if (cargando) {
    return <Loading />;
  }

  if (!estaAutenticado) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (rolRequerido && usuario?.rol !== rolRequerido) {
    return <Navigate to="/" replace />;
  }

  return children;
}
