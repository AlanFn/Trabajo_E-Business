import { ADMIN_API_TOKEN, PRODUCTOS_API_CONFIG } from "../config/apiConfig";
import { colores as coloresBase, normalizarColor } from "../data/filtros";
import { generarSlug } from "../utils/normalizarTexto";

const STORAGE_KEY = "vtech_colores_globales";
const COLORES_CACHE_TTL_MS = 60 * 1000;
let coloresMemoria = [];
let coloresCache = null;
let coloresCacheTimestamp = 0;
let coloresFetchPromise = null;

function puedeUsarLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function hexValido(hex) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(hex || "").trim());
}

function completarColor(color) {
  const nombre = String(color?.nombre || color?.label || color?.value || "").trim();
  const slug = String(color?.slug || color?.id || generarSlug(nombre)).trim();
  const hex = String(color?.hex || "").trim();
  const fecha = new Date().toISOString();

  return {
    id: color?.id || slug,
    nombre,
    slug,
    hex,
    activo: color?.activo ?? true,
    fechaCreacion: color?.fechaCreacion || fecha,
    fechaActualizacion: color?.fechaActualizacion || fecha,
  };
}

function clonarColores(colores) {
  return colores.map(completarColor);
}

function leerColoresLocales() {
  if (!puedeUsarLocalStorage()) {
    return clonarColores(coloresMemoria);
  }

  try {
    const guardados = window.localStorage.getItem(STORAGE_KEY);
    return guardados ? clonarColores(JSON.parse(guardados)) : [];
  } catch {
    return [];
  }
}

function guardarColoresLocales(colores) {
  coloresMemoria = clonarColores(colores);

  if (puedeUsarLocalStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(coloresMemoria));
  }
}

function cacheColoresVigente() {
  return coloresCache && Date.now() - coloresCacheTimestamp < COLORES_CACHE_TTL_MS;
}

function guardarColoresEnCache(colores) {
  coloresCache = clonarColores(colores);
  coloresCacheTimestamp = Date.now();
}

function invalidarColoresCache() {
  coloresCache = null;
  coloresCacheTimestamp = 0;
  coloresFetchPromise = null;
}

async function llamarAppsScript(payload) {
  if (!PRODUCTOS_API_CONFIG.appsScriptUrl) {
    throw new Error("No se configuró la URL de Google Apps Script para colores.");
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

  const data = await response.json();

  if (data?.ok === false) {
    throw new Error(data.error || "Google Apps Script informó un error al procesar el color.");
  }

  return data;
}

function extraerColores(data) {
  return clonarColores(Array.isArray(data) ? data : data.colores || []);
}

function validarColorParaCrear(color) {
  const nombre = String(color?.nombre || "").trim();
  const hex = String(color?.hex || "").trim();

  if (!nombre) {
    throw new Error("Ingresá un nombre para el color.");
  }

  if (!hexValido(hex)) {
    throw new Error("Ingresá un color hexadecimal válido.");
  }

  return { nombre, slug: generarSlug(nombre), hex };
}

function buscarColorDuplicado(colores, color) {
  const slug = normalizarColor(color.slug || color.nombre);
  return colores.find((item) => normalizarColor(item.slug || item.nombre) === slug);
}

const coloresLocalDriver = {
  async obtenerColores() {
    return leerColoresLocales().filter((color) => color.activo === true);
  },

  async crearColor(color) {
    const colorValidado = validarColorParaCrear(color);
    const coloresActuales = leerColoresLocales();
    const duplicado = buscarColorDuplicado(
      [...coloresActuales, ...coloresBase.map((item) => ({ ...item, nombre: item.label, slug: item.id }))],
      colorValidado,
    );

    if (duplicado) {
      return completarColor({
        id: duplicado.id || duplicado.slug,
        nombre: duplicado.nombre || duplicado.label,
        slug: duplicado.slug || duplicado.id,
        hex: duplicado.hex,
        activo: true,
      });
    }

    const nuevoColor = completarColor(colorValidado);
    guardarColoresLocales([...coloresActuales, nuevoColor]);
    return nuevoColor;
  },
};

const coloresRemotoDriver = {
  async obtenerColores() {
    const data = await llamarAppsScript({ accion: "listarColores" });
    return extraerColores(data);
  },

  async crearColor(color) {
    const colorValidado = validarColorParaCrear(color);
    const data = await llamarAppsScript({
      accion: "crearColor",
      token: ADMIN_API_TOKEN,
      color: colorValidado,
    });

    return completarColor(data.color || colorValidado);
  },
};

function obtenerDriver() {
  if (PRODUCTOS_API_CONFIG.modo === "remoto") {
    return coloresRemotoDriver;
  }

  return coloresLocalDriver;
}

export async function obtenerColores() {
  if (cacheColoresVigente()) {
    return clonarColores(coloresCache);
  }

  if (!coloresFetchPromise) {
    coloresFetchPromise = obtenerDriver()
      .obtenerColores()
      .then((coloresObtenidos) => {
        guardarColoresEnCache(coloresObtenidos);
        return clonarColores(coloresCache);
      })
      .finally(() => {
        coloresFetchPromise = null;
      });
  }

  return clonarColores(await coloresFetchPromise);
}

export async function refrescarColores() {
  invalidarColoresCache();
  const coloresObtenidos = await obtenerDriver().obtenerColores();
  guardarColoresEnCache(coloresObtenidos);
  return clonarColores(coloresCache);
}

export async function crearColor(color) {
  const colorCreado = await obtenerDriver().crearColor(color);
  invalidarColoresCache();
  return colorCreado;
}
