import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header, Footer } from "@/components/Layout";
import { fetchProductBySlug, type Product, type ProductColor, type ProductVariant, type ProductSpec, type ProductImage } from "@/lib/products";
import { money } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  component: ProductPage,
});

function ProductPage() {
  const { slug } = useParams({ from: "/product/$slug" });
  const [data, setData] = useState<{
    product: Product;
    colors: ProductColor[];
    variants: ProductVariant[];
    specs: ProductSpec[];
    images: ProductImage[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [colorId, setColorId] = useState<string | null>(null);
  const { add } = useCart();

  useEffect(() => {
    setLoading(true);
    fetchProductBySlug(slug)
      .then((d) => {
        setData(d);
        if (d?.variants[0]) setVariantId(d.variants[0].id);
        if (d?.colors[0]) setColorId(d.colors[0].id);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Shell><p className="text-muted-foreground">Загрузка…</p></Shell>;
  if (!data) return <Shell><p>Товар не найден. <Link to="/" className="text-primary underline">На главную</Link></p></Shell>;

  const { product, colors, variants, specs, images } = data;
  const variant = variants.find((v) => v.id === variantId);
  const color = colors.find((c) => c.id === colorId);
  const finalPrice = product.price + (variant?.price_delta ?? 0);
  const allImages = product.image ? [{ url: product.image, alt: product.name }, ...images] : images;

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

          {variants.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Вариант</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariantId(v.id)}
                    className={`px-3 py-2 rounded-md border text-sm ${variantId === v.id ? "border-primary bg-primary/10" : "hover:bg-secondary"}`}
                  >
                    {v.name}{v.price_delta ? ` (+${money(v.price_delta)})` : ""}
                  </button>
                ))}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-medium mb-2">Цвет: {color?.name}</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColorId(c.id)}
                    title={c.name}
                    className={`h-9 w-9 rounded-full border-2 ${colorId === c.id ? "border-primary" : "border-border"}`}
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
              add({ id: `${product.id}|${variantId ?? ""}|${colorId ?? ""}`, name, price: finalPrice, image: product.image });
              toast.success("Добавлено в корзину");
            }}
            className="mt-8 w-full md:w-auto px-8 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90"
          >
            В корзину
          </button>

          {product.description && <p className="mt-8 text-muted-foreground leading-relaxed">{product.description}</p>}

          {specs.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-3">Характеристики</h2>
              <dl className="divide-y border rounded-lg overflow-hidden">
                {specs.map((s) => (
                  <div key={s.id} className="grid grid-cols-2 px-4 py-2 text-sm">
                    <dt className="text-muted-foreground">{s.spec_key}</dt>
                    <dd>{s.spec_value}</dd>
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

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
