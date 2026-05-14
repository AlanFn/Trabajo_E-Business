import { useEffect, useState } from "react";
import { getColorHex } from "../../data/filtros";
import { HeartIcon } from "../common/Icons";
import WhatsAppButton from "./WhatsAppButton";

const stockLabels = {
  disponible: "Disponible",
  consultar: "Consultar",
  agotado: "Agotado",
};

export default function ProductCard({ product, liked, onToggleLike }) {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedTalle, setSelectedTalle] = useState("");
  const [imageError, setImageError] = useState(false);

  const hasColors = product.colores.length > 0;
  const hasTalles = product.talles.length > 0;

  useEffect(() => {
    setImageError(false);
  }, [product.imagenUrl]);

  return (
    <article className="product-card">
      <div className="product-card__image-wrapper">
        {product.destacado && (
          <span className="product-card__badge product-card__badge--new">DESTACADO</span>
        )}
        <div className="product-card__image-frame">
          {product.imagenUrl && !imageError ? (
            <img
              src={product.imagenUrl}
              alt={product.nombre}
              className="product-card__image"
              loading="lazy"
              decoding="async"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="product-card__image-placeholder">Sin imagen</span>
          )}
        </div>
      </div>
      <div className="product-card__body">
        <div className="product-card__info">
          <h3 className="product-card__name">{product.nombre}</h3>
          <button
            className={`product-card__wishlist-inline${liked ? " is-liked" : ""}`}
            type="button"
            aria-label="Favoritos"
            onClick={onToggleLike}
          >
            <HeartIcon />
          </button>
        </div>
        <p className="product-card__sub">{product.descripcionCorta}</p>

        {hasColors && (
          <div className="product-card__colors" aria-label="Colores disponibles">
            {product.colores.map((color) => (
              <button
                className="product-card__color"
                style={{
                  background: getColorHex(color),
                  outlineColor: selectedColor === color ? "rgba(0,0,0,0.45)" : "transparent",
                }}
                title={color}
                type="button"
                aria-label={`Color ${color}`}
                onClick={() => setSelectedColor((current) => (current === color ? "" : color))}
                key={color}
              />
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
                onClick={() => setSelectedTalle((current) => (current === talle ? "" : talle))}
                key={talle}
              >
                {talle}
              </button>
            ))}
          </div>
        )}

        <p className="product-card__sub">{stockLabels[product.estadoStock]}</p>

        <div className="product-card__footer">
          <WhatsAppButton
            product={product}
            selectedColor={selectedColor}
            selectedTalle={selectedTalle}
          />
        </div>
      </div>
    </article>
  );
}
