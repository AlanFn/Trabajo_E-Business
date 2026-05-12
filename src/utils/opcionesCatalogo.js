import { colores, propiedades, talles } from "../data/filtros";
import { generarSlug, normalizarTexto } from "./normalizarTexto";

export const crearSlug = generarSlug;

export function labelDesdeSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

function ordenarPorLabel(opciones) {
  return [...opciones].sort((a, b) => a.label.localeCompare(b.label));
}

function deduplicarPorValue(opciones) {
  const mapa = new Map();

  opciones.forEach((opcion) => {
    const value = opcion.value || opcion.id || opcion.label;
    const key = normalizarTexto(value);

    if (!mapa.has(key)) {
      mapa.set(key, { ...opcion, value });
    }
  });

  return Array.from(mapa.values());
}

export function obtenerColoresDisponibles(productos = []) {
  const coloresProductos = productos.flatMap((producto) =>
    producto.colores.map((color) => ({ id: crearSlug(color), value: color, label: color })),
  );

  return ordenarPorLabel(deduplicarPorValue([...colores, ...coloresProductos]));
}

export function obtenerTallesDisponibles(productos = []) {
  const tallesBase = talles.map((talle) => ({ id: crearSlug(talle), value: talle, label: talle }));
  const tallesProductos = productos.flatMap((producto) =>
    producto.talles.map((talle) => ({ id: crearSlug(talle), value: talle, label: talle })),
  );

  return deduplicarPorValue([...tallesBase, ...tallesProductos]);
}

export function obtenerPropiedadesDisponibles(productos = []) {
  const propiedadesBase = propiedades.map((propiedad) => ({
    id: propiedad.id,
    value: propiedad.id,
    label: propiedad.label,
  }));
  const propiedadesProductos = productos.flatMap((producto) =>
    producto.propiedades.map((propiedad) => ({
      id: propiedad,
      value: propiedad,
      label: propiedades.find((item) => item.id === propiedad)?.label || labelDesdeSlug(propiedad),
    })),
  );

  return ordenarPorLabel(deduplicarPorValue([...propiedadesBase, ...propiedadesProductos]));
}
