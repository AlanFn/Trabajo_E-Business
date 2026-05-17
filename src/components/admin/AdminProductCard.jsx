import { useEffect, useState } from "react";
import { categorias, subcategorias } from "../../data/categorias";
import { obtenerImagenPrincipal } from "../../utils/productoMedia";
import { formatearPrecioGs } from "../../utils/precios";

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
  const imagenPrincipal = obtenerImagenPrincipal(product);

  useEffect(() => {
    setImageError(false);
  }, [product.imagenUrl, product.imagenes]);

  return (
    <article className={`admin-product-card${product.activo ? "" : " is-hidden"}`}>
      <div className="admin-product-card__image">
        {imagenPrincipal && !imageError ? (
          <img
            src={imagenPrincipal}
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
          <p className="product-card__sub">{formatearPrecioGs(product.precio)}</p>
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
