export function obtenerNumeroPrecio(valor) {
  const texto = String(valor || "").trim();

  if (!texto) {
    return null;
  }

  const normalizado = texto.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const numero = Number(normalizado);

  return Number.isFinite(numero) && numero > 0 ? numero : null;
}

export function formatearPrecioGs(valor) {
  const numero = obtenerNumeroPrecio(valor);

  if (!numero) {
    return "Precio a consultar";
  }

  return `Gs. ${Math.round(numero).toLocaleString("es-PY")}`;
}
