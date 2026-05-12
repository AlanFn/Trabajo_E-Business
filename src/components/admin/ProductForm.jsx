import { useEffect, useMemo, useRef, useState } from "react";
import { categorias, subcategorias } from "../../data/categorias";
import { estadosStock } from "../../data/filtros";
import {
  crearSlug,
  obtenerColoresDisponibles,
  obtenerPropiedadesDisponibles,
  obtenerTallesDisponibles,
} from "../../utils/opcionesCatalogo";
import { normalizarImagenUrl } from "../../utils/imagenes";
import CreatableTagSelector from "../common/CreatableTagSelector";
import ProductPreview from "./ProductPreview";

const emptyProduct = {
  id: "",
  nombre: "",
  categoria: "indumentaria-proteccion",
  subcategoria: "proteccion-cuerpo-completo",
  tipo: "",
  descripcionCorta: "",
  descripcionLarga: [],
  colores: [],
  talles: [],
  medidas: [],
  caracteristicas: [],
  propiedades: [],
  estadoStock: "consultar",
  activo: true,
  destacado: false,
  imagenUrl: "",
};

function arrayToText(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function textToArray(value) {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function productToForm(product) {
  const source = product || emptyProduct;

  return {
    ...emptyProduct,
    ...source,
    descripcionLarga: arrayToText(source.descripcionLarga),
    colores: Array.isArray(source.colores) ? source.colores : [],
    talles: Array.isArray(source.talles) ? source.talles : [],
    medidas: Array.isArray(source.medidas) ? source.medidas : [],
    caracteristicas: Array.isArray(source.caracteristicas) ? source.caracteristicas : [],
    propiedades: Array.isArray(source.propiedades) ? source.propiedades : [],
  };
}

function formToProduct(form) {
  return {
    ...form,
    descripcionLarga: textToArray(form.descripcionLarga),
  };
}

function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean))];
}

export default function ProductForm({ product, products = [], onSubmit, onCancel, isSaving = false }) {
  const [form, setForm] = useState(() => productToForm(product));
  const submitLockedRef = useRef(false);
  const imagenPreviewUrl = useMemo(() => normalizarImagenUrl(form.imagenUrl), [form.imagenUrl]);
  const previewProduct = useMemo(
    () => ({
      ...formToProduct(form),
      imagenUrl: imagenPreviewUrl,
    }),
    [form, imagenPreviewUrl],
  );
  const colorOptions = useMemo(() => obtenerColoresDisponibles(products), [products]);
  const talleOptions = useMemo(() => obtenerTallesDisponibles(products), [products]);
  const propiedadOptions = useMemo(() => obtenerPropiedadesDisponibles(products), [products]);
  const medidaOptions = useMemo(
    () =>
      uniqueStrings(products.flatMap((producto) => producto.medidas)).map((medida) => ({
        value: medida,
        label: medida,
      })),
    [products],
  );
  const caracteristicaOptions = useMemo(
    () =>
      uniqueStrings(products.flatMap((producto) => producto.caracteristicas)).map(
        (caracteristica) => ({
          value: caracteristica,
          label: caracteristica,
        }),
      ),
    [products],
  );
  const subcategoriasDisponibles = subcategorias.filter(
    (subcategoria) => subcategoria.categoriaId === form.categoria,
  );

  useEffect(() => {
    if (!isSaving) {
      submitLockedRef.current = false;
    }
  }, [isSaving]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateCategoria = (categoria) => {
    const subcategoriaActualValida = subcategorias.some(
      (subcategoria) => subcategoria.id === form.subcategoria && subcategoria.categoriaId === categoria,
    );
    const primeraSubcategoria = subcategorias.find(
      (subcategoria) => subcategoria.categoriaId === categoria,
    );

    setForm((current) => ({
      ...current,
      categoria,
      subcategoria: subcategoriaActualValida ? current.subcategoria : primeraSubcategoria?.id || "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSaving || submitLockedRef.current) {
      return;
    }

    submitLockedRef.current = true;
    onSubmit(formToProduct(form));
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <fieldset className="admin-form__fields" disabled={isSaving}>
        <div className="contact-form__row">
          <div className="contact-form__group">
            <label className="contact-form__label" htmlFor="adminNombre">
              Nombre
            </label>
            <input
              className="contact-form__input"
              id="adminNombre"
              name="nombre"
              value={form.nombre}
              onChange={(event) => updateField("nombre", event.target.value)}
              required
            />
          </div>
          <div className="contact-form__group">
            <label className="contact-form__label" htmlFor="adminTipo">
              Tipo
            </label>
            <input
              className="contact-form__input"
              id="adminTipo"
              name="tipo"
              value={form.tipo}
              onChange={(event) => updateField("tipo", event.target.value)}
            />
          </div>
        </div>

        <div className="contact-form__row">
          <div className="contact-form__group">
            <label className="contact-form__label" htmlFor="adminCategoria">
              Categoría
            </label>
            <select
              className="contact-form__select"
              id="adminCategoria"
              name="categoria"
              value={form.categoria}
              onChange={(event) => updateCategoria(event.target.value)}
              required
            >
              {categorias.map((categoria) => (
                <option value={categoria.id} key={categoria.id}>
                  {categoria.label}
                </option>
              ))}
            </select>
          </div>
          <div className="contact-form__group">
            <label className="contact-form__label" htmlFor="adminSubcategoria">
              Subcategoría
            </label>
            <select
              className="contact-form__select"
              id="adminSubcategoria"
              name="subcategoria"
              value={form.subcategoria}
              onChange={(event) => updateField("subcategoria", event.target.value)}
            >
              {subcategoriasDisponibles.map((subcategoria) => (
                <option value={subcategoria.id} key={subcategoria.id}>
                  {subcategoria.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="contact-form__group">
          <label className="contact-form__label" htmlFor="adminDescripcionCorta">
            Descripción corta
          </label>
          <input
            className="contact-form__input"
            id="adminDescripcionCorta"
            name="descripcionCorta"
            value={form.descripcionCorta}
            onChange={(event) => updateField("descripcionCorta", event.target.value)}
            required
          />
        </div>

        <div className="contact-form__group">
          <label className="contact-form__label" htmlFor="adminDescripcionLarga">
            Descripción larga
          </label>
          <textarea
            className="contact-form__textarea"
            id="adminDescripcionLarga"
            name="descripcionLarga"
            value={form.descripcionLarga}
            onChange={(event) => updateField("descripcionLarga", event.target.value)}
            placeholder="Una línea por descripción."
          />
        </div>

        <CreatableTagSelector
          label="Colores disponibles"
          helperText="Seleccioná colores existentes o agregá uno nuevo con +."
          options={colorOptions}
          value={form.colores}
          onChange={(value) => updateField("colores", value)}
          placeholder="Seleccionar color"
        />

        <CreatableTagSelector
          label="Talles disponibles"
          helperText="Seleccioná los talles disponibles. Si no usa talle, dejalo vacío o usá Único."
          options={talleOptions}
          value={form.talles}
          onChange={(value) => updateField("talles", value)}
          placeholder="Seleccionar talle"
        />

        <CreatableTagSelector
          label="Medidas"
          helperText="Agregá medidas si el producto las necesita."
          options={medidaOptions}
          value={form.medidas}
          onChange={(value) => updateField("medidas", value)}
          placeholder="Seleccionar medida"
        />

        <CreatableTagSelector
          label="Características visibles"
          helperText="Estas características se mostrarán al comprador en la ficha del producto."
          options={caracteristicaOptions}
          value={form.caracteristicas}
          onChange={(value) => updateField("caracteristicas", value)}
          placeholder="Seleccionar característica"
        />

        <CreatableTagSelector
          label="Propiedades para filtros"
          helperText="Seleccioná propiedades existentes o agregá una nueva con +."
          options={propiedadOptions}
          value={form.propiedades}
          onChange={(value) => updateField("propiedades", value)}
          placeholder="Seleccionar propiedad"
          createValue={crearSlug}
        />

        <div className="contact-form__row">
          <div className="contact-form__group">
            <label className="contact-form__label" htmlFor="adminEstadoStock">
              Estado de stock
            </label>
            <select
              className="contact-form__select"
              id="adminEstadoStock"
              name="estadoStock"
              value={form.estadoStock}
              onChange={(event) => updateField("estadoStock", event.target.value)}
              required
            >
              {estadosStock.map((estado) => (
                <option value={estado.id} key={estado.id}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>
          <div className="contact-form__group">
            <label className="contact-form__label" htmlFor="adminImagenUrl">
              Link de imagen
            </label>
            <input
              className="contact-form__input"
              id="adminImagenUrl"
              name="imagenUrl"
              value={form.imagenUrl}
              onChange={(event) => updateField("imagenUrl", event.target.value)}
            />
            <p className="tag-selector__helper">
              Pegá un enlace directo de imagen o un enlace compartido de Google Drive.
            </p>
          </div>
        </div>

        <div className="admin-form__checks">
          <label className="catalog-filters__checkbox">
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={(event) => updateField("activo", event.target.checked)}
            />{" "}
            Activo
          </label>
          <label className="catalog-filters__checkbox">
            <input
              type="checkbox"
              name="destacado"
              checked={form.destacado}
              onChange={(event) => updateField("destacado", event.target.checked)}
            />{" "}
            Destacado
          </label>
        </div>

        <div className="admin-actions">
          <button className="contact-form__submit" type="submit" disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar producto"}
          </button>
          <button className="footer__link" type="button" onClick={onCancel} disabled={isSaving}>
            Cancelar
          </button>
        </div>
      </fieldset>

      <ProductPreview product={previewProduct} imagenUrl={imagenPreviewUrl} />
    </form>
  );
}
