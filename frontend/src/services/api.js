const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function apiFetch(path, opciones = {}) {
  const { body, formData, ...resto } = opciones;

  const config = {
    credentials: "include",
    ...resto,
  };

  if (formData) {

    config.body = formData;
  } else if (body !== undefined) {
    config.headers = { "Content-Type": "application/json", ...resto.headers };
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, config);

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || "Ocurrió un error inesperado.");
  }

  return data;
}

export async function apiFetchArchivo(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "No se pudo generar el archivo.");
  }

  return await res.blob();
}