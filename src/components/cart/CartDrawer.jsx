import { useMemo } from "react";
import { useCart } from "../../context/CartContext";
import { formatearPrecioGs, obtenerNumeroPrecio } from "../../utils/precios";
import { whatsappCartLink } from "../../utils/whatsapp";
import { WhatsAppIcon } from "../common/Icons";

function prepararItems(items) {
  return items.map((item) => {
    const precioNumero = obtenerNumeroPrecio(item.precio);
    const subtotal = precioNumero ? precioNumero * item.cantidad : null;

    return {
      ...item,
      precioNumero,
      precioTexto: precioNumero ? formatearPrecioGs(precioNumero) : "",
      subtotal,
      subtotalTexto: subtotal ? formatearPrecioGs(subtotal) : "",
    };
  });
}

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    clearCart,
    increaseItem,
    decreaseItem,
    removeItem,
    getItemKey,
  } = useCart();
  const itemsPreparados = useMemo(() => prepararItems(items), [items]);
  const totalParcial = itemsPreparados.reduce((total, item) => total + (item.subtotal || 0), 0);
  const tieneSinPrecio = itemsPreparados.some((item) => !item.precioNumero);
  const resumen = {
    totalTexto: !tieneSinPrecio && totalParcial > 0 ? formatearPrecioGs(totalParcial) : "",
    totalParcialTexto: tieneSinPrecio && totalParcial > 0 ? formatearPrecioGs(totalParcial) : "",
  };
  const whatsappHref = whatsappCartLink(itemsPreparados, resumen);

  if (!isCartOpen) {
    return null;
  }

  return (
    <div className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <button className="cart-drawer__backdrop" type="button" onClick={closeCart} aria-label="Cerrar carrito" />
      <aside className="cart-drawer__panel">
        <div className="cart-drawer__header">
          <div>
            <p className="catalog-filters__label">Carrito de consulta</p>
            <h2 className="cart-drawer__title" id="cart-title">
              Tu consulta
            </h2>
          </div>
          <button className="footer__link" type="button" onClick={closeCart}>
            Cerrar
          </button>
        </div>

        {itemsPreparados.length === 0 ? (
          <div className="cart-drawer__empty">Todavia no agregaste productos.</div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {itemsPreparados.map((item) => {
                const key = getItemKey(item);

                return (
                  <article className="cart-item" key={key}>
                    <div className="cart-item__image">
                      {item.imagenUrl ? <img src={item.imagenUrl} alt={item.nombre} /> : <span>Sin imagen</span>}
                    </div>
                    <div className="cart-item__body">
                      <h3 className="cart-item__name">{item.nombre}</h3>
                      <p className="cart-item__meta">
                        {[item.color && `Color: ${item.color}`, item.talle && `Talle: ${item.talle}`]
                          .filter(Boolean)
                          .join(" · ") || "Sin variantes"}
                      </p>
                      <p className="cart-item__price">{item.precioTexto || "Precio a consultar"}</p>
                      {item.subtotalTexto && <p className="cart-item__meta">Subtotal: {item.subtotalTexto}</p>}
                      <div className="cart-item__actions">
                        <div className="quantity-stepper">
                          <button type="button" onClick={() => decreaseItem(key)} aria-label="Disminuir cantidad">
                            -
                          </button>
                          <span>{item.cantidad}</span>
                          <button type="button" onClick={() => increaseItem(key)} aria-label="Aumentar cantidad">
                            +
                          </button>
                        </div>
                        <button className="footer__link admin-link--danger" type="button" onClick={() => removeItem(key)}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="cart-drawer__summary">
              {resumen.totalTexto && <p>Total estimado: {resumen.totalTexto}</p>}
              {resumen.totalParcialTexto && <p>Total parcial: {resumen.totalParcialTexto}</p>}
              {tieneSinPrecio && <span>Hay productos con precio a consultar.</span>}
            </div>

            <div className="cart-drawer__footer">
              <a className="product-card__add" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                Enviar consulta por WhatsApp
              </a>
              <button className="footer__link" type="button" onClick={clearCart}>
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
