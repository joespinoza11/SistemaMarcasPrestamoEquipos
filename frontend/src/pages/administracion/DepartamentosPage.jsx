import { useEffect, useState } from "react";
import TablaDepartamentos from "../../components/usuarios/TablaDepartamentos.jsx";
import FormularioDepartamento from "../../components/usuarios/FormularioDepartamento.jsx";
import Loading from "../../components/comunes/Loading.jsx";
import Alert from "../../components/comunes/Alert.jsx";
import { listarDepartamentos, eliminarDepartamento } from "../../services/departamento.service.js";

export default function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function cargar() {
    setCargando(true);
    setError("");

    try {
      const data = await listarDepartamentos();
      setDepartamentos(data.departamentos || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
  }, []);

  async function eliminar(id) {
    setError("");

    try {
      await eliminarDepartamento(id);
      cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h1 className="h4 mb-0">
          <i className="bi bi-diagram-3 me-2"></i>
          Departamentos
        </h1>

        <FormularioDepartamento departamento={null} onGuardado={cargar} />
      </div>

      <Alert tipo="danger" mensaje={error} />

      {cargando ? (
        <Loading />
      ) : (
        <TablaDepartamentos
          departamentos={departamentos}
          onGuardado={cargar}
          onEliminar={eliminar}
        />
      )}
    </div>
  );
}
