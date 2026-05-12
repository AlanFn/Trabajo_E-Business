export default function DeleteProductDialog({ product, onCancel, onConfirm, isConfirming = false }) {
  if (!product) {
    return null;
  }

  return (
    <div className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="hide-product-title">
      <div className="admin-dialog__panel">
        <h2 className="contact-form__heading" id="hide-product-title">
          Ocultar producto
        </h2>
        <p className="product-card__sub">
          ¿Seguro que desea ocultar este producto del catálogo? El producto dejará de aparecer
          para los compradores, pero podrá reactivarse luego.
        </p>
        <p className="product-card__name">{product.nombre}</p>
        <div className="admin-actions">
          <button className="footer__link" type="button" onClick={onCancel} disabled={isConfirming}>
            Cancelar
          </button>
          <button
            className="contact-form__submit admin-button--danger"
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? "Ocultando..." : "Ocultar producto"}
          </button>
        </div>
      </div>
    </div>
  );
}
