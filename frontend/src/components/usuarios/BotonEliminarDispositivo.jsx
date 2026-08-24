import Modal from "../comunes/Modal.jsx";

export default function BotonEliminarDispositivo({ dispositivo, onConfirmar }) {
  const modalId = `modal-eliminar-dispositivo-${dispositivo.id}`;

  return (
    <>
      <button
        type="button"
        className="btn btn-outline-danger btn-sm"
        data-bs-toggle="modal"
        data-bs-target={`#${modalId}`}
      >
        <i className="bi bi-trash me-1"></i>
        Eliminar
      </button>

      <Modal
        id={modalId}
        titulo="Eliminar dispositivo"
        mensaje={`¿Eliminar el dispositivo "${dispositivo.nombre}"? Ya no podrá usarse para marcar entrada ni salida.`}
        confirmar={() => onConfirmar(dispositivo.id)}
        textoConfirmar="Eliminar"
      />
    </>
  );
}
