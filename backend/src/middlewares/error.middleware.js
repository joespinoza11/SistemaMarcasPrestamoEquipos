export function rutaNoEncontrada(req, res) {
  return res.status(404).json({
    error: "La ruta solicitada no existe.",
  });
}
