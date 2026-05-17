import { normalizarImagenUrl } from "./imagenes";

export function normalizarImagenesProducto(producto = {}) {
  const imagenes = Array.isArray(producto.imagenes)
    ? producto.imagenes.map(normalizarImagenUrl).filter(Boolean)
    : [];
  const imagenPrincipal = normalizarImagenUrl(producto.imagenUrl);

  if (imagenes.length > 0) {
    return imagenes;
  }

  return imagenPrincipal ? [imagenPrincipal] : [];
}

export function obtenerImagenPrincipal(producto = {}) {
  return normalizarImagenesProducto(producto)[0] || "";
}
