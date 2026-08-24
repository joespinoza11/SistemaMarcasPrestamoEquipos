import { Modal as BsModal } from "bootstrap";
import Button from "./Button";

/**
 * Modal de confirmación genérico.
 *
 * Uso típico: un botón en la página abre este modal con
 * data-bs-toggle="modal" data-bs-target={`#${id}`}, y `confirmar`
 * recibe la acción real a ejecutar (ej. devolver un equipo).
 */
export default function Modal({ id, titulo, mensaje, confirmar, textoConfirmar = "Aceptar" }) {
  function cerrar() {
    const modalElement = document.getElementById(id);
    const modalInstance = BsModal.getInstance(modalElement);
    modalInstance?.hide();
  }

  function handleConfirmar() {
    confirmar?.();
    cerrar();
  }

  return (
    <div className="modal fade" id={id} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{titulo}</h5>
            <button className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">{mensaje}</div>
          <div className="modal-footer">
            <Button texto="Cancelar" tipo="secondary" onClick={cerrar} />
            <Button texto={textoConfirmar} tipo="danger" onClick={handleConfirmar} />
          </div>
        </div>
      </div>
    </div>
  );
}
