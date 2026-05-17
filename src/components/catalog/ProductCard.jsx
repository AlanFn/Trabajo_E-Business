import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { getColorHex } from "../../data/filtros";
import { formatearPrecioGs } from "../../utils/precios";
import { normalizarImagenesProducto } from "../../utils/productoMedia";
import { CartIcon, ChevronLeftIcon, ChevronRightIcon, HeartIcon } from "../common/Icons";

const stockLabels = {
  disponible: "Disponible",
  consultar: "Consultar",
  agotado: "Agotado",
};

export default function ProductCard({ product, liked, onToggleLike, coloresGlobales = [] }) {
  const { addProduct } = useCart();
  const imagenes = normalizarImagenesProducto(product);
  const [currentImage, setCurrentImage] = useState(0);
  const [failedImages, setFailedImages] = useState(() => new Set());
  const [selectedColor, setSelectedColor] = useState(product.colores[0] || "");
  const [selectedTalle, setSelectedTalle] = useState(product.talles[0] || "");
  const [quantity, setQuantity] = useState(1);

  const hasColors = product.colores.length > 0;
  const hasTalles = product.talles.length > 0;
  const hasMultipleImages = imagenes.length > 1;
  const currentImageUrl = imagenes[currentImage] || "";
  const imageHasError = failedImages.has(currentImageUrl);

  useEffect(() => {
    setCurrentImage(0);
    setFailedImages(new Set());
    setSelectedColor(product.colores[0] || "");
    setSelectedTalle(product.talles[0] || "");
    setQuantity(1);
  }, [product.id, product.imagenUrl, product.imagenes, product.colores, product.talles]);

  const goToImage = (step) => {
    if (!imagenes.length) return;
    setCurrentImage((current) => (current + step + imagenes.length) % imagenes.length);
  };

  const markImageError = () => {
    setFailedImages((current) => {
      const next = new Set(current);
      next.add(currentImageUrl);
      return next;
    });
  };

  const updateQuantity = (step) => {
    setQuantity((current) => Math.max(1, current + step));
  };

  const handleAddToCart = () => {
    addProduct(product, {
      color: hasColors ? selectedColor || product.colores[0] : "",
      talle: hasTalles ? selectedTalle || product.talles[0] : "",
      cantidad: quantity,
    });
  };

  return (
    <article className="product-card">
      <div className="product-card__image-wrapper">
        {product.destacado && (
          <span className="product-card__badge product-card__badge--new">DESTACADO</span>
        )}
        <div className="product-card__image-frame">
          {currentImageUrl && !imageHasError ? (
            <img
              src={currentImageUrl}
              alt={product.nombre}
              className="product-card__image"
              loading="lazy"
              decoding="async"
              onError={markImageError}
            />
          ) : (
            <span className="product-card__image-placeholder">Sin imagen</span>
          )}
        </div>

        {hasMultipleImages && (
          <div className="product-card__gallery-controls">
            <button type="button" onClick={() => goToImage(-1)} aria-label="Imagen anterior">
              <ChevronLeftIcon />
            </button>
            <span>
              {currentImage + 1} / {imagenes.length}
            </span>
            <button type="button" onClick={() => goToImage(1)} aria-label="Imagen siguiente">
              <ChevronRightIcon />
            </button>
          </div>
        )}
      </div>
      <div className="product-card__body">
        <div className="product-card__info">
          <h3 className="product-card__name">{product.nombre}</h3>
          <button
            className={`product-card__wishlist-inline${liked ? " is-liked" : ""}`}
            type="button"
            aria-label={liked ? "Quitar de favoritos" : "Agregar a favoritos"}
            aria-pressed={liked}
            onClick={onToggleLike}
          >
            <HeartIcon />
          </button>
        </div>
        <p className="product-card__sub">{product.descripcionCorta}</p>
        <p className="product-card__price">{formatearPrecioGs(product.precio)}</p>

        {hasColors && (
          <div className="product-card__colors" aria-label="Colores disponibles">
            {product.colores.map((color) => (
              <button
                className={`product-card__color-option${selectedColor === color ? " is-selected" : ""}`}
                type="button"
                onClick={() => setSelectedColor(color)}
                key={color}
              >
                <span
                  className="product-card__color"
                  style={{ background: getColorHex(color, coloresGlobales) }}
                  aria-hidden="true"
                />
                <span>{color}</span>
              </button>
            ))}
          </div>
        )}

        {hasTalles && (
          <div className="catalog-filters__sizes" aria-label="Talles disponibles">
            {product.talles.map((talle) => (
              <button
                className={`catalog-filters__size${
                  selectedTalle === talle ? " catalog-filters__size--active" : ""
                }`}
                type="button"
                onClick={() => setSelectedTalle(talle)}
                key={talle}
              >
                {talle}
              </button>
            ))}
          </div>
        )}

        <p className="product-card__sub">{stockLabels[product.estadoStock]}</p>

        <div className="product-card__footer">
          <div className="quantity-stepper" aria-label="Cantidad">
            <button type="button" onClick={() => updateQuantity(-1)} aria-label="Disminuir cantidad">
              -
            </button>
            <span>{quantity}</span>
            <button type="button" onClick={() => updateQuantity(1)} aria-label="Aumentar cantidad">
              +
            </button>
          </div>
          <button className="product-card__add" type="button" onClick={handleAddToCart}>
            <CartIcon />
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  );
}
