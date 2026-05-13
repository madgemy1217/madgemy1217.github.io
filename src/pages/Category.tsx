import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header, Footer } from "@/components/Layout";
import { loadCatalog, subscribeCatalog, type Category, type Product } from "@/lib/products";
import { money } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
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
          setCategories(c.categories);
          setProducts(c.products);
        })
        .catch((e) => toast.error(e.message))
        .finally(() => alive && setLoading(false));
    load();
    const unsub = subscribeCatalog(load);
    return () => { alive = false; unsub(); };
  }, []);

  const category = useMemo(() => categories.find((c) => c.slug === slug), [categories, slug]);

  const filtered = useMemo(() => {
    if (!category) return [];
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => p.category_id === category.id)
      .filter((p) => !q || `${p.name} ${p.tagline ?? ""} ${p.description ?? ""} ${p.aliases ?? ""}`.toLowerCase().includes(q))
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [products, category, query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4" /> На главную
        </Link>

        {loading ? (
          <p className="text-muted-foreground">Загрузка…</p>
        ) : !category ? (
          <p>Категория не найдена. <Link to="/" className="text-primary underline">На главную</Link></p>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{category.name}</h1>
            <p className="text-muted-foreground mb-6">{filtered.length} {plural(filtered.length, ["товар", "товара", "товаров"])}</p>

            <input
              type="search"
              placeholder="Поиск в категории…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full md:max-w-md px-4 py-2.5 rounded-md border bg-background mb-6"
            />

            {filtered.length === 0 ? (
              <p className="text-muted-foreground">В этой категории пока нет товаров.</p>
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
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function plural(n: number, forms: [string, string, string]) {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}
