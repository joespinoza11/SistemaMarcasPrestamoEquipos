import { useState } from "react";
import Input from "../comunes/Input.jsx";
import Select from "../comunes/Select.jsx";
import Button from "../comunes/Button.jsx";

const ESTADOS = [
  { value: "ACTIVO", label: "Activo" },
  { value: "FINALIZADO", label: "Finalizado" },
];

const FILTROS_VACIOS = { usuario: "", fecha: "", estado: "", equipo: "" };

export default function FiltrosPrestamos({ onFiltrar }) {
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);

  function handleChange(e) {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onFiltrar(filtros);
  }

  function limpiar() {
    setFiltros(FILTROS_VACIOS);
    onFiltrar(FILTROS_VACIOS);
  }

  return (
    <form onSubmit={handleSubmit} className="row g-2 align-items-end mb-4">
      <div className="col-6 col-md-2">
        <Input
          etiqueta="Usuario (ID)"
          nombre="usuario"
          tipo="number"
          valor={filtros.usuario}
          onChange={handleChange}
        />
      </div>

      <div className="col-6 col-md-2">
        <Input
          etiqueta="Equipo (ID)"
          nombre="equipo"
          tipo="number"
          valor={filtros.equipo}
          onChange={handleChange}
        />
      </div>

      <div className="col-6 col-md-3">
        <Input
          etiqueta="Fecha"
          nombre="fecha"
          tipo="date"
          valor={filtros.fecha}
          onChange={handleChange}
        />
      </div>

      <div className="col-6 col-md-3">
        <Select
          etiqueta="Estado"
          nombre="estado"
          valor={filtros.estado}
          opciones={ESTADOS}
          onChange={handleChange}
          placeholder="Todos"
        />
      </div>

      <div className="col-12 col-md-2 d-flex gap-2 mb-3">
        <Button texto="Filtrar" boton="submit" icono="bi-funnel" />
        <Button texto="Limpiar" tipo="secondary" onClick={limpiar} />
      </div>
    </form>
  );
}
