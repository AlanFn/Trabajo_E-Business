import { ADMIN_API_TOKEN, PRODUCTOS_API_CONFIG } from "../config/apiConfig";
import { products } from "../data/products";
import { normalizarImagenUrl } from "../utils/imagenes";
import { normalizarImagenesProducto } from "../utils/productoMedia";
import { generarSlug } from "../utils/normalizarTexto";

const STORAGE_KEY = "vtech_productos_simulados";
const DELETED_STORAGE_KEY = "vtech_productos_eliminados_definitivos";
const PRODUCTOS_CACHE_TTL_MS = 60 * 1000;
let productosMemoria = [];
let productosEliminadosMemoria = [];
let productosCache = null;
let productosCacheTimestamp = 0;
let productosFetchPromise = null;

function arraySeguro(valor) {
  return Array.isArray(valor) ? [...valor] : [];
}

function clonarProducto(producto) {
  return {
    ...producto,
    descripcionLarga: arraySeguro(producto.descripcionLarga),
    colores: arraySeguro(producto.colores),
    talles: arraySeguro(producto.talles),
    medidas: arraySeguro(producto.medidas),
    caracteristicas: arraySeguro(producto.caracteristicas),
    propiedades: arraySeguro(producto.propiedades),
    precio: producto.precio || "",
    imagenUrl: normalizarImagenUrl(producto.imagenUrl),
    imagenes: arraySeguro(producto.imagenes),
  };
}

function clonarProductos(productosOrigen) {
  return productosOrigen.map(clonarProducto);
}

function cacheProductosVigente() {
  return productosCache && Date.now() - productosCacheTimestamp < PRODUCTOS_CACHE_TTL_MS;
}

function guardarProductosEnCache(productosOrigen) {
  productosCache = clonarProductos(productosOrigen);
  productosCacheTimestamp = Date.now();
}

function invalidarProductosCache() {
  productosCache = null;
  productosCacheTimestamp = 0;
  productosFetchPromise = null;
}

function completarProducto(producto) {
  return {
    id: producto.id,
    nombre: producto.nombre || "",
    categoria: producto.categoria || "",
    subcategoria: producto.subcategoria || "",
    tipo: producto.tipo || "",
    descripcionCorta: producto.descripcionCorta || "",
    descripcionLarga: arraySeguro(producto.descripcionLarga),
    colores: arraySeguro(producto.colores),
    talles: arraySeguro(producto.talles),
    medidas: arraySeguro(producto.medidas),
    caracteristicas: arraySeguro(producto.caracteristicas),
    propiedades: arraySeguro(producto.propiedades),
    estadoStock: producto.estadoStock || "consultar",
    precio: producto.precio || "",
    activo: producto.activo ?? true,
    destacado: producto.destacado ?? false,
    imagenUrl: normalizarImagenUrl(producto.imagenUrl),
    imagenes: normalizarImagenesProducto(producto),
  };
}

function generarIdUnico(base, productosExistentes) {
  const slugBase = generarSlug(base) || "producto";
  const ids = new Set(productosExistentes.map((producto) => producto.id));
  let id = slugBase;
  let contador = 2;

  while (ids.has(id)) {
    id = `${slugBase}-${contador}`;
    contador += 1;
  }

  return id;
}

function prepararProductoParaGuardar(producto, productosExistentes = []) {
  const productoBase = producto || {};
  const idActual = productoBase.id ? productoBase.id.toString().trim() : "";
  const nombre = productoBase.nombre ? productoBase.nombre.toString().trim() : "";

  if (!idActual && !nombre) {
    throw new Error("No se puede crear el producto porque falta el nombre.");
  }

  return completarProducto({
    ...productoBase,
    id: idActual || generarIdUnico(nombre, productosExistentes),
    nombre,
  });
}

function puedeUsarLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function leerProductosSimulados() {
  if (!puedeUsarLocalStorage()) {
    return clonarProductos(productosMemoria);
  }

  try {
    const guardados = window.localStorage.getItem(STORAGE_KEY);
    return guardados ? JSON.parse(guardados) : [];
  } catch {
    return [];
  }
}

function leerIdsEliminadosDefinitivos() {
  if (!puedeUsarLocalStorage()) {
    return [...productosEliminadosMemoria];
  }

  try {
    const guardados = window.localStorage.getItem(DELETED_STORAGE_KEY);
    return guardados ? JSON.parse(guardados) : [];
  } catch {
    return [];
  }
}

function guardarProductosSimulados(productosSimulados) {
  productosMemoria = clonarProductos(productosSimulados);

  if (!puedeUsarLocalStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(productosSimulados));
}

function guardarIdsEliminadosDefinitivos(ids) {
  productosEliminadosMemoria = [...ids];

  if (!puedeUsarLocalStorage()) {
    return;
  }

  window.localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(ids));
}

const productosLocalDriver = {
  async obtenerProductos() {
    const idsEliminados = new Set(leerIdsEliminadosDefinitivos());
    const productosPorId = new Map(
      products
        .filter((producto) => !idsEliminados.has(producto.id))
        .map((producto) => [producto.id, clonarProducto(producto)]),
    );

    leerProductosSimulados().forEach((producto) => {
      if (!idsEliminados.has(producto.id)) {
        productosPorId.set(producto.id, clonarProducto(producto));
      }
    });

    return clonarProductos(Array.from(productosPorId.values()));
  },

  async crearProducto(producto) {
    const productosExistentes = await this.obtenerProductos();
    const id = producto.id || generarIdUnico(producto.nombre, productosExistentes);
    const productoCompleto = completarProducto({
      ...producto,
      id,
      activo: producto.activo ?? true,
    });

    return this.guardarProducto(productoCompleto);
  },

  async editarProducto(id, datosActualizados) {
    const productoActual = await obtenerProductoPorId(id);

    if (!productoActual) {
      return null;
    }

    const productoActualizado = completarProducto({
      ...productoActual,
      ...datosActualizados,
      id,
    });

    return this.guardarProducto(productoActualizado);
  },

  async ocultarProducto(id) {
    return this.editarProducto(id, { activo: false });
  },

  async reactivarProducto(id) {
    return this.editarProducto(id, { activo: true });
  },

  async eliminarProducto(id) {
    return this.ocultarProducto(id);
  },

  async eliminarProductoDefinitivo(id) {
    const productoActual = await obtenerProductoPorId(id);

    if (!productoActual) {
      throw new Error("No existe un producto con ese id.");
    }

    if (productoActual.activo) {
      throw new Error("Solo se pueden eliminar definitivamente productos ocultos.");
    }

    const simulados = leerProductosSimulados().filter((producto) => producto.id !== id);
    const idsEliminados = new Set(leerIdsEliminadosDefinitivos());
    idsEliminados.add(id);

    guardarProductosSimulados(simulados);
    guardarIdsEliminadosDefinitivos(Array.from(idsEliminados));

    return { id };
  },

  guardarProducto(producto) {
    const simulados = leerProductosSimulados();
    const index = simulados.findIndex((item) => item.id === producto.id);
    const productoClonado = clonarProducto(completarProducto(producto));

    if (index >= 0) {
      simulados[index] = productoClonado;
    } else {
      simulados.push(productoClonado);
    }

    const idsEliminados = leerIdsEliminadosDefinitivos().filter((id) => id !== productoClonado.id);

    guardarProductosSimulados(simulados);
    guardarIdsEliminadosDefinitivos(idsEliminados);
    return productoClonado;
  },
};

async function llamarAppsScript(payload) {
  if (!PRODUCTOS_API_CONFIG.appsScriptUrl) {
    throw new Error("No se configuró la URL de Google Apps Script para productos.");
  }

  let response;

  try {
    response = await fetch(PRODUCTOS_API_CONFIG.appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error(`No se pudo conectar con Google Apps Script: ${error.message}`);
  }

  if (!response.ok) {
    throw new Error(`Google Apps Script respondió con estado ${response.status}.`);
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("La respuesta de Google Apps Script no tiene formato JSON válido.");
  }

  if (data?.ok === false) {
    throw new Error(data.error || "Google Apps Script informó un error al procesar la operación.");
  }

  return data;
}

function extraerProductos(data) {
  const productosRemotos = Array.isArray(data) ? data : data.productos;
  return clonarProductos(productosRemotos || []);
}

const productosRemotoDriver = {
  async obtenerProductos() {
    const data = await llamarAppsScript({ accion: "listar" });
    return extraerProductos(data);
  },

  async crearProducto(producto) {
    const data = await llamarAppsScript({
      accion: "crear",
      token: ADMIN_API_TOKEN,
      producto: completarProducto(producto),
    });

    return data.producto ? clonarProducto(data.producto) : completarProducto(producto);
  },

  async editarProducto(id, datosActualizados) {
    const data = await llamarAppsScript({
      accion: "editar",
      token: ADMIN_API_TOKEN,
      id,
      producto: datosActualizados,
    });

    return data.producto ? clonarProducto(data.producto) : obtenerProductoPorId(id);
  },

  async ocultarProducto(id) {
    const data = await llamarAppsScript({
      accion: "ocultar",
      token: ADMIN_API_TOKEN,
      id,
    });

    return data.producto ? clonarProducto(data.producto) : obtenerProductoPorId(id);
  },

  async reactivarProducto(id) {
    const data = await llamarAppsScript({
      accion: "reactivar",
      token: ADMIN_API_TOKEN,
      id,
    });

    return data.producto ? clonarProducto(data.producto) : obtenerProductoPorId(id);
  },

  async eliminarProducto(id) {
    return this.ocultarProducto(id);
  },

  async eliminarProductoDefinitivo(id) {
    const data = await llamarAppsScript({
      accion: "eliminarDefinitivo",
      token: ADMIN_API_TOKEN,
      id,
    });

    return data.id || id;
  },
};

function obtenerDriver() {
  if (PRODUCTOS_API_CONFIG.modo === "remoto") {
    return productosRemotoDriver;
  }

  return productosLocalDriver;
}

export async function obtenerProductos() {
  if (cacheProductosVigente()) {
    return clonarProductos(productosCache);
  }

  if (!productosFetchPromise) {
    productosFetchPromise = obtenerDriver()
      .obtenerProductos()
      .then((productosObtenidos) => {
        guardarProductosEnCache(productosObtenidos);
        return clonarProductos(productosCache);
      })
      .finally(() => {
        productosFetchPromise = null;
      });
  }

  return clonarProductos(await productosFetchPromise);
}

export async function refrescarProductos() {
  invalidarProductosCache();
  const productosObtenidos = await obtenerDriver().obtenerProductos();
  guardarProductosEnCache(productosObtenidos);
  return clonarProductos(productosCache);
}

export async function obtenerProductosActivos() {
  const productosObtenidos = await obtenerProductos();
  return productosObtenidos.filter((producto) => producto.activo === true);
}

export async function obtenerProductoPorId(id) {
  const productosObtenidos = await obtenerProductos();
  return productosObtenidos.find((producto) => producto.id === id) || null;
}

export async function crearProducto(producto) {
  const productosExistentes = await obtenerProductos();
  const productoPreparado = prepararProductoParaGuardar(producto, productosExistentes);

  const productoCreado = await obtenerDriver().crearProducto(productoPreparado);
  invalidarProductosCache();
  return productoCreado;
}

export async function editarProducto(id, datosActualizados) {
  const datosPreparados = {
    ...datosActualizados,
    id: datosActualizados?.id || id,
  };

  if (Object.prototype.hasOwnProperty.call(datosPreparados, "imagenUrl")) {
    datosPreparados.imagenUrl = normalizarImagenUrl(datosPreparados.imagenUrl);
  }

  if (Object.prototype.hasOwnProperty.call(datosPreparados, "imagenes")) {
    datosPreparados.imagenes = normalizarImagenesProducto(datosPreparados);
    datosPreparados.imagenUrl = datosPreparados.imagenes[0] || normalizarImagenUrl(datosPreparados.imagenUrl);
  }

  const productoActualizado = await obtenerDriver().editarProducto(id, datosPreparados);
  invalidarProductosCache();
  return productoActualizado;
}

export async function ocultarProducto(id) {
  const productoOculto = await obtenerDriver().ocultarProducto(id);
  invalidarProductosCache();
  return productoOculto;
}

export async function reactivarProducto(id) {
  const productoReactivado = await obtenerDriver().reactivarProducto(id);
  invalidarProductosCache();
  return productoReactivado;
}

export async function eliminarProducto(id) {
  const productoEliminado = await obtenerDriver().eliminarProducto(id);
  invalidarProductosCache();
  return productoEliminado;
}

export async function eliminarProductoDefinitivo(id) {
  const resultado = await obtenerDriver().eliminarProductoDefinitivo(id);
  invalidarProductosCache();
  return resultado;
}
