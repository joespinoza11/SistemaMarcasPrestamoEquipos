export default function Loading({ mensaje = "Cargando información..." }) {
  return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
      <p className="mt-2">{mensaje}</p>
    </div>
  );
}
