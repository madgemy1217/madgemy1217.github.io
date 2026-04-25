import { Link } from "@tanstack/react-router";
import { type Product, formatPrice } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="product-card-hover group block rounded-3xl border border-border bg-card p-6 fade-in-up"
    >
      <div className="aspect-square mb-4 overflow-hidden rounded-2xl bg-secondary/40 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          width={400}
          height={400}
        />
      </div>
      <div className="space-y-1">
        <div className="text-xs uppercase tracking-wider text-primary/80">{product.category}</div>
        <h3 className="text-base font-semibold">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1">{product.tagline}</p>
        <div className="flex items-baseline gap-2 pt-2">
          <div className="text-base font-semibold">{formatPrice(product.price)}</div>
          {product.oldPrice && (
            <div className="text-xs text-muted-foreground line-through">
              {formatPrice(product.oldPrice)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
