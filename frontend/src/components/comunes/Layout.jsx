import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

/**
 * Layout general de la aplicación.
 *
 * Se usa como elemento "padre" de todas las rutas en App.jsx
 * (patrón de rutas anidadas de React Router). El <Outlet/> es
 * donde se renderiza la página específica de cada ruta hija.
 *
 * Los props `usuario` y `onLogout` simplemente se pasan a la Navbar;
 * mientras no exista AuthContext, App.jsx puede omitirlos.
 */
export default function Layout({ usuario, onLogout }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar usuario={usuario} onLogout={onLogout} />

      <main className="container pb-5 flex-grow-1">
        <Outlet />
      </main>

      <footer className="bg-primary text-white text-center py-3 mt-auto">
        <small>
          <i className="bi bi-mortarboard-fill me-1"></i>
          Sistema de Marcas y Préstamo de Equipos &mdash; {new Date().getFullYear()} &mdash;
          Tecnologías y Sistemas Web II
        </small>
      </footer>
    </div>
  );
}
