import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Корзина — AppleStore" },
      { name: "description", content: "Ваша корзина в AppleStore" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, total, count } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 md:px-8 py-24 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-semibold">Корзина пуста</h1>
        <p className="mt-3 text-muted-foreground">
          Самое время выбрать что-нибудь из новинок Apple.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 glow"
        >
          В каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8 py-12">
      <h1 className="text-4xl font-semibold mb-2">Корзина</h1>
      <p className="text-muted-foreground mb-10">
        {count} {count === 1 ? "товар" : "товаров"} на сумму {formatPrice(total)}
      </p>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-3">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <Link
                to="/product/$slug"
                params={{ slug: product.slug }}
                className="shrink-0"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-24 w-24 rounded-xl object-cover bg-secondary"
                  loading="lazy"
                  width={96}
                  height={96}
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to="/product/$slug"
                  params={{ slug: product.slug }}
                  className="font-medium hover:text-primary"
                >
                  {product.name}
                </Link>
                <div className="text-xs text-muted-foreground mt-1">{product.tagline}</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-full border border-border bg-secondary/50 p-1">
                    <button
                      onClick={() => setQty(product.id, quantity - 1)}
                      className="rounded-full p-1.5 hover:bg-secondary"
                      aria-label="Уменьшить"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => setQty(product.id, quantity + 1)}
                      className="rounded-full p-1.5 hover:bg-secondary"
                      aria-label="Увеличить"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold">
                      {formatPrice(product.price * quantity)}
                    </div>
                    <button
                      onClick={() => remove(product.id)}
                      className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Удалить"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="rounded-2xl border border-border bg-card p-6 h-fit lg:sticky lg:top-20">
          <div className="text-lg font-semibold mb-5">Итого</div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Товары ({count})</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Доставка</span>
              <span>Рассчитывается</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between text-base font-semibold">
              <span>К оплате</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="mt-6 flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 glow"
          >
            Оформить заказ
          </Link>
        </aside>
      </div>
    </div>
  );
}
