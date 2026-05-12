import ProductCard from "./ProductCard";

export default function ProductGrid({ products, liked, onToggleLike }) {
  return (
    <div className="catalog-grid">
      {products.map((product) => (
        <ProductCard
          product={product}
          liked={liked.includes(product.id)}
          onToggleLike={() => onToggleLike(product.id)}
          key={product.id}
        />
      ))}
    </div>
  );
}
