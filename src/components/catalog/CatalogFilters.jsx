import { categorias, subcategorias } from "../../data/categorias";
import { estadosStock } from "../../data/filtros";

export default function CatalogFilters({
  filtros,
  opciones,
  onChange,
  onTogglePropiedad,
  onReset,
  isOpen = false,
  onClose,
}) {
  const subcategoriasDisponibles = filtros.categoria
    ? subcategorias.filter((subcategoria) => subcategoria.categoriaId === filtros.categoria)
    : subcategorias;

  const setFiltro = (key, value) => {
    onChange({ [key]: filtros[key] === value ? "" : value });
  };

  const setCategoria = (categoriaId) => {
    onChange({
      categoria: filtros.categoria === categoriaId ? "" : categoriaId,
      subcategoria: "",
    });
  };

  return (
    <aside className={`catalog-filters${isOpen ? " catalog-filters--open" : ""}`}>
      <div className="catalog-filters__panel">
        <div className="catalog-filters__summary">
          <h2 className="catalog-filters__title">Filtros</h2>
          <button className="footer__link catalog-filters__close" type="button" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div className="catalog-filters__content">
          <div className="catalog-filters__group">
            <p className="catalog-filters__label">BUSCAR</p>
            <input
              className="contact-form__input"
              type="search"
              name="busquedaProducto"
              value={filtros.busqueda}
              placeholder="Buscar producto"
              onChange={(event) => onChange({ busqueda: event.target.value })}
            />
          </div>

          <div className="catalog-filters__group">
            <p className="catalog-filters__label">CATEGORIA</p>
            {categorias.map((category) => (
              <label className="catalog-filters__checkbox" key={category.id}>
                <input
                  type="checkbox"
                  name="categoria"
                  checked={filtros.categoria === category.id}
                  onChange={() => setCategoria(category.id)}
                />{" "}
                {category.label}
              </label>
            ))}
          </div>

          <div className="catalog-filters__group">
            <p className="catalog-filters__label">SUBCATEGORIA</p>
            {subcategoriasDisponibles.map((subcategory) => (
              <label className="catalog-filters__checkbox" key={subcategory.id}>
                <input
                  type="checkbox"
                  name="subcategoria"
                  checked={filtros.subcategoria === subcategory.id}
                  onChange={() => setFiltro("subcategoria", subcategory.id)}
                />{" "}
                {subcategory.label}
              </label>
            ))}
          </div>

          <div className="catalog-filters__group">
            <p className="catalog-filters__label">COLOR</p>
            {opciones.colores.map((color) => (
              <label className="catalog-filters__checkbox" key={color.value}>
                <input
                  type="checkbox"
                  name="color"
                  checked={filtros.color === color.value}
                  onChange={() => setFiltro("color", color.value)}
                />{" "}
                {color.label}
              </label>
            ))}
          </div>

          <div className="catalog-filters__group">
            <p className="catalog-filters__label">TALLE</p>
            <div className="catalog-filters__sizes">
              {opciones.talles.map((option) => (
                <button
                  className={`catalog-filters__size${
                    filtros.talle === option.value ? " catalog-filters__size--active" : ""
                  }`}
                  type="button"
                  onClick={() => setFiltro("talle", option.value)}
                  key={option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="catalog-filters__group">
            <p className="catalog-filters__label">PROPIEDADES</p>
            {opciones.propiedades.map((propiedad) => (
              <label className="catalog-filters__checkbox" key={propiedad.value}>
                <input
                  type="checkbox"
                  name="propiedades"
                  checked={filtros.propiedades.includes(propiedad.value)}
                  onChange={() => onTogglePropiedad(propiedad.value)}
                />{" "}
                {propiedad.label}
              </label>
            ))}
          </div>

          <div className="catalog-filters__group">
            <p className="catalog-filters__label">STOCK</p>
            {estadosStock.map((estado) => (
              <label className="catalog-filters__checkbox" key={estado.id}>
                <input
                  type="checkbox"
                  name="estadoStock"
                  checked={filtros.estadoStock === estado.id}
                  onChange={() => setFiltro("estadoStock", estado.id)}
                />{" "}
                {estado.label}
              </label>
            ))}
          </div>

          <button className="footer__link" type="button" onClick={onReset}>
            Limpiar filtros
          </button>
          <button className="contact-form__submit catalog-filters__apply" type="button" onClick={onClose}>
            Aplicar filtros
          </button>
        </div>
      </div>
    </aside>
  );
}
