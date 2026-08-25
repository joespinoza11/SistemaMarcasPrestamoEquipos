import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/comunes/Button.jsx";
import Alert from "../../components/comunes/Alert.jsx";
import Badge from "../../components/comunes/Badge.jsx";
import { registrarMarca } from "../../services/marca.service.js";
import { obtenerIdentificadorDispositivo } from "../../utils/marca.util.js";
import { formatearFecha } from "../../utils/fechas.util.js";

export default function RegistrarMarcaPage() {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [marca, setMarca] = useState(null);
  const [sinDispositivo, setSinDispositivo] = useState(false);

  async function marcar() {
    setError("");
    setMarca(null);
    setSinDispositivo(false);

    const dispositivo = obtenerIdentificadorDispositivo();

    if (!dispositivo) {
      setSinDispositivo(true);
      return;
    }

    setEnviando(true);

    try {
      const data = await registrarMarca(dispositivo);
      setMarca(data.marca);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-body text-center p-4">
            <h1 className="h4 mb-3">
              <i className="bi bi-clock-history me-2"></i>
              Registrar marca
            </h1>

            <p className="text-muted">
              El sistema determina automáticamente si corresponde una entrada o
              una salida según su última marca del día.
            </p>

            {sinDispositivo && (
              <div className="alert alert-warning">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                No hay un dispositivo registrado en este navegador. Debe
                registrarlo antes de poder marcar.
                <div className="mt-3">
                  <Link to="/dispositivos">
                    <Button
                      texto="Registrar dispositivo"
                      tipo="warning"
                      icono="bi-laptop"
                    />
                  </Link>
                </div>
              </div>
            )}

            <Alert tipo="danger" mensaje={error} />

            {marca && (
              <div className="alert alert-success">
                <h2 className="h5 mb-3">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Marca registrada correctamente
                </h2>

                <div className="mb-2">
                  <Badge estado={marca.tipo} />
                </div>

                <div className="small">
                  <div>
                    <strong>Fecha:</strong> {formatearFecha(marca.fecha)}
                  </div>
                  <div>
                    <strong>Hora:</strong> {marca.hora}
                  </div>
                  <div>
                    <strong>Dispositivo:</strong> {marca.dispositivo}
                  </div>
                  <div>
                    <strong>Dirección IP:</strong> {marca.ip}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <Button
                texto={enviando ? "Registrando..." : "Marcar ahora"}
                icono="bi-fingerprint"
                onClick={marcar}
                deshabilitado={enviando}
                anchoCompleto
                tamano="lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
