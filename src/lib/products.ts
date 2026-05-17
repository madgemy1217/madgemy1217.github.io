export type Category = { id: string; slug: string; name: string; sort_order: number };
export type ProductColor = { name: string; hex: string };
export type ProductVariant = { name: string; price_delta: number };
export type ProductSpec = { key: string; value: string };
export type ProductImage = { url: string; alt?: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  price: number;
  old_price: number | null;
  tagline: string | null;
  description: string | null;
  image: string | null;
  in_stock: boolean;
  featured: boolean;
  aliases: string | null;
  sort_order: number;
  colors: ProductColor[];
  variants: ProductVariant[];
  specs: ProductSpec[];
  images: ProductImage[];
};

export type Catalog = { categories: Category[]; products: Product[] };

const STORAGE_KEY = "ath_catalog_override";
const SOURCE_PATH = `${import.meta.env.BASE_URL}products.json`;

let cache: Catalog | null = null;
const subscribers = new Set<() => void>();

export function subscribeCatalog(fn: () => void) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

function notify() {
  subscribers.forEach((fn) => fn());
}

export async function loadCatalog(force = false): Promise<Catalog> {
  if (cache && !force) return cache;
  // Сначала пробуем localStorage (правки админа)
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Catalog;
      // если в локальной версии нет характеристик/цветов вообще — она устарела, сбрасываем
      const hasRichData = parsed.products?.some(
        (p) => (p.specs && p.specs.length > 0) || (p.colors && p.colors.length > 0),
      );
      if (hasRichData) {
        cache = parsed;
        return cache!;
      }
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* ignore */
  }
  // Иначе грузим JSON из public/
  const res = await fetch(SOURCE_PATH, { cache: "no-cache" });
  if (!res.ok) throw new Error("Не удалось загрузить products.json");
  cache = (await res.json()) as Catalog;
  return cache;
}

export function saveCatalog(catalog: Catalog) {
  cache = catalog;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
  notify();
}

export async function resetCatalog() {
  localStorage.removeItem(STORAGE_KEY);
  cache = null;
  await loadCatalog(true);
  notify();
}

export function downloadCatalogJson(catalog: Catalog) {
  const blob = new Blob([JSON.stringify(catalog, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "products.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
