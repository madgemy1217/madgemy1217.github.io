import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Check, ShoppingBag, ArrowLeft } from "lucide-react";
import { getProduct, formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.name} — AppleStore` },
      { name: "description", content: loaderData?.product.description ?? "" },
      { property: "og:title", content: `${loaderData?.product.name} — AppleStore` },
      { property: "og:description", content: loaderData?.product.description ?? "" },
      { property: "og:image", content: loaderData?.product.image ?? "" },
    ],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-24 text-center">
      <h1 className="text-3xl font-semibold">Товар не найден</h1>
      <Link to="/" className="inline-block mt-6 text-primary hover:underline">На главную</Link>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const navigate = useNavigate();

  const handleAdd = () => {
    add(product);
    toast.success(`${product.name} добавлен в корзину`);
  };

  const handleBuyNow = () => {
    add(product);
    navigate({ to: "/checkout" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-12">
      <Link
        to="/category/$category"
        params={{ category: product.category }}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Назад в каталог
      </Link>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="relative rounded-3xl border border-border bg-card p-8 fade-in-up">
          <div
            className="absolute inset-8 rounded-2xl opacity-40 -z-0 blur-3xl"
            style={{ background: "var(--gradient-accent)" }}
            aria-hidden
          />
          <img
            src={product.image}
            alt={product.name}
            className="relative w-full aspect-square object-cover rounded-2xl"
            width={800}
            height={800}
          />
        </div>

        <div className="fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="text-sm uppercase tracking-wider text-primary/80 mb-2">
            {product.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            {product.name}
          </h1>
          <p className="text-xl text-muted-foreground mt-3">{product.tagline}</p>

          <div className="flex items-baseline gap-3 mt-6">
            <div className="text-3xl font-semibold">{formatPrice(product.price)}</div>
            {product.oldPrice && (
              <div className="text-base text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </div>
            )}
          </div>

          <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="mt-8">
            <div className="text-sm font-medium mb-3">Цвета</div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="text-sm font-medium mb-3">Особенности</div>
            <ul className="space-y-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleBuyNow}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 glow"
            >
              Купить сейчас
            </button>
            <button
              onClick={handleAdd}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-secondary/50 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <ShoppingBag className="h-4 w-4" /> В корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
