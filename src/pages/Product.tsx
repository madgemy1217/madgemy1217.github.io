import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Shell } from "@/components/Layout";
import { loadCatalog, type Product } from "@/lib/products";
import { money } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [variantIdx, setVariantIdx] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);
  const { add } = useCart();

  useEffect(() => {
    setLoading(true);
    loadCatalog()
      .then((c) => setProduct(c.products.find((p) => p.slug === slug) ?? null))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Shell><p className="text-muted-foreground">Загрузка…</p></Shell>;
  if (!product) return <Shell><p>Товар не найден. <Link to="/" className="text-primary underline">На главную</Link></p></Shell>;

  const variant = product.variants[variantIdx];
  const color = product.colors[colorIdx];
  const finalPrice = product.price + (variant?.price_delta ?? 0);
  const allImages = product.image ? [{ url: product.image, alt: product.name }, ...product.images] : product.images;

  return (
    <Shell>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          {allImages.map((img, i) => (
            <div key={i} className="aspect-square bg-secondary/30 rounded-xl overflow-hidden">
              <img src={img.url} alt={img.alt ?? product.name} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          {product.tagline && <p className="mt-2 text-lg text-muted-foreground">{product.tagline}</p>}

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{money(finalPrice)}</span>
            {product.old_price && <span className="text-lg text-muted-foreground line-through">{money(product.old_price)}</span>}
          </div>

          {product.variants.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Вариант</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setVariantIdx(i)}
                    className={`px-3 py-2 rounded-md border text-sm ${variantIdx === i ? "border-primary bg-primary/10" : "hover:bg-secondary"}`}
                  >
                    {v.name}{v.price_delta ? ` (+${money(v.price_delta)})` : ""}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-medium mb-2">Цвет: {color?.name}</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setColorIdx(i)}
                    title={c.name}
                    className={`h-9 w-9 rounded-full border-2 ${colorIdx === i ? "border-primary" : "border-border"}`}
                    style={{ background: c.hex }}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              const name = `${product.name}${variant ? `, ${variant.name}` : ""}${color ? `, ${color.name}` : ""}`;
              add({ id: `${product.id}|${variantIdx}|${colorIdx}`, name, price: finalPrice, image: product.image });
              toast.success("Добавлено в корзину");
            }}
            className="mt-8 w-full md:w-auto px-8 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90"
          >В корзину</button>

          {product.description && <p className="mt-8 text-muted-foreground leading-relaxed">{product.description}</p>}

          {product.specs.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-3">Характеристики</h2>
              <dl className="divide-y border rounded-lg overflow-hidden">
                {product.specs.map((s, i) => (
                  <div key={i} className="grid grid-cols-2 px-4 py-2 text-sm">
                    <dt className="text-muted-foreground">{s.key}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
