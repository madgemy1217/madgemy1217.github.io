import { PRODUCTS, type Product } from "./products";

/**
 * Russian → English aliases for product search.
 * Allows queries like "айфон" to match "iPhone".
 */
const RU_EN_DICT: Record<string, string> = {
  // Категории
  айфон: "iphone",
  айфоны: "iphone",
  айфона: "iphone",
  айфону: "iphone",
  айфоном: "iphone",
  афон: "iphone",
  айпад: "ipad",
  айпэд: "ipad",
  айпады: "ipad",
  айпада: "ipad",
  макбук: "macbook",
  мак: "mac",
  макбука: "macbook",
  макбуки: "macbook",
  ноутбук: "macbook",
  ноут: "macbook",
  часы: "watch",
  часов: "watch",
  вотч: "watch",
  эплвотч: "apple watch",
  эпл: "apple",
  эппл: "apple",
  яблоко: "apple",
  наушники: "airpods",
  наушник: "airpods",
  эирподс: "airpods",
  аирподс: "airpods",
  эйрподс: "airpods",
  // Линейки
  про: "pro",
  макс: "max",
  эйр: "air",
  ультра: "ultra",
  мини: "mini",
  плюс: "plus",
  серия: "series",
  серии: "series",
};

/** Translit for cases when dictionary doesn't cover the word */
const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sh",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya", " ": " ",
};

const normalize = (s: string) =>
  s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();

const translit = (s: string) =>
  s.split("").map((ch) => (TRANSLIT[ch] !== undefined ? TRANSLIT[ch] : ch)).join("");

/** Expand a search query into multiple normalized variants */
const expandQuery = (query: string): string[] => {
  const norm = normalize(query);
  if (!norm) return [];
  const variants = new Set<string>([norm]);

  // Token-by-token replacement using dictionary
  const tokens = norm.split(" ");
  const dictReplaced = tokens
    .map((t) => RU_EN_DICT[t] ?? t)
    .join(" ");
  if (dictReplaced !== norm) variants.add(dictReplaced);

  // Pure transliteration fallback
  const tr = translit(norm);
  if (tr !== norm) variants.add(tr);

  // Number extraction: digits like "15", "16" should match
  const digits = norm.match(/\d+/g);
  if (digits) digits.forEach((d) => variants.add(d));

  return Array.from(variants);
};

/** Build a haystack string for a product including aliases */
const buildHaystack = (p: Product): string => {
  const parts = [
    p.name,
    p.category,
    p.tagline,
    p.description,
    ...p.features,
    ...p.colors,
    ...p.aliases,
  ];
  const base = normalize(parts.join(" "));
  // Add transliterated version too so русский запрос matches English content
  return `${base} ${translit(base)}`;
};

const HAYSTACKS = new Map<string, string>(
  PRODUCTS.map((p) => [p.id, buildHaystack(p)]),
);

export interface SearchResult {
  product: Product;
  score: number;
}

export function searchProducts(query: string, limit = 8): SearchResult[] {
  const variants = expandQuery(query);
  if (variants.length === 0) return [];

  const results: SearchResult[] = [];
  for (const product of PRODUCTS) {
    const hay = HAYSTACKS.get(product.id)!;
    let score = 0;
    for (const v of variants) {
      if (!v) continue;
      // Score by occurrences
      const tokens = v.split(" ").filter(Boolean);
      for (const tok of tokens) {
        if (tok.length < 2) continue;
        const idx = hay.indexOf(tok);
        if (idx === -1) continue;
        score += 5;
        // Bonus for prefix match in name
        if (normalize(product.name).startsWith(tok)) score += 10;
        // Bonus for exact alias hit
        if (product.aliases.some((a) => normalize(a) === tok)) score += 8;
      }
    }
    if (score > 0) results.push({ product, score });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}
