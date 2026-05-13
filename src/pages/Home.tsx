import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header, Footer } from "@/components/Layout";
import { loadCatalog, subscribeCatalog, type Category, type Product } from "@/lib/products";
import { money } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

const PER_CATEGORY = 4;

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { add } = useCart();

  useEffect(() => {
    let alive = true;
    const load = () =>
      loadCatalog(true)
        .then((c) => {
          if (!alive) return;
          setCategories([...c.categories].sort((a, b) => a.sort_order - b.sort_order));
          setProducts(c.products);
        })
        .catch((e) => toast.error(e.message))
        .finally(() => alive && setLoading(false));
    load();
    const unsub = subscribeCatalog(load);
    return () => { alive = false; unsub(); };
  }, []);

  const q = query.trim().toLowerCase();
  const searchResults = q
    ? products.filter((p) =>
        `${p.name} ${p.tagline ?? ""} ${p.description ?? ""} ${p.aliases ?? ""}`.toLowerCase().includes(q),
      )
    : null;

  function flagshipsFor(catId: string): Product[] {
    const inCat = products.filter((p) => p.category_id === catId);
    const featured = inCat.filter((p) => p.featured);
    const rest = inCat.filter((p) => !p.featured);
    return [...featured, ...rest]
      .sort((a, b) => a.sort_order - b.sort_order)
      .slice(0, PER_CATEGORY);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <section className="bg-gradient-to-br from-primary/10 to-transparent border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Техника Apple</h1>
          <p className="mt-3 text-lg text-muted-foreground">Свежие модели, оригинал, быстрая доставка.</p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 flex-1">
        <input
          type="search"
          placeholder="Поиск по каталогу…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:max-w-md px-4 py-2.5 rounded-md border bg-background mb-8"
        />

        {loading ? (
          <p className="text-muted-foreground">Загрузка…</p>
        ) : searchResults ? (
          searchResults.length === 0 ? (
            <p className="text-muted-foreground">Ничего не найдено.</p>
          ) : (
            <ProductGrid items={searchResults} onAdd={add} />
          )
        ) : (
          <div className="space-y-12">
            {categories.map((cat) => {
              const items = flagshipsFor(cat.id);
              if (items.length === 0) return null;
              return (
                <section key={cat.id}>
                  <div className="flex items-end justify-between gap-3 mb-4">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{cat.name}</h2>
                    <Link
                      to={`/category/${cat.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline shrink-0"
                    >
                      Смотреть все <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <ProductGrid items={items} onAdd={add} />
                </section>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function ProductGrid({
  items,
  onAdd,
}: {
  items: Product[];
  onAdd: (p: { id: string; name: string; price: number; image: string | null }) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {items.map((p) => (
        <article key={p.id} className="rounded-xl border bg-card overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
          <Link to={`/product/${p.slug}`} className="aspect-square bg-secondary/30 overflow-hidden block">
            {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform" loading="lazy" />}
          </Link>
          <div className="p-4 flex flex-col gap-2 flex-1">
            <h3 className="font-semibold leading-tight">{p.name}</h3>
            {p.tagline && <p className="text-sm text-muted-foreground line-clamp-2">{p.tagline}</p>}
            <div className="mt-auto pt-2">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-lg">{money(p.price)}</span>
                {p.old_price && <span className="text-sm text-muted-foreground line-through">{money(p.old_price)}</span>}
              </div>
              <button
                onClick={() => { onAdd({ id: p.id, name: p.name, price: p.price, image: p.image }); toast.success("Добавлено в корзину"); }}
                className="mt-3 w-full py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
              >В корзину</button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
