import { useEffect, useState } from "react";
import { categorias, subcategorias } from "../../data/categorias";

function obtenerLabel(lista, id) {
  return lista.find((item) => item.id === id)?.label || id || "Sin definir";
}

export default function AdminProductCard({
  product,
  onEdit,
  onHide,
  onReactivate,
  onDeletePermanent,
  actionType = "",
}) {
  const isProcessing = Boolean(actionType);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [product.imagenUrl]);

  return (
    <article className={`admin-product-card${product.activo ? "" : " is-hidden"}`}>
      <div className="admin-product-card__image">
        {product.imagenUrl && !imageError ? (
          <img
            src={product.imagenUrl}
            alt={product.nombre}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>Sin imagen</span>
        )}
      </div>
      <div className="admin-product-card__body">
        <div>
          <h3 className="product-card__name">{product.nombre}</h3>
          <p className="product-card__sub">{obtenerLabel(categorias, product.categoria)}</p>
          <p className="product-card__sub">{obtenerLabel(subcategorias, product.subcategoria)}</p>
        </div>
        <div className="admin-product-card__meta">
          <span className={`admin-pill${product.activo ? " admin-pill--active" : ""}`}>
            {product.activo ? "Activo" : "Oculto"}
          </span>
          <span className="admin-pill">{product.estadoStock}</span>
        </div>
        <div className="admin-actions">
          <button
            className="footer__link"
            type="button"
            onClick={() => onEdit(product)}
            disabled={isProcessing}
          >
            Editar
          </button>
          {product.activo ? (
            <button
              className="footer__link"
              type="button"
              onClick={() => onHide(product)}
              disabled={isProcessing}
            >
              {actionType === "ocultar" ? "Ocultando..." : "Ocultar"}
            </button>
          ) : (
            <>
              <button
                className="footer__link"
                type="button"
                onClick={() => onReactivate(product.id)}
                disabled={isProcessing}
              >
                {actionType === "reactivar" ? "Reactivando..." : "Reactivar"}
              </button>
              <button
                className="footer__link admin-link--danger"
                type="button"
                onClick={() => onDeletePermanent(product)}
                disabled={isProcessing}
              >
                {actionType === "eliminar" ? "Eliminando..." : "Eliminar definitivamente"}
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
