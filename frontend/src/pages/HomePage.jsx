import { useAuth } from "../context/AuthContext.jsx";
import Loading from "../components/comunes/Loading.jsx";

export default function HomePage() {
  const { usuario, cargando, estaAutenticado } = useAuth();

  if (cargando) return <Loading mensaje="Verificando sesión..." />;

  return (
    <div className="text-center mt-5">
      <i className="bi bi-mortarboard-fill display-1 text-primary"></i>
      <h1 className="mt-3">Sistema de Marcas y Préstamo de Equipos</h1>

      {estaAutenticado ? (
        <p className="lead">
          Bienvenido/a, {usuario.nombreCompleto || usuario.username || "usuario"}.
        </p>
      ) : (
        <p className="lead">Iniciá sesión para acceder al sistema.</p>
      )}
    </div>
  );
}
