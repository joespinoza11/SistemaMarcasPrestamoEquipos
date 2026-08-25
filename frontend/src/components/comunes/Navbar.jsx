import { Link, useLocation } from "react-router-dom";

export default function Navbar({ usuario, onLogout }) {
  const location = useLocation();
  const enlaceActivo = (ruta) => location.pathname.startsWith(ruta);

  const NavLink = ({ to, icono, children }) => (
    <li>
      <Link className={`app-nav-link ${enlaceActivo(to) ? "active" : ""}`} to={to}>
        <i className={`bi ${icono}`}></i>
        <span>{children}</span>
      </Link>
    </li>
  );

  const inicial = usuario?.nombreCompleto?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="app-navbar">
      <div className="app-nav-inner">
        <Link className="app-brand" to="/">
          <span className="app-brand-mark"><i className="bi bi-cpu-fill"></i></span>
          <span className="app-brand-copy">
            <span className="app-brand-title">Campus Tech</span>
            <span className="app-brand-subtitle">Marcas · Equipos · Préstamos</span>
          </span>
        </Link>

        <ul className="app-nav-links">
          {usuario && <NavLink to="/marcas" icono="bi-clock-history">Marcas</NavLink>}
          {usuario?.rol === "administrador" && <NavLink to="/reportes/marcas" icono="bi-bar-chart-line">Reportes</NavLink>}
          {usuario && <NavLink to="/equipos" icono="bi-laptop">Equipos</NavLink>}
          {usuario?.rol === "administrador" && <NavLink to="/prestamos" icono="bi-arrow-left-right">Préstamos</NavLink>}
          {usuario?.rol === "administrador" && <NavLink to="/departamentos" icono="bi-diagram-3">Departamentos</NavLink>}
          {usuario?.rol === "administrador" && <NavLink to="/configuracion" icono="bi-sliders2">Configuración</NavLink>}
          {usuario && <NavLink to="/dispositivos" icono="bi-phone">Dispositivos</NavLink>}
        </ul>

        <div className="app-user">
          {usuario ? (
            <>
              <Link className="app-user-link" to="/perfil">
                <span className="app-user-avatar">{inicial}</span>
                <span className="app-user-copy">
                  <span className="app-user-name">{usuario.nombreCompleto || usuario.username}</span>
                  <span className="app-user-role">{usuario.rol === "administrador" ? "Administrador" : "Usuario"}</span>
                </span>
              </Link>
              <button className="btn btn-sm app-logout" onClick={onLogout} title="Cerrar sesión">
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </>
          ) : (
            <Link className="app-nav-link active" to="/login">
              <i className="bi bi-box-arrow-in-right"></i><span>Iniciar sesión</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
