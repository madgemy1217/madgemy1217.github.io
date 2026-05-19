import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header, Footer } from "@/components/Layout";
import { loadCatalog, subscribeCatalog, type Category, type Product } from "@/lib/products";
import { money } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react";

type SortKey = "popular" | "price-asc" | "price-desc" | "name";

// Порог: считаем характеристику «общей», если она есть хотя бы у этой доли товаров категории
const COMMON_SPEC_RATIO = 0.5;

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
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // диапазон цен, цвета и фильтры по характеристикам
  const { minPrice, maxPrice, availableColors, specOptions } = useMemo(() => {
    if (categoryProducts.length === 0) {
      return { minPrice: 0, maxPrice: 0, availableColors: [] as { name: string; hex: string }[], specOptions: [] as { key: string; values: string[] }[] };
    }
    const prices = categoryProducts.map((p) => p.price);
    const colorMap = new Map<string, { name: string; hex: string }>();
    for (const p of categoryProducts) {
      for (const c of p.colors ?? []) {
        if (!colorMap.has(c.name)) colorMap.set(c.name, c);
      }
    }
    // собираем по характеристикам: ключ -> множество значений + счётчик товаров
    const specMap = new Map<string, { values: Set<string>; count: number }>();
    for (const p of categoryProducts) {
      const seenKeys = new Set<string>();
      for (const s of p.specs ?? []) {
        if (!specMap.has(s.key)) specMap.set(s.key, { values: new Set(), count: 0 });
        const entry = specMap.get(s.key)!;
        entry.values.add(s.value);
        if (!seenKeys.has(s.key)) { entry.count += 1; seenKeys.add(s.key); }
      }
    }
    const minCount = Math.max(2, Math.ceil(categoryProducts.length * COMMON_SPEC_RATIO));
    const specOpts = Array.from(specMap.entries())
      .map(([key, { values, count }]) => ({ key, values: Array.from(values).sort(), count }))
      // показываем только «общие» характеристики: есть у большинства товаров и с выбором из >=2 значений
      .filter((s) => s.values.length >= 2 && s.count >= minCount)
      .sort((a, b) => a.key.localeCompare(b.key));
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      availableColors: Array.from(colorMap.values()),
      specOptions: specOpts,
    };
  }, [categoryProducts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pmin = priceMin ? Number(priceMin) : null;
    const pmax = priceMax ? Number(priceMax) : null;
    const activeSpecs = Object.entries(specFilters).filter(([, v]) => v.length > 0);
    const result = categoryProducts
      .filter((p) => !q || `${p.name} ${p.tagline ?? ""} ${p.description ?? ""} ${p.aliases ?? ""}`.toLowerCase().includes(q))
      .filter((p) => !onlyInStock || p.in_stock)
      .filter((p) => !onlySale || (p.old_price && p.old_price > p.price))
      .filter((p) => pmin == null || p.price >= pmin)
      .filter((p) => pmax == null || p.price <= pmax)
      .filter((p) => pickedColors.length === 0 || (p.colors ?? []).some((c) => pickedColors.includes(c.name)))
      .filter((p) => activeSpecs.every(([key, vals]) => (p.specs ?? []).some((s) => s.key === key && vals.includes(s.value))));

    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: result.sort((a, b) => a.sort_order - b.sort_order);
    }
    return result;
  }, [categoryProducts, query, onlyInStock, onlySale, priceMin, priceMax, pickedColors, specFilters, sort]);

  function toggleColor(name: string) {
    setPickedColors((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
  }
  function toggleSpec(key: string, value: string) {
    setSpecFilters((prev) => {
      const cur = prev[key] ?? [];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      const copy = { ...prev };
      if (next.length === 0) delete copy[key]; else copy[key] = next;
      return copy;
    });
  }
  function resetFilters() {
    setQuery(""); setOnlyInStock(false); setOnlySale(false);
    setPriceMin(""); setPriceMax(""); setSort("popular"); setPickedColors([]); setSpecFilters({});
  }

  const activeSpecCount = Object.values(specFilters).reduce((n, v) => n + v.length, 0);
  const hasActiveFilters = !!query || onlyInStock || onlySale || !!priceMin || !!priceMax || pickedColors.length > 0 || activeSpecCount > 0 || sort !== "popular";

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

            {/* Кнопка фильтров для мобильной версии */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border bg-card text-sm font-medium hover:bg-secondary"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Фильтры{activeSpecCount + pickedColors.length > 0 ? ` · ${activeSpecCount + pickedColors.length}` : ""}
              </button>
            </div>

            <div className="grid lg:grid-cols-[260px_1fr] gap-6">
              {/* Сайдбар фильтров (desktop) */}
              <aside className="hidden lg:block space-y-5 lg:sticky lg:top-4 lg:self-start rounded-xl border bg-card p-4">
                <FilterPanel
                  hasActiveFilters={hasActiveFilters}
                  resetFilters={resetFilters}
                  query={query} setQuery={setQuery}
                  sort={sort} setSort={setSort}
                  minPrice={minPrice} maxPrice={maxPrice}
                  priceMin={priceMin} setPriceMin={setPriceMin}
                  priceMax={priceMax} setPriceMax={setPriceMax}
                  onlyInStock={onlyInStock} setOnlyInStock={setOnlyInStock}
                  onlySale={onlySale} setOnlySale={setOnlySale}
                  availableColors={availableColors}
                  pickedColors={pickedColors} toggleColor={toggleColor}
                  specOptions={specOptions}
                  specFilters={specFilters} toggleSpec={toggleSpec}
                />
              </aside>

              {/* Мобильный drawer */}
              {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                  <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
                  <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-card overflow-y-auto p-4 space-y-5 shadow-xl">
                    <div className="flex items-center justify-between sticky top-0 bg-card pb-2 -mt-1 pt-1 border-b">
                      <h2 className="font-semibold text-lg">Фильтры</h2>
                      <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-md hover:bg-secondary" aria-label="Закрыть">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <FilterPanel
                      hasActiveFilters={hasActiveFilters}
                      resetFilters={resetFilters}
                      query={query} setQuery={setQuery}
                      sort={sort} setSort={setSort}
                      minPrice={minPrice} maxPrice={maxPrice}
                      priceMin={priceMin} setPriceMin={setPriceMin}
                      priceMax={priceMax} setPriceMax={setPriceMax}
                      onlyInStock={onlyInStock} setOnlyInStock={setOnlyInStock}
                      onlySale={onlySale} setOnlySale={setOnlySale}
                      availableColors={availableColors}
                      pickedColors={pickedColors} toggleColor={toggleColor}
                      specOptions={specOptions}
                      specFilters={specFilters} toggleSpec={toggleSpec}
                    />
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-medium sticky bottom-0"
                    >
                      Показать {filtered.length}
                    </button>
                  </div>
                </div>
              )}



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
