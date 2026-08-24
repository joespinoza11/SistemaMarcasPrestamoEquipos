import Modal from "../comunes/Modal.jsx";

export default function BotonDevolucion({ equipo, onConfirmar }) {
  const modalId = `modal-devolver-${equipo.equipo_id}`;

  return (
    <>
      <button
        type="button"
        className="btn btn-warning btn-sm"
        data-bs-toggle="modal"
        data-bs-target={`#${modalId}`}
      >
        <i className="bi bi-box-arrow-in-left me-1"></i>
        Devolver
      </button>

      <Modal
        id={modalId}
        titulo="Confirmar devolución"
        mensaje={`¿Confirma la devolución del equipo ${equipo.codigo}?`}
        confirmar={() => onConfirmar(equipo.equipo_id)}
        textoConfirmar="Devolver"
      />
    </>
  );
}
