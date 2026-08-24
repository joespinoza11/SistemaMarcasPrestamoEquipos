import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Layout from "./components/comunes/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegistroPage from "./pages/auth/RegistroPage.jsx";
import RecuperarPasswordPage from "./pages/auth/RecuperarPasswordPage.jsx";
import RestablecerPasswordPage from "./pages/auth/RestablecerPasswordPage.jsx";
import CrearPrestamoPage from "./pages/prestamos/CrearPrestamoPage.jsx";
import HistorialPrestamosPage from "./pages/prestamos/HistorialPrestamosPage.jsx";
import DetallePrestamoPage from "./pages/prestamos/DetallePrestamoPage.jsx";
import RutaProtegida from "./components/comunes/RutaProtegida.jsx";

import { useAuth } from "./context/AuthContext.jsx";

function LayoutConSesion() {
  const { usuario, logout } = useAuth();
  return <Layout usuario={usuario} onLogout={logout} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<LayoutConSesion />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegistroPage />} />
            <Route path="/recuperar-password" element={<RecuperarPasswordPage />} />
            <Route path="/restablecer-password" element={<RestablecerPasswordPage />} />

            <Route
              path="/prestamos/nuevo"
              element={
                <RutaProtegida rolRequerido="administrador">
                  <CrearPrestamoPage />
                </RutaProtegida>
              }
            />
            <Route
              path="/prestamos"
              element={
                <RutaProtegida rolRequerido="administrador">
                  <HistorialPrestamosPage />
                </RutaProtegida>
              }
            />
            <Route
              path="/prestamos/:id"
              element={
                <RutaProtegida rolRequerido="administrador">
                  <DetallePrestamoPage />
                </RutaProtegida>
              }
            />

            { }
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
