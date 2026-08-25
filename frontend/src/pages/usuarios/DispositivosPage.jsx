import { useEffect, useState } from "react";
import TablaDispositivos from "../../components/usuarios/TablaDispositivos.jsx";
import FormularioDispositivo from "../../components/usuarios/FormularioDispositivo.jsx";
import Loading from "../../components/comunes/Loading.jsx";
import Alert from "../../components/comunes/Alert.jsx";
import { listarDispositivos, eliminarDispositivo } from "../../services/dispositivo.service.js";
import { obtenerIdentificadorDispositivo } from "../../utils/marca.util.js";

export default function DispositivosPage() {
  const [dispositivos, setDispositivos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function cargar() {
    setCargando(true);
    setError("");

    try {
      const data = await listarDispositivos();
      setDispositivos(data.dispositivos || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function eliminar(id) {
    setError("");

    try {
      await eliminarDispositivo(id);
      cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h1 className="h4 mb-0">
          <i className="bi bi-laptop me-2"></i>
          Mis dispositivos
        </h1>

        <FormularioDispositivo dispositivo={null} onGuardado={cargar} />
      </div>

      <p className="text-muted">
        Necesita al menos un dispositivo activo registrado en este navegador
        para poder marcar entrada y salida.
      </p>

      <Alert tipo="danger" mensaje={error} />

      {cargando ? (
        <Loading />
      ) : (
        <TablaDispositivos
          dispositivos={dispositivos}
          dispositivoActualId={obtenerIdentificadorDispositivo()}
          onGuardado={cargar}
          onEliminar={eliminar}
        />
      )}
    </div>
  );
}
