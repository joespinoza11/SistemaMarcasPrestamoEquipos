import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout({ usuario, onLogout }) {
  return (
    <div className="app-shell">
      <Navbar usuario={usuario} onLogout={onLogout} />

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="footer-inner">
          <small>
            <i className="bi bi-cpu-fill me-2"></i>
            Sistema de Marcas y Préstamo de Equipos
          </small>
          <small className="text-secondary">
            Tecnologías y Sistemas Web II · {new Date().getFullYear()}
          </small>
        </div>
      </footer>
    </div>
  );
}