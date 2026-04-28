import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header, Footer } from "@/components/Layout";
import { loadCatalog, subscribeCatalog, type Category, type Product } from "@/lib/products";
import { money } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCat, setActiveCat] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { add } = useCart();

  useEffect(() => {
    let alive = true;
    const load = () =>
      loadCatalog(true)
        .then((c) => {
          if (!alive) return;
          setCategories(c.categories);
          setProducts(c.products);
        })
        .catch((e) => toast.error(e.message))
        .finally(() => alive && setLoading(false));
    load();
    const unsub = subscribeCatalog(load);
    return () => { alive = false; unsub(); };
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = products.filter((p) => {
    const cat = activeCat === "all" || p.category_id === activeCat;
    const search = !q || `${p.name} ${p.tagline ?? ""} ${p.description ?? ""} ${p.aliases ?? ""}`.toLowerCase().includes(q);
    return cat && search;
  });

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
        <div className="flex flex-col gap-4 mb-6">
          <input
            type="search"
            placeholder="Поиск по каталогу…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:max-w-md px-4 py-2.5 rounded-md border bg-background"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCat("all")}
              className={`px-3 py-1.5 rounded-full text-sm border ${activeCat === "all" ? "bg-primary text-primary-foreground border-primary" : "hover:bg-secondary"}`}
            >Все</button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                className={`px-3 py-1.5 rounded-full text-sm border ${activeCat === c.id ? "bg-primary text-primary-foreground border-primary" : "hover:bg-secondary"}`}
              >{c.name}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Загрузка…</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground">Товары не найдены.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
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
                      onClick={() => { add({ id: p.id, name: p.name, price: p.price, image: p.image }); toast.success("Добавлено в корзину"); }}
                      className="mt-3 w-full py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
                    >В корзину</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
