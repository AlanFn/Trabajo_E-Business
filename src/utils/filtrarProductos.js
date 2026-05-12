import { normalizarTexto } from "./normalizarTexto";

function coincideTexto(producto, busqueda) {
  if (!busqueda) return true;

  const campos = [
    producto.nombre,
    producto.tipo,
    producto.descripcionCorta,
    ...producto.descripcionLarga,
    ...producto.caracteristicas,
  ];

  return campos.some((campo) => normalizarTexto(campo).includes(busqueda));
}

function coincideValor(valorProducto, valorFiltro) {
  return !valorFiltro || valorProducto === valorFiltro;
}

function coincideArray(valoresProducto, valorFiltro) {
  return !valorFiltro || valoresProducto.includes(valorFiltro);
}

function coincidePropiedades(propiedadesProducto, propiedadesFiltro = []) {
  if (!propiedadesFiltro.length) return true;

  return propiedadesFiltro.every((propiedad) => propiedadesProducto.includes(propiedad));
}

function ordenarProductos(productos, orden = "recomendado") {
  const ordenados = [...productos];

  if (orden === "nombre-asc") {
    return ordenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  if (orden === "destacados") {
    return ordenados.sort((a, b) => Number(b.destacado) - Number(a.destacado));
  }

  if (orden === "disponibles") {
    return ordenados.sort((a, b) => {
      if (a.estadoStock === b.estadoStock) return 0;
      if (a.estadoStock === "disponible") return -1;
      if (b.estadoStock === "disponible") return 1;
      return 0;
    });
  }

  return ordenados.sort((a, b) => Number(b.destacado) - Number(a.destacado));
}

export function filtrarProductos(productos, filtros = {}) {
  const busqueda = filtros.busqueda ? normalizarTexto(filtros.busqueda) : "";

  const filtrados = productos.filter((producto) => {
    if (!producto.activo) return false;

    return (
      coincideTexto(producto, busqueda) &&
      coincideValor(producto.categoria, filtros.categoria) &&
      coincideValor(producto.subcategoria, filtros.subcategoria) &&
      coincideArray(producto.colores, filtros.color) &&
      coincideArray(producto.talles, filtros.talle) &&
      coincidePropiedades(producto.propiedades, filtros.propiedades) &&
      coincideValor(producto.estadoStock, filtros.estadoStock)
    );
  });

  return ordenarProductos(filtrados, filtros.orden);
}
