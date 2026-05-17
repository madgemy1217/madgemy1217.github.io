import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header, Footer } from "@/components/Layout";
import { loadCatalog, subscribeCatalog, type Category, type Product } from "@/lib/products";
import { money } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

type SortKey = "popular" | "price-asc" | "price-desc" | "name";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlySale, setOnlySale] = useState(false);
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [pickedColors, setPickedColors] = useState<string[]>([]);
  const [specFilters, setSpecFilters] = useState<Record<string, string[]>>({});
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

  // сброс фильтров при смене категории
  useEffect(() => {
    setQuery(""); setOnlyInStock(false); setOnlySale(false);
    setPriceMin(""); setPriceMax(""); setSort("popular"); setPickedColors([]); setSpecFilters({});
  }, [slug]);

  const category = useMemo(() => categories.find((c) => c.slug === slug), [categories, slug]);

  const categoryProducts = useMemo(
    () => (category ? products.filter((p) => p.category_id === category.id) : []),
    [products, category],
  );

  // диапазон цен и доступные цвета для текущей категории
  const { minPrice, maxPrice, availableColors } = useMemo(() => {
    if (categoryProducts.length === 0) {
      return { minPrice: 0, maxPrice: 0, availableColors: [] as { name: string; hex: string }[] };
    }
    const prices = categoryProducts.map((p) => p.price);
    const colorMap = new Map<string, { name: string; hex: string }>();
    for (const p of categoryProducts) {
      for (const c of p.colors ?? []) {
        if (!colorMap.has(c.name)) colorMap.set(c.name, c);
      }
    }
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      availableColors: Array.from(colorMap.values()),
    };
  }, [categoryProducts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pmin = priceMin ? Number(priceMin) : null;
    const pmax = priceMax ? Number(priceMax) : null;
    const result = categoryProducts
      .filter((p) => !q || `${p.name} ${p.tagline ?? ""} ${p.description ?? ""} ${p.aliases ?? ""}`.toLowerCase().includes(q))
      .filter((p) => !onlyInStock || p.in_stock)
      .filter((p) => !onlySale || (p.old_price && p.old_price > p.price))
      .filter((p) => pmin == null || p.price >= pmin)
      .filter((p) => pmax == null || p.price <= pmax)
      .filter((p) => pickedColors.length === 0 || (p.colors ?? []).some((c) => pickedColors.includes(c.name)));

    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: result.sort((a, b) => a.sort_order - b.sort_order);
    }
    return result;
  }, [categoryProducts, query, onlyInStock, onlySale, priceMin, priceMax, pickedColors, sort]);

  function toggleColor(name: string) {
    setPickedColors((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
  }
  function resetFilters() {
    setQuery(""); setOnlyInStock(false); setOnlySale(false);
    setPriceMin(""); setPriceMax(""); setSort("popular"); setPickedColors([]);
  }

  const hasActiveFilters = !!query || onlyInStock || onlySale || !!priceMin || !!priceMax || pickedColors.length > 0 || sort !== "popular";

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

            <div className="grid lg:grid-cols-[260px_1fr] gap-6">
              {/* Сайдбар фильтров */}
              <aside className="space-y-5 lg:sticky lg:top-4 lg:self-start rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Фильтры</h2>
                  {hasActiveFilters && (
                    <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-primary underline">
                      Сбросить
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Поиск</label>
                  <input
                    type="search"
                    placeholder="Название…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border bg-background text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Сортировка</label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="w-full px-3 py-2 rounded-md border bg-background text-sm"
                  >
                    <option value="popular">По популярности</option>
                    <option value="price-asc">Цена: по возрастанию</option>
                    <option value="price-desc">Цена: по убыванию</option>
                    <option value="name">По названию</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    Цена, ₽ <span className="text-xs text-muted-foreground">({money(minPrice)} – {money(maxPrice)})</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number" inputMode="numeric" placeholder="от"
                      value={priceMin} onChange={(e) => setPriceMin(e.target.value)}
                      className="w-1/2 px-3 py-2 rounded-md border bg-background text-sm"
                    />
                    <input
                      type="number" inputMode="numeric" placeholder="до"
                      value={priceMax} onChange={(e) => setPriceMax(e.target.value)}
                      className="w-1/2 px-3 py-2 rounded-md border bg-background text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={onlyInStock} onChange={(e) => setOnlyInStock(e.target.checked)} />
                    Только в наличии
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={onlySale} onChange={(e) => setOnlySale(e.target.checked)} />
                    Со скидкой
                  </label>
                </div>

                {availableColors.length > 0 && (
                  <div>
                    <label className="text-sm font-medium block mb-2">Цвет</label>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((c) => {
                        const active = pickedColors.includes(c.name);
                        return (
                          <button
                            key={c.name}
                            onClick={() => toggleColor(c.name)}
                            title={c.name}
                            aria-label={c.name}
                            aria-pressed={active}
                            className={`h-8 w-8 rounded-full border-2 transition ${active ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50"}`}
                            style={{ background: c.hex }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </aside>

              {/* Сетка товаров */}
              <div>
                {filtered.length === 0 ? (
                  <div className="rounded-xl border bg-card p-8 text-center">
                    <p className="text-muted-foreground mb-3">Ничего не найдено по выбранным фильтрам.</p>
                    {hasActiveFilters && (
                      <button onClick={resetFilters} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
                        Сбросить фильтры
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
              </div>
            </div>
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
