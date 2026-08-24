import Modal from "../comunes/Modal.jsx";

export default function BotonEliminarDepartamento({ departamento, onConfirmar }) {
  const modalId = `modal-eliminar-departamento-${departamento.id}`;

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
        titulo="Eliminar departamento"
        mensaje={`¿Eliminar el departamento "${departamento.nombre}"? Esta acción no se puede deshacer.`}
        confirmar={() => onConfirmar(departamento.id)}
        textoConfirmar="Eliminar"
      />
    </>
  );
}
