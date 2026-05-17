import ProductCard from "./ProductCard";

export default function ProductGrid({ products, liked, onToggleLike, coloresGlobales = [] }) {
  return (
    <div className="catalog-grid">
      {products.map((product) => (
        <ProductCard
          product={product}
          liked={liked.includes(String(product.id))}
          onToggleLike={() => onToggleLike(product.id)}
          coloresGlobales={coloresGlobales}
          key={product.id}
        />
      ))}
    </div>
  );
}
