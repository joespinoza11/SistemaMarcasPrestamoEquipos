export default function Pagination({ paginaActual, totalPaginas, cambiarPagina }) {
  if (totalPaginas <= 1) return null;

  const paginas = [];
  for (let i = 1; i <= totalPaginas; i++) {
    paginas.push(i);
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => cambiarPagina(paginaActual - 1)}>
            <i className="bi bi-chevron-left"></i>
          </button>
        </li>

        {paginas.map((pagina) => (
          <li key={pagina} className={`page-item ${pagina === paginaActual ? "active" : ""}`}>
            <button className="page-link" onClick={() => cambiarPagina(pagina)}>
              {pagina}
            </button>
          </li>
        ))}

        <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => cambiarPagina(paginaActual + 1)}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
}
