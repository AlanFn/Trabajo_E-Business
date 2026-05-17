export const colores = [
  { id: "negro", label: "Negro", hex: "#1a1a1a" },
  { id: "blanco", label: "Blanco", hex: "#f3f3f3" },
  { id: "gris", label: "Gris", hex: "#7a7a7a" },
  { id: "gris-claro", label: "Gris claro", hex: "#cfcfcf" },
  { id: "gris-oscuro", label: "Gris oscuro", hex: "#424242" },
  { id: "azul", label: "Azul", hex: "#2d6a9f" },
  { id: "azul-marino", label: "Azul marino", hex: "#1f3556" },
  { id: "azul-francia", label: "Azul Francia", hex: "#2563b8" },
  { id: "celeste", label: "Celeste", hex: "#7fb7d8" },
  { id: "verde", label: "Verde", hex: "#3a6b4a" },
  { id: "verde-oscuro", label: "Verde oscuro", hex: "#224f36" },
  { id: "verde-petroleo", label: "Verde petróleo", hex: "#006b5c" },
  { id: "verde-musgo", label: "Verde musgo", hex: "#5f6f3a" },
  { id: "verde-cirugia", label: "Verde cirugía", hex: "#2f8a70" },
  { id: "rojo", label: "Rojo", hex: "#b73535" },
  { id: "bordo", label: "Bordo", hex: "#6b2737" },
  { id: "amarillo", label: "Amarillo", hex: "#f2c94c" },
  { id: "naranja", label: "Naranja", hex: "#f2994a" },
  { id: "marron", label: "Marrón", hex: "#7a4a28" },
  { id: "beige", label: "Beige", hex: "#d8c3a5" },
  { id: "arena", label: "Arena", hex: "#c8b38d" },
  { id: "caqui", label: "Caqui", hex: "#8d8764" },
  { id: "kaki", label: "Kaki", hex: "#8d8764" },
  { id: "rosa", label: "Rosa", hex: "#e98ab3" },
  { id: "fucsia", label: "Fucsia", hex: "#c83283" },
  { id: "violeta", label: "Violeta", hex: "#7c4d9e" },
  { id: "morado", label: "Morado", hex: "#6b3fa0" },
  { id: "lila", label: "Lila", hex: "#b989d6" },
];

export const talles = ["XS", "S", "M", "L", "XL", "2XL", "Único"];

export const propiedades = [
  { id: "impermeable", label: "Impermeable" },
  { id: "antifluido", label: "Antifluido" },
  { id: "ventilado", label: "Ventilado" },
  { id: "ajustable", label: "Ajustable" },
  { id: "con-bolsillos", label: "Con bolsillos" },
  { id: "resistente", label: "Resistente" },
  { id: "facil-lavado", label: "Fácil lavado" },
  { id: "secado-rapido", label: "Secado rápido" },
  { id: "talle-unico", label: "Talle único" },
];

export const estadosStock = [
  { id: "disponible", label: "Disponible" },
  { id: "consultar", label: "Consultar" },
  { id: "agotado", label: "Agotado" },
];

export const ordenamientos = [
  { id: "recomendado", label: "Recomendado" },
  { id: "nombre-asc", label: "Nombre: A-Z" },
  { id: "destacados", label: "Destacados" },
  { id: "disponibles", label: "Disponibles primero" },
];

export function normalizarColor(colorLabel) {
  return String(colorLabel || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const coloresPorNombre = new Map(
  colores.flatMap((color) => [
    [normalizarColor(color.id), color.hex],
    [normalizarColor(color.label), color.hex],
  ]),
);

function normalizarColorGlobal(color) {
  if (!color) return null;

  const nombre = color.nombre || color.label || color.value || "";
  const slug = color.slug || color.id || "";
  const hex = color.hex || "";

  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) {
    return null;
  }

  return { nombre, slug, hex };
}

export function getColorHex(colorLabel, coloresGlobales = []) {
  const buscado = normalizarColor(colorLabel);
  const global = coloresGlobales
    .map(normalizarColorGlobal)
    .filter(Boolean)
    .find((color) => normalizarColor(color.nombre) === buscado || normalizarColor(color.slug) === buscado);

  return global?.hex || coloresPorNombre.get(buscado) || "#d8d8d8";
}
