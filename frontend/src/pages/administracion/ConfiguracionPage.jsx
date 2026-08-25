import { useEffect, useState } from "react";

import Input from "../../components/comunes/Input";
import Button from "../../components/comunes/Button";
import Alert from "../../components/comunes/Alert";
import Loading from "../../components/comunes/Loading";

import {
  obtenerConfiguracion,
  actualizarConfiguracion,
} from "../../services/configuracion.service.js";

export default function ConfiguracionPage() {
  const [valores, setValores] = useState({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function cargarConfiguracion() {
    setCargando(true);
    setError("");

    try {
      const data = await obtenerConfiguracion();

      const mapa = {};
      data.configuracion.forEach((item) => {
        mapa[item.clave] = item.valor;
      });

      setValores(mapa);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  function handleChange(clave, valor) {
    setValores((anterior) => ({ ...anterior, [clave]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMensaje("");
    setGuardando(true);

    try {
      await actualizarConfiguracion(valores);
      setMensaje("Configuración actualizada correctamente.");
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return <Loading />;
  }

  return (
    <div>
      <h2 className="mb-4">
        <i className="bi bi-gear me-2"></i>
        Configuración general del sistema
      </h2>

      <Alert tipo="success" mensaje={mensaje} />
      <Alert tipo="danger" mensaje={error} />

      <form onSubmit={handleSubmit} className="col-md-6">
        <Input
          etiqueta="Nombre de la institución"
          nombre="nombre_institucion"
          valor={valores.nombre_institucion || ""}
          onChange={(e) => handleChange("nombre_institucion", e.target.value)}
        />

        <Input
          etiqueta="Rango de IP permitido"
          nombre="rango_ip_permitido"
          valor={valores.rango_ip_permitido || ""}
          onChange={(e) => handleChange("rango_ip_permitido", e.target.value)}
          placeholder="Ej. 192.168.1.0/24"
        />

        <Input
          etiqueta="Tiempo máximo de sesión (minutos)"
          nombre="tiempo_max_sesion_min"
          tipo="number"
          valor={valores.tiempo_max_sesion_min || ""}
          onChange={(e) =>
            handleChange("tiempo_max_sesion_min", e.target.value)
          }
        />

        <Input
          etiqueta="Tamaño máximo de archivo (MB)"
          nombre="tamano_max_archivo_mb"
          tipo="number"
          valor={valores.tamano_max_archivo_mb || ""}
          onChange={(e) =>
            handleChange("tamano_max_archivo_mb", e.target.value)
          }
        />

        <Button
          texto={guardando ? "Guardando..." : "Guardar cambios"}
          tipo="primary"
          boton="submit"
          deshabilitado={guardando}
          icono="bi-check-lg"
        />
      </form>
    </div>
  );
}
