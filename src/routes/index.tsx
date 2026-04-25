import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-iphone.jpg";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AppleStore — iPhone, iPad, Mac с доставкой по России" },
      {
        name: "description",
        content: "Оригинальная техника Apple: iPhone 15, iPad Pro M4, MacBook, Apple Watch и AirPods с доставкой по Москве и России.",
      },
      { property: "og:title", content: "AppleStore — Техника Apple" },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: HomePage,
});

const featured = PRODUCTS.slice(0, 4);

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="mx-auto max-w-7xl px-4 md:px-8 pt-20 md:pt-28 pb-16 md:pb-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Новинка · iPhone 15 Pro Max
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight">
              Технологии,
              <br />
              <span className="gradient-text">меняющие правила.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-md">
              Оригинальная техника Apple с гарантией. Доставка по всей России и
              самовывоз в Москве.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/category/$category"
                params={{ category: "iphone" }}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 glow"
              >
                В каталог iPhone
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/product/$slug"
                params={{ slug: "iphone-15-pro-max" }}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Подробнее
              </Link>
            </div>
          </div>
          <div className="relative">
            <div
              className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-60"
              style={{ background: "var(--gradient-accent)" }}
              aria-hidden
            />
            <img
              src={heroImg}
              alt="iPhone 15 Pro Max"
              className="relative w-full max-w-lg mx-auto float drop-shadow-2xl"
              width={800}
              height={533}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <h2 className="text-3xl md:text-4xl font-semibold mb-8">Категории</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((c, idx) => (
            <Link
              key={c.id}
              to="/category/$category"
              params={{ category: c.id }}
              className="group rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-primary/50 hover:bg-secondary/50 fade-in-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="text-base font-semibold">{c.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.ru}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold">Популярное</h2>
            <p className="text-muted-foreground mt-2">Самые востребованные устройства этой недели</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div
          className="relative overflow-hidden rounded-3xl border border-border p-10 md:p-16"
          style={{ background: "var(--gradient-card)" }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: "var(--gradient-hero)" }}
            aria-hidden
          />
          <div className="relative max-w-2xl">
            <h3 className="text-3xl md:text-5xl font-semibold tracking-tight">
              Доставка по Москве — <span className="gradient-text">за 1 день</span>
            </h3>
            <p className="mt-4 text-muted-foreground text-lg">
              Самовывоз в день заказа. Бесплатная доставка по России при заказе от 50 000 ₽.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
