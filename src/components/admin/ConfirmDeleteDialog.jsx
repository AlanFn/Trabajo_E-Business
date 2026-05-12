export default function ConfirmDeleteDialog({ product, onCancel, onConfirm, isConfirming = false }) {
  if (!product) {
    return null;
  }

  return (
    <div className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-product-title">
      <div className="admin-dialog__panel">
        <h2 className="contact-form__heading" id="delete-product-title">
          Eliminar definitivamente
        </h2>
        <p className="product-card__sub">
          ¿Seguro que querés eliminar definitivamente este producto?
        </p>
        <p className="product-card__sub">
          Esta acción no se puede deshacer desde el panel. Solo se permite eliminar productos que ya
          están ocultos.
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
            {isConfirming ? "Eliminando..." : "Eliminar definitivamente"}
          </button>
        </div>
      </div>
    </div>
  );
}
