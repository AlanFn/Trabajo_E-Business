export const colores = [
  { id: "verde", label: "Verde", hex: "#3a6b4a" },
  { id: "verde-musgo", label: "Verde musgo", hex: "#5f6f3a" },
  { id: "verde-cirugia", label: "Verde cirugía", hex: "#2f8a70" },
  { id: "azul", label: "Azul", hex: "#2d6a9f" },
  { id: "azul-marino", label: "Azul marino", hex: "#1f3556" },
  { id: "azul-francia", label: "Azul Francia", hex: "#2563b8" },
  { id: "negro", label: "Negro", hex: "#1a1a1a" },
  { id: "bordo", label: "Bordo", hex: "#6b2737" },
  { id: "celeste", label: "Celeste", hex: "#7fb7d8" },
  { id: "rojo", label: "Rojo", hex: "#b73535" },
  { id: "blanco", label: "Blanco", hex: "#f3f3f3" },
  { id: "gris", label: "Gris", hex: "#7a7a7a" },
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

export function getColorHex(colorLabel) {
  return colores.find((color) => color.label === colorLabel)?.hex || "#d8d8d8";
}
