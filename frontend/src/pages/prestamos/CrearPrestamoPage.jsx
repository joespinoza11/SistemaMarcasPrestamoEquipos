import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormularioPrestamo from "../../components/prestamos/FormularioPrestamo.jsx";
import Alert from "../../components/comunes/Alert.jsx";
import { crearPrestamo } from "../../services/prestamo.service.js";

export default function CrearPrestamoPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit({ usuarioId, equipos }) {
    setError("");
    setEnviando(true);

    try {
      const data = await crearPrestamo(usuarioId, equipos);
      navigate(`/prestamos/${data.prestamo.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-7">
        <h1 className="h4 mb-4">
          <i className="bi bi-arrow-left-right me-2"></i>
          Registrar préstamo
        </h1>

        <Alert tipo="danger" mensaje={error} />

        <FormularioPrestamo onSubmit={handleSubmit} enviando={enviando} />
      </div>
    </div>
  );
}
