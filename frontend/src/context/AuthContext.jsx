import { createContext, useContext, useEffect, useState } from "react";
import { obtenerSesion, iniciarSesion, cerrarSesion } from "../services/auth.service.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function verificarSesionActiva() {
      try {
        const data = await obtenerSesion();
        setUsuario(data.usuario ?? null);
      } catch {
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    }

    verificarSesionActiva();
  }, []);

  async function login(credenciales) {
    const data = await iniciarSesion(credenciales);
    setUsuario(data.usuario);
    return data;
  }

  async function logout() {
    try {
      await cerrarSesion();
    } finally {
      setUsuario(null);
    }
  }

  const value = {
    usuario,
    cargando,
    estaAutenticado: !!usuario,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>.");
  }

  return context;
}
