import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loading from "../components/comunes/Loading.jsx";

export default function HomePage() {
  const { usuario, cargando, estaAutenticado } = useAuth();

  if (cargando) return <Loading mensaje="Verificando sesión..." />;

  if (!estaAutenticado) {
    return (
      <div className="auth-shell">
        <section className="auth-card text-center">
          <div className="auth-brand justify-content-center">
            <span className="auth-brand-mark"><i className="bi bi-cpu-fill"></i></span>
            <div className="text-start">
              <div className="auth-title">Campus Tech</div>
              <div className="auth-subtitle">Gestión institucional de marcas y equipos</div>
            </div>
          </div>
          <p className="text-muted mb-4">Iniciá sesión para acceder a las herramientas del sistema.</p>
          <Link to="/login" className="btn btn-primary w-100 mb-2"><i className="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión</Link>
          <Link to="/registro" className="btn btn-outline-primary w-100">Crear una cuenta</Link>
        </section>
      </div>
    );
  }

  const admin = usuario?.rol === "administrador";
  const nombre = usuario?.nombreCompleto || usuario?.username || "usuario";

  const accesos = [
    { to: "/marcas", icon: "bi-clock-history", title: "Registrar marca", text: "Controlá tu entrada y salida." },
    { to: "/equipos", icon: "bi-laptop", title: "Inventario", text: "Consultá los equipos disponibles." },
    { to: "/dispositivos", icon: "bi-phone", title: "Dispositivos", text: "Administrá tus dispositivos autorizados." },
    ...(admin ? [
      { to: "/prestamos", icon: "bi-arrow-left-right", title: "Préstamos", text: "Gestioná préstamos y devoluciones." },
      { to: "/reportes/marcas", icon: "bi-bar-chart-line", title: "Reportes", text: "Consultá y exportá información." },
      { to: "/configuracion", icon: "bi-sliders2", title: "Configuración", text: "Administrá los parámetros del sistema." },
    ] : []),
  ];

  return (
    <div>
      <section className="dashboard-hero">
        <div className="dashboard-hero-content">
          <span className="dashboard-kicker"><i className="bi bi-shield-check"></i> Sistema institucional</span>
          <h1 className="dashboard-title">Bienvenido/a, {nombre}</h1>
          <p className="dashboard-text">Todo lo necesario para gestionar marcas, dispositivos, equipos y préstamos desde un solo lugar.</p>
        </div>
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-stat"><div className="dashboard-stat-icon"><i className="bi bi-clock-history"></i></div><div className="dashboard-stat-label">Módulo</div><div className="dashboard-stat-title">Control de marcas</div></div>
        <div className="dashboard-stat"><div className="dashboard-stat-icon"><i className="bi bi-laptop"></i></div><div className="dashboard-stat-label">Módulo</div><div className="dashboard-stat-title">Inventario de equipos</div></div>
        <div className="dashboard-stat"><div className="dashboard-stat-icon"><i className="bi bi-arrow-left-right"></i></div><div className="dashboard-stat-label">Módulo</div><div className="dashboard-stat-title">Gestión de préstamos</div></div>
        <div className="dashboard-stat"><div className="dashboard-stat-icon"><i className="bi bi-bar-chart-line"></i></div><div className="dashboard-stat-label">Módulo</div><div className="dashboard-stat-title">Reportes y análisis</div></div>
      </div>

      <div className="mt-4 mb-3">
        <h2 className="h5 mb-1">Accesos rápidos</h2>
        <p className="page-subtitle">Entrá directamente al módulo que necesitás.</p>
      </div>
      <div className="quick-grid">
        {accesos.map((item) => (
          <Link className="quick-link" to={item.to} key={item.to}>
            <span className="quick-link-icon"><i className={`bi ${item.icon}`}></i></span>
            <span><strong className="d-block">{item.title}</strong><small className="text-muted">{item.text}</small></span>
            <i className="bi bi-chevron-right ms-auto text-muted"></i>
          </Link>
        ))}
      </div>
    </div>
  );
}