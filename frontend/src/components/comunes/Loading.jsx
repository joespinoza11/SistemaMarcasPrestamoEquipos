export default function Loading({ mensaje = "Cargando información..." }) {
  return (
    <div className="app-loading">
      <div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 mb-0 small">{mensaje}</p>
      </div>
    </div>
  );
}
