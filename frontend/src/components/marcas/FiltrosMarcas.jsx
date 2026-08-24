import { useState } from "react";
import Input from "../comunes/Input.jsx";
import Select from "../comunes/Select.jsx";
import Button from "../comunes/Button.jsx";

const MESES = [
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const FILTROS_VACIOS = {
  usuario: "",
  departamento: "",
  anio: "",
  mes: "",
  dia: "",
};

export default function FiltrosMarcas({ onFiltrar }) {
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
          etiqueta="Departamento (ID)"
          nombre="departamento"
          tipo="number"
          valor={filtros.departamento}
          onChange={handleChange}
        />
      </div>

      <div className="col-6 col-md-2">
        <Input
          etiqueta="Año"
          nombre="anio"
          tipo="number"
          placeholder="2026"
          valor={filtros.anio}
          onChange={handleChange}
        />
      </div>

      <div className="col-6 col-md-2">
        <Select
          etiqueta="Mes"
          nombre="mes"
          valor={filtros.mes}
          opciones={MESES}
          onChange={handleChange}
          placeholder="Todos"
        />
      </div>

      <div className="col-6 col-md-1">
        <Input
          etiqueta="Día"
          nombre="dia"
          tipo="number"
          valor={filtros.dia}
          onChange={handleChange}
        />
      </div>

      <div className="col-12 col-md-3 d-flex gap-2 mb-3">
        <Button texto="Filtrar" boton="submit" icono="bi-funnel" />
        <Button texto="Limpiar" tipo="secondary" onClick={limpiar} />
      </div>
    </form>
  );
}
