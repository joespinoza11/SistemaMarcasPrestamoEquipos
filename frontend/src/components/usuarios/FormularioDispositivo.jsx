import { useState } from "react";
import { Modal as BsModal } from "bootstrap";
import Input from "../comunes/Input.jsx";
import Textarea from "../comunes/Textarea.jsx";
import Button from "../comunes/Button.jsx";
import Alert from "../comunes/Alert.jsx";
import { crearDispositivo, actualizarDispositivo } from "../../services/dispositivo.service.js";
import { guardarIdentificadorDispositivo } from "../../utils/marca.util.js";

/**
 * Botón + modal para registrar un dispositivo nuevo o editar uno existente.
 */
export default function FormularioDispositivo({ dispositivo, onGuardado }) {
  const esEdicion = !!dispositivo;
  const modalId = esEdicion ? `modal-editar-dispositivo-${dispositivo.id}` : "modal-nuevo-dispositivo";

  const [nombre, setNombre] = useState(dispositivo?.nombre || "");
  const [descripcion, setDescripcion] = useState(dispositivo?.descripcion || "");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  function cerrar() {
    const modalElement = document.getElementById(modalId);
    BsModal.getInstance(modalElement)?.hide();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) {
      setError("El nombre o alias del dispositivo es obligatorio.");
      return;
    }

    setEnviando(true);

    try {
      if (esEdicion) {
        const data = await actualizarDispositivo(dispositivo.id, {
          nombre,
          descripcion,
          estado: dispositivo.estado,
        });
        onGuardado(data.dispositivo);
      } else {
        const data = await crearDispositivo({ nombre, descripcion });
        guardarIdentificadorDispositivo(data.dispositivo.identificadorUnico);
        onGuardado(data.dispositivo);
        setNombre("");
        setDescripcion("");
      }

      cerrar();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={esEdicion ? "btn btn-outline-secondary btn-sm" : "btn btn-primary"}
        data-bs-toggle="modal"
        data-bs-target={`#${modalId}`}
      >
        <i className={`bi ${esEdicion ? "bi-pencil" : "bi-plus-lg"} me-1`}></i>
        {esEdicion ? "Editar" : "Registrar dispositivo"}
      </button>

      <div className="modal fade" id={modalId} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {esEdicion ? "Editar dispositivo" : "Registrar este dispositivo"}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div className="modal-body">
                <Alert tipo="danger" mensaje={error} />

                {!esEdicion && (
                  <div className="alert alert-info small">
                    <i className="bi bi-info-circle me-1"></i>
                    Esto registra el navegador que está usando ahora mismo,
                    para que pueda marcar entrada y salida desde aquí.
                  </div>
                )}

                <Input
                  etiqueta="Nombre o alias"
                  nombre="nombre"
                  placeholder="Ej. Laptop personal, Celular"
                  valor={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  requerido
                />

                <Textarea
                  etiqueta="Descripción (opcional)"
                  nombre="descripcion"
                  valor={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  filas={2}
                />
              </div>

              <div className="modal-footer">
                <Button texto="Cancelar" tipo="secondary" onClick={cerrar} />
                <Button
                  texto={enviando ? "Guardando..." : "Guardar"}
                  boton="submit"
                  deshabilitado={enviando}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
