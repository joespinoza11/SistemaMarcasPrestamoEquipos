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
import RegistrarMarcaPage from "./pages/marcas/RegistrarMarcaPage.jsx";
import ReporteMarcasPage from "./pages/marcas/ReporteMarcasPage.jsx";
import PerfilPage from "./pages/usuarios/PerfilPage.jsx";
import DispositivosPage from "./pages/usuarios/DispositivosPage.jsx";
import DepartamentosPage from "./pages/administracion/DepartamentosPage.jsx";
import RutaProtegida from "./components/comunes/RutaProtegida.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

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
            <Route path="*" element={<NotFoundPage />} />
            
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

            <Route
              path="/marcas"
              element={
                <RutaProtegida>
                  <RegistrarMarcaPage />
                </RutaProtegida>
              }
            />
            <Route
              path="/reportes/marcas"
              element={
                <RutaProtegida rolRequerido="administrador">
                  <ReporteMarcasPage />
                </RutaProtegida>
              }
            />

            <Route
              path="/perfil"
              element={
                <RutaProtegida>
                  <PerfilPage />
                </RutaProtegida>
              }
            />
            <Route
              path="/dispositivos"
              element={
                <RutaProtegida>
                  <DispositivosPage />
                </RutaProtegida>
              }
            />
            <Route
              path="/departamentos"
              element={
                <RutaProtegida rolRequerido="administrador">
                  <DepartamentosPage />
                </RutaProtegida>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}