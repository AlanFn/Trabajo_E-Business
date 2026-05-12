import { useEffect, useState } from "react";

export default function ProductPreview({ product, imagenUrl }) {
  const [imagenConError, setImagenConError] = useState(false);
  const imagenPreviewUrl = imagenUrl || product.imagenUrl || "";

  useEffect(() => {
    setImagenConError(false);
  }, [imagenPreviewUrl]);

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
      </div>
      <h3 className="product-card__name">{product.nombre || "Producto sin nombre"}</h3>
      <p className="product-card__sub">{product.descripcionCorta || "Sin descripción corta"}</p>
      <p className="product-card__sub">Estado: {product.estadoStock}</p>

      {product.colores.length > 0 && (
        <p className="product-card__sub">Colores: {product.colores.join(", ")}</p>
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
