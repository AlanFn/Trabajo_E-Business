import { useEffect, useMemo, useState } from "react";
import CatalogFilters from "../components/catalog/CatalogFilters";
import ProductGrid from "../components/catalog/ProductGrid";
import Select from "../components/common/Select";
import { ChevronDownIcon } from "../components/common/Icons";
import { ordenamientos } from "../data/filtros";
import { obtenerProductosActivos, refrescarProductos } from "../services/productosService";
import { filtrarProductos } from "../utils/filtrarProductos";
import {
  obtenerColoresDisponibles,
  obtenerPropiedadesDisponibles,
  obtenerTallesDisponibles,
} from "../utils/opcionesCatalogo";

const filtrosIniciales = {
  busqueda: "",
  categoria: "",
  subcategoria: "",
  color: "",
  talle: "",
  propiedades: [],
  estadoStock: "",
  orden: "recomendado",
};

export default function CatalogPage() {
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const cargarProductos = async ({ forzar = false } = {}) => {
    try {
      setLoading(true);
      setError("");
      const productosObtenidos = forzar
        ? (await refrescarProductos()).filter((producto) => producto.activo === true)
        : await obtenerProductosActivos();

      setProductos(productosObtenidos);
    } catch (loadError) {
      console.error(loadError);
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const productosFiltrados = useMemo(
    () => filtrarProductos(productos, filtros),
    [productos, filtros],
  );
  const opcionesFiltros = useMemo(
    () => ({
      colores: obtenerColoresDisponibles(productos),
      talles: obtenerTallesDisponibles(productos),
      propiedades: obtenerPropiedadesDisponibles(productos),
    }),
    [productos],
  );

  const updateFiltros = (changes) => {
    setFiltros((current) => ({ ...current, ...changes }));
  };

  const togglePropiedad = (propiedad) => {
    setFiltros((current) => ({
      ...current,
      propiedades: current.propiedades.includes(propiedad)
        ? current.propiedades.filter((item) => item !== propiedad)
        : [...current.propiedades, propiedad],
    }));
  };

  const toggleLike = (productId) => {
    setLiked((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  return (
    <main className="page page--catalogo" id="page-catalogo">
      <div className="catalog-layout">
        <button
          className="contact-form__submit catalog-filter-toggle"
          type="button"
          onClick={() => setFiltersOpen(true)}
        >
          Filtros
        </button>
        <button
          className={`catalog-filter-backdrop${filtersOpen ? " catalog-filter-backdrop--open" : ""}`}
          type="button"
          aria-label="Cerrar filtros"
          onClick={() => setFiltersOpen(false)}
        />
        <CatalogFilters
          filtros={filtros}
          opciones={opcionesFiltros}
          onChange={updateFiltros}
          onTogglePropiedad={togglePropiedad}
          onReset={() => setFiltros(filtrosIniciales)}
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
        />

        <div className="catalog-main">
          <div className="catalog-header">
            <div>
              <h1 className="catalog-header__title">Indumentaria de Trabajo</h1>
              <p className="product-card__sub">
                {productosFiltrados.length} producto{productosFiltrados.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="catalog-header__sort">
              <button
                className="footer__link"
                type="button"
                onClick={() => cargarProductos({ forzar: true })}
                disabled={loading}
              >
                Actualizar catálogo
              </button>
              <label htmlFor="sortBy">Ordenar por:</label>
              <div className="catalog-header__select-wrapper">
                <Select
                  id="sortBy"
                  className="catalog-header__select"
                  options={ordenamientos}
                  value={filtros.orden}
                  onChange={(event) => updateFiltros({ orden: event.target.value })}
                />
                <ChevronDownIcon />
              </div>
            </div>
          </div>

          {loading && (
            <div className="catalog-load-state" role="status">
              <p>Cargando productos...</p>
            </div>
          )}
          {!loading && error && (
            <div className="catalog-load-state catalog-load-state--error" role="alert">
              <p>{error}</p>
              <button className="footer__link" type="button" onClick={() => cargarProductos()}>
                Reintentar
              </button>
            </div>
          )}
          {!loading && !error && productosFiltrados.length > 0 ? (
            <ProductGrid products={productosFiltrados} liked={liked} onToggleLike={toggleLike} />
          ) : null}
          {!loading && !error && productosFiltrados.length === 0 ? (
            <div className="catalog-empty-state">
              <p>No se encontraron productos con los filtros seleccionados.</p>
              <button className="footer__link" type="button" onClick={() => setFiltros(filtrosIniciales)}>
                Limpiar filtros
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
