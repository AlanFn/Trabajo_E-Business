import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { obtenerImagenPrincipal } from "../utils/productoMedia";

const CART_STORAGE_KEY = "vtech_cart";
const CartContext = createContext(null);

function crearItemKey(item) {
  return [item.productoId, item.color || "", item.talle || ""].join("::");
}

function leerCarritoInicial() {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(leerCarritoInicial);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addProduct = (product, opciones = {}) => {
    const cantidad = Math.max(1, Number(opciones.cantidad) || 1);
    const color = opciones.color || "";
    const talle = opciones.talle || "";
    const item = {
      productoId: product.id,
      nombre: product.nombre,
      imagenUrl: obtenerImagenPrincipal(product),
      precio: product.precio || "",
      color,
      talle,
      cantidad,
    };
    const key = crearItemKey(item);

    setItems((current) => {
      const index = current.findIndex((currentItem) => crearItemKey(currentItem) === key);

      if (index === -1) {
        return [...current, item];
      }

      return current.map((currentItem, itemIndex) =>
        itemIndex === index
          ? { ...currentItem, cantidad: currentItem.cantidad + cantidad }
          : currentItem,
      );
    });
    setIsCartOpen(true);
  };

  const increaseItem = (key) => {
    setItems((current) =>
      current.map((item) =>
        crearItemKey(item) === key ? { ...item, cantidad: item.cantidad + 1 } : item,
      ),
    );
  };

  const decreaseItem = (key) => {
    setItems((current) =>
      current
        .map((item) =>
          crearItemKey(item) === key
            ? { ...item, cantidad: Math.max(1, item.cantidad - 1) }
            : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  };

  const removeItem = (key) => {
    setItems((current) => current.filter((item) => crearItemKey(item) !== key));
  };

  const clearCart = () => setItems([]);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const totalQuantity = items.reduce((total, item) => total + item.cantidad, 0);

  const value = useMemo(
    () => ({
      items,
      totalQuantity,
      isCartOpen,
      addProduct,
      increaseItem,
      decreaseItem,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      getItemKey: crearItemKey,
    }),
    [items, totalQuantity, isCartOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider.");
  }

  return context;
}
