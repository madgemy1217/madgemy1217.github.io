import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Shell } from "@/components/Layout";
import { loadCatalog, type Product, type ProductSpec } from "@/lib/products";
import { money } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

const SPEC_TABS = [
  "Общие",
  "Экран",
  "Камера",
  "Запись видео",
  "Связь",
  "Память и процессор",
  "Питание",
  "Другие функции",
  "Дополнительная информация",
] as const;

function getSpecGroup(key: string): string {
  const k = key.toLowerCase();
  if (/экран|дисплей|диагональ|разрешение|яркость|пиксел|частота обновления|тип экрана|соотношение сторон|always.on/.test(k)) return "Экран";
  if (/запись видео|видеосъ|формат видео|видео hdr|cinematic|dolby vision|slow.motion|slow motion/.test(k)) return "Запись видео";
  if (/камер|lider|lidar|апертур|зум|фокус|стабилизац|вспышк|автофокус|фронталь|селфи|широкоугол|телефото/.test(k)) return "Камера";
  if (/wi.fi|bluetooth|sim|gps|глонасс|навигац|сотовой|5g|lte|4g|3g|2g|nfc|диапазон|беспровод сеть|hotspot|usb|lightning|type.c/.test(k)) return "Связь";
  if (/процессор|чип|память|озу|ram|оперативн|встроенн/.test(k)) return "Память и процессор";
  if (/аккумул|батаре|зарядк|magsafe|беспровод зарядк|быстрая зарядк|мощность зарядк|ёмкость|емкость/.test(k)) return "Питание";
  if (/face id|touch id|датчик|сенсор|биометр|динамик|микрофон|стерео|haptic|taptic|акселеро|гироскоп|барометр|компас|сейсмо|инфракрас|ultra wideband|u1/.test(k)) return "Другие функции";
  if (/артикул|страна|срок службы|гарантий|производ|бренд/.test(k)) return "Дополнительная информация";
  return "Общие";
}

function groupSpecs(specs: ProductSpec[]): Record<string, ProductSpec[]> {
  const groups: Record<string, ProductSpec[]> = {};
  for (const tab of SPEC_TABS) groups[tab] = [];
  for (const spec of specs) {
    const group = getSpecGroup(spec.key);
    groups[group].push(spec);
  }
  return groups;
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [variantIdx, setVariantIdx] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);
  const { add } = useCart();
  const [activeTab, setActiveTab] = useState<string>("Общие");

  useEffect(() => {
    setLoading(true);
    loadCatalog()
      .then((c) => setProduct(c.products.find((p) => p.slug === slug) ?? null))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Shell><p className="text-muted-foreground">Загрузка…</p></Shell>;
  if (!product) return <Shell><p>Товар не найден. <Link to="/" className="text-primary underline">На главную</Link></p></Shell>;

  const specGroups = useMemo(() => groupSpecs(product.specs), [product.specs]);
  const visibleTabs = SPEC_TABS.filter((t) => specGroups[t].length > 0);

  const variant = product.variants[variantIdx];
  const color = product.colors[colorIdx];
  const finalPrice = product.price + (variant?.price_delta ?? 0);
  const allImages = product.image ? [{ url: product.image, alt: product.name }, ...product.images] : product.images;

  return (
    <Shell>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          {allImages.map((img, i) => (
            <div key={i} className="aspect-square bg-secondary/30 rounded-xl overflow-hidden">
              <img src={img.url} alt={img.alt ?? product.name} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          {product.tagline && <p className="mt-2 text-lg text-muted-foreground">{product.tagline}</p>}

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{money(finalPrice)}</span>
            {product.old_price && <span className="text-lg text-muted-foreground line-through">{money(product.old_price)}</span>}
          </div>

          {product.variants.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Вариант</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setVariantIdx(i)}
                    className={`px-3 py-2 rounded-md border text-sm ${variantIdx === i ? "border-primary bg-primary/10" : "hover:bg-secondary"}`}
                  >
                    {v.name}{v.price_delta ? ` (+${money(v.price_delta)})` : ""}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-medium mb-2">Цвет: {color?.name}</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setColorIdx(i)}
                    title={c.name}
                    className={`h-9 w-9 rounded-full border-2 ${colorIdx === i ? "border-primary" : "border-border"}`}
                    style={{ background: c.hex }}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              const name = `${product.name}${variant ? `, ${variant.name}` : ""}${color ? `, ${color.name}` : ""}`;
              add({ id: `${product.id}|${variantIdx}|${colorIdx}`, name, price: finalPrice, image: product.image });
              toast.success("Добавлено в корзину");
            }}
            className="mt-8 w-full md:w-auto px-8 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90"
          >В корзину</button>

          {product.description && <p className="mt-8 text-muted-foreground leading-relaxed">{product.description}</p>}

          {product.specs.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">О модели</h2>
              <div className="overflow-x-auto -mx-1 px-1">
                <div className="flex gap-0 border-b min-w-max">
                  {visibleTabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 transition-colors ${
                        activeTab === tab
                          ? "border-primary text-foreground font-medium"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <dl className="divide-y border-x border-b rounded-b-lg overflow-hidden">
                {(specGroups[activeTab] ?? []).map((s, i) => (
                  <div key={i} className="grid grid-cols-2 px-4 py-2.5 text-sm">
                    <dt className="text-muted-foreground">{s.key}</dt>
                    <dd className="font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
