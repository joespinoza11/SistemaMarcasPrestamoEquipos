import { Link, useLocation } from "react-router-dom";

/**
 * Navbar global de la aplicación.
 *
 * Recibe `usuario` y `onLogout` como props opcionales: por ahora
 * (mientras no existe AuthContext) se pueden dejar sin pasar y la
 * navbar simplemente no muestra el bloque de sesión. Cuando se
 * construya el módulo de Auth, App.jsx pasará estos props leyéndolos
 * del AuthContext, sin necesidad de tocar este archivo.
 */
export default function Navbar({ usuario, onLogout }) {
  const location = useLocation();

  const enlaceActivo = (ruta) => location.pathname.startsWith(ruta);

  const NavLink = ({ to, icono, children }) => (
    <li className="nav-item">
      <Link
        className={`nav-link ${enlaceActivo(to) ? "active fw-bold" : ""}`}
        to={to}
      >
        <i className={`bi ${icono} me-1`}></i>
        {children}
      </Link>
    </li>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-mortarboard-fill me-2"></i>
          Marcas y Préstamo de Equipos
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <NavLink to="/marcas" icono="bi-clock-history">
              Marcas
            </NavLink>
            <NavLink to="/equipos" icono="bi-laptop">
              Equipos
            </NavLink>
            <NavLink to="/prestamos" icono="bi-arrow-left-right">
              Préstamos
            </NavLink>
            <NavLink to="/departamentos" icono="bi-diagram-3">
              Departamentos
            </NavLink>
            <NavLink to="/configuracion" icono="bi-gear">
              Configuración
            </NavLink>
          </ul>

          <ul className="navbar-nav">
            {usuario ? (
              <>
                <li className="nav-item">
                  <span className="nav-link disabled text-white-50">
                    <i className="bi bi-person-circle me-1"></i>
                    {usuario.nombreCompleto}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm ms-2" onClick={onLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Salir
                  </button>
                </li>
              </>
            ) : (
              <NavLink to="/login" icono="bi-box-arrow-in-right">
                Iniciar sesión
              </NavLink>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
