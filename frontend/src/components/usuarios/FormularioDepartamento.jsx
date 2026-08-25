import { useState } from "react";
import { Modal as BsModal } from "bootstrap";
import Input from "../comunes/Input.jsx";
import Textarea from "../comunes/Textarea.jsx";
import Button from "../comunes/Button.jsx";
import Alert from "../comunes/Alert.jsx";
import { crearDepartamento, actualizarDepartamento } from "../../services/departamento.service.js";

export default function FormularioDepartamento({ departamento, usuarios, onGuardado }) {
  const esEdicion = !!departamento;
  const modalId = esEdicion ? `modal-editar-departamento-${departamento.id}` : "modal-nuevo-departamento";

  const listaUsuarios = usuarios || [];
  const encargadoActual = departamento?.encargado || "";
  const encargadoValido = listaUsuarios.some((u) => u.nombre_completo === encargadoActual);

  const [nombre, setNombre] = useState(departamento?.nombre || "");
  const [descripcion, setDescripcion] = useState(departamento?.descripcion || "");
  const [encargado, setEncargado] = useState(
    encargadoValido ? encargadoActual : listaUsuarios[0]?.nombre_completo || "",
  );
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  function cerrar() {
    const modalElement = document.getElementById(modalId);
    BsModal.getInstance(modalElement)?.hide();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (nombre.trim().length < 3 || nombre.trim().length > 100) {
      setError("El nombre debe tener entre 3 y 100 caracteres.");
      return;
    }

    setEnviando(true);

    try {
      const datos = { nombre, descripcion, encargado };

      const data = esEdicion
        ? await actualizarDepartamento(departamento.id, datos)
        : await crearDepartamento(datos);

      onGuardado(data.departamento);

      if (!esEdicion) {
        setNombre("");
        setDescripcion("");
        setEncargado(listaUsuarios[0]?.nombre_completo || "");
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
        {esEdicion ? "Editar" : "Nuevo departamento"}
      </button>

      <div className="modal fade" id={modalId} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {esEdicion ? "Editar departamento" : "Nuevo departamento"}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div className="modal-body">
                <Alert tipo="danger" mensaje={error} />

                <Input
                  etiqueta="Nombre"
                  nombre="nombre"
                  valor={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  requerido
                />

                {listaUsuarios.length > 0 ? (
                  <div className="mb-3">
                    <label className="form-label">Encargado</label>
                    <select
                      className="form-select"
                      name="encargado"
                      value={encargado}
                      onChange={(e) => setEncargado(e.target.value)}
                      required
                    >
                      {listaUsuarios.map((u) => (
                        <option key={u.id} value={u.nombre_completo}>
                          {u.departamento ? `${u.nombre_completo} — ${u.departamento}` : u.nombre_completo}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="form-text mb-3">
                    No hay usuarios registrados para asignar como encargado todavía.
                  </div>
                )}

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
