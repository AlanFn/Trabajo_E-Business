import { useEffect, useState } from "react";
import { getColorHex } from "../../data/filtros";
import { normalizarImagenesProducto } from "../../utils/productoMedia";
import { formatearPrecioGs } from "../../utils/precios";

export default function ProductPreview({ product, coloresGlobales = [] }) {
  const [imagenConError, setImagenConError] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const imagenes = normalizarImagenesProducto(product);
  const imagenPreviewUrl = imagenes[currentImage] || "";
  const hasMultipleImages = imagenes.length > 1;

  useEffect(() => {
    setImagenConError(false);
    setCurrentImage(0);
  }, [product.imagenUrl, product.imagenes]);

  const goToImage = (step) => {
    if (!imagenes.length) return;
    setImagenConError(false);
    setCurrentImage((current) => (current + step + imagenes.length) % imagenes.length);
  };

  return (
    <aside className="admin-preview">
      <p className="catalog-filters__label">Vista previa</p>
      <div className="admin-preview__image">
        {imagenPreviewUrl && !imagenConError ? (
          <img
            src={imagenPreviewUrl}
            alt={product.nombre || "Producto sin nombre"}
            loading="lazy"
            decoding="async"
            onError={() => setImagenConError(true)}
          />
        ) : (
          <span>{imagenPreviewUrl ? "No se pudo cargar la imagen" : "Sin imagen"}</span>
        )}
        {hasMultipleImages && (
          <div className="admin-preview__gallery-controls">
            <button type="button" onClick={() => goToImage(-1)} aria-label="Imagen anterior">
              {"<"}
            </button>
            <span>
              {currentImage + 1} / {imagenes.length}
            </span>
            <button type="button" onClick={() => goToImage(1)} aria-label="Imagen siguiente">
              {">"}
            </button>
          </div>
        )}
      </div>
      <h3 className="product-card__name">{product.nombre || "Producto sin nombre"}</h3>
      <p className="product-card__sub">{product.descripcionCorta || "Sin descripción corta"}</p>
      <p className="product-card__sub">Estado: {product.estadoStock}</p>
      <p className="product-card__sub">{formatearPrecioGs(product.precio)}</p>

      {product.colores.length > 0 && (
        <div className="product-card__colors admin-preview__colors" aria-label="Colores del producto">
          {product.colores.map((color) => (
            <span className="product-card__color-option" key={color}>
              <span
                className="product-card__color"
                style={{ background: getColorHex(color, coloresGlobales) }}
                aria-hidden="true"
              />
              <span>{color}</span>
            </span>
          ))}
        </div>
      )}
      {product.talles.length > 0 && (
        <p className="product-card__sub">Talles: {product.talles.join(", ")}</p>
      )}
      {product.caracteristicas.length > 0 && (
        <ul className="admin-preview__list">
          {product.caracteristicas.slice(0, 4).map((caracteristica) => (
            <li key={caracteristica}>{caracteristica}</li>
          ))}
        </ul>
      )}
    </aside>
  );
}
