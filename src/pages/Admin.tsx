import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shell } from "@/components/Layout";
import { useAuth } from "@/lib/auth";
import {
  loadCatalog, saveCatalog, downloadCatalogJson, resetCatalog,
  type Catalog, type Category, type Product, type ProductColor, type ProductVariant, type ProductSpec, type ProductImage,
} from "@/lib/products";
import { toast } from "sonner";
import { Plus, Trash2, Edit3, X, Save, Download, RotateCcw, Upload } from "lucide-react";

export default function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [tab, setTab] = useState<"products" | "categories">("products");

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/login");
  }, [loading, isAdmin, navigate]);

  const reload = useCallback(() => {
    loadCatalog(true).then(setCatalog).catch((e) => toast.error(e.message));
  }, []);
  useEffect(() => { reload(); }, [reload]);

  function update(next: Catalog) {
    saveCatalog(next);
    setCatalog({ ...next });
  }

  if (loading || !catalog) return <Shell><p>Загрузка…</p></Shell>;
  if (!isAdmin) return null;

  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold">Админ-панель</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => downloadCatalogJson(catalog)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm"
          ><Download className="h-4 w-4" /> Скачать products.json</button>
          <ImportJsonBtn onImport={(c) => update(c)} />
          <button
            onClick={async () => {
              if (!confirm("Сбросить все локальные изменения и загрузить products.json с сайта?")) return;
              await resetCatalog();
              reload();
              toast.success("Сброшено");
            }}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-md border text-sm"
          ><RotateCcw className="h-4 w-4" /> Сброс</button>
        </div>
      </div>

      <div className="mb-4 p-3 rounded-md border bg-secondary/30 text-sm text-muted-foreground">
        💡 Изменения сохраняются <strong>в этом браузере</strong>. Чтобы они появились у всех — нажми <strong>«Скачать products.json»</strong> и закоммить файл в <code>public/products.json</code> своего GitHub-репозитория.
      </div>

      <div className="flex gap-2 mb-6 border-b">
        <TabBtn active={tab === "products"} onClick={() => setTab("products")}>Товары ({catalog.products.length})</TabBtn>
        <TabBtn active={tab === "categories"} onClick={() => setTab("categories")}>Категории ({catalog.categories.length})</TabBtn>
      </div>

      {tab === "products"
        ? <ProductsTab catalog={catalog} onChange={update} />
        : <CategoriesTab catalog={catalog} onChange={update} />}
    </Shell>
  );
}

function ImportJsonBtn({ onImport }: { onImport: (c: Catalog) => void }) {
  return (
    <label className="inline-flex items-center gap-1 px-3 py-2 rounded-md border text-sm cursor-pointer hover:bg-secondary">
      <Upload className="h-4 w-4" /> Загрузить JSON
      <input
        type="file"
        accept="application/json"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          try {
            const text = await f.text();
            const parsed = JSON.parse(text);
            if (!parsed.categories || !parsed.products) throw new Error("Неверная структура");
            onImport(parsed);
            toast.success("Загружено");
          } catch (err: any) {
            toast.error(err.message ?? "Ошибка JSON");
          }
          e.target.value = "";
        }}
      />
    </label>
  );
}

function TabBtn({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${active ? "border-primary text-primary" : "border-transparent hover:text-primary"}`}>
      {children}
    </button>
  );
}

/* =============== CATEGORIES =============== */
function CategoriesTab({ catalog, onChange }: { catalog: Catalog; onChange: (c: Catalog) => void }) {
  const [editing, setEditing] = useState<Category | null>(null);

  function save(cat: Category) {
    if (!cat.name || !cat.slug) return toast.error("Заполните имя и slug");
    const exists = catalog.categories.some((c) => c.id === cat.id);
    const next = exists
      ? catalog.categories.map((c) => (c.id === cat.id ? cat : c))
      : [...catalog.categories, cat];
    onChange({ ...catalog, categories: next.sort((a, b) => a.sort_order - b.sort_order) });
    setEditing(null);
    toast.success("Сохранено");
  }

  function del(id: string) {
    if (!confirm("Удалить категорию? Товары останутся, но без категории.")) return;
    onChange({
      ...catalog,
      categories: catalog.categories.filter((c) => c.id !== id),
      products: catalog.products.map((p) => (p.category_id === id ? { ...p, category_id: null } : p)),
    });
    toast.success("Удалено");
  }

  return (
    <div>
      <button
        onClick={() => setEditing({ id: crypto.randomUUID(), name: "", slug: "", sort_order: catalog.categories.length + 1 })}
        className="mb-4 inline-flex items-center gap-1 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm"
      ><Plus className="h-4 w-4" /> Новая категория</button>

      <div className="border rounded-lg divide-y">
        {catalog.categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-3">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">slug: {c.slug} · порядок: {c.sort_order}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(c)} className="p-2 hover:bg-secondary rounded"><Edit3 className="h-4 w-4" /></button>
              <button onClick={() => del(c.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {catalog.categories.length === 0 && <p className="p-4 text-muted-foreground text-sm">Нет категорий</p>}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} title={catalog.categories.some((c) => c.id === editing.id) ? "Редактирование категории" : "Новая категория"}>
          <Field label="Название"><input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input" /></Field>
          <Field label="Slug (латиницей, без пробелов)"><input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="input" /></Field>
          <Field label="ID (можно оставить как есть)"><input value={editing.id} onChange={(e) => setEditing({ ...editing, id: e.target.value })} className="input" /></Field>
          <Field label="Порядок сортировки"><input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className="input" /></Field>
          <div className="flex gap-2 pt-2">
            <button onClick={() => save(editing)} className="px-4 py-2 rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1"><Save className="h-4 w-4" /> Сохранить</button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-md border">Отмена</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* =============== PRODUCTS =============== */
function ProductsTab({ catalog, onChange }: { catalog: Catalog; onChange: (c: Catalog) => void }) {
  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  function del(id: string) {
    if (!confirm("Удалить товар?")) return;
    onChange({ ...catalog, products: catalog.products.filter((p) => p.id !== id) });
    toast.success("Удалено");
  }

  if (editingId) {
    const initial = editingId === "new"
      ? blankProduct(catalog.products.length + 1)
      : catalog.products.find((p) => p.id === editingId)!;
    return (
      <ProductEditor
        initial={initial}
        categories={catalog.categories}
        isNew={editingId === "new"}
        onCancel={() => setEditingId(null)}
        onSave={(prod) => {
          const exists = catalog.products.some((p) => p.id === prod.id);
          const products = exists
            ? catalog.products.map((p) => (p.id === prod.id ? prod : p))
            : [...catalog.products, prod];
          onChange({ ...catalog, products });
          setEditingId(null);
          toast.success("Сохранено");
        }}
      />
    );
  }

  return (
    <div>
      <button onClick={() => setEditingId("new")} className="mb-4 inline-flex items-center gap-1 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm">
        <Plus className="h-4 w-4" /> Новый товар
      </button>
      <div className="border rounded-lg divide-y">
        {catalog.products.map((p) => (
          <div key={p.id} className="flex items-center gap-3 p-3">
            {p.image && <img src={p.image} alt="" className="h-12 w-12 rounded object-cover bg-secondary" />}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground truncate">{p.slug} · {p.price} ₽ · {p.in_stock ? "в наличии" : "нет"}</p>
            </div>
            <Link to={`/product/${p.slug}`} className="text-xs text-primary underline shrink-0">смотреть</Link>
            <button onClick={() => setEditingId(p.id)} className="p-2 hover:bg-secondary rounded"><Edit3 className="h-4 w-4" /></button>
            <button onClick={() => del(p.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {catalog.products.length === 0 && <p className="p-4 text-muted-foreground text-sm">Нет товаров</p>}
      </div>
    </div>
  );
}

function blankProduct(sort: number): Product {
  return {
    id: crypto.randomUUID(), slug: "", name: "", category_id: null,
    price: 0, old_price: null, tagline: "", description: "", image: "",
    in_stock: true, featured: false, aliases: "", sort_order: sort,
    colors: [], variants: [], specs: [], images: [],
  };
}

/* =============== PRODUCT EDITOR =============== */
function ProductEditor({
  initial, categories, isNew, onSave, onCancel,
}: {
  initial: Product; categories: Category[]; isNew: boolean;
  onSave: (p: Product) => void; onCancel: () => void;
}) {
  const [p, setP] = useState<Product>(initial);

  function set<K extends keyof Product>(key: K, val: Product[K]) {
    setP({ ...p, [key]: val });
  }

  function save() {
    if (!p.name || !p.slug) return toast.error("Имя и slug обязательны");
    onSave(p);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{isNew ? "Новый товар" : "Редактирование"}</h2>
        <button onClick={onCancel} className="p-2 hover:bg-secondary rounded"><X className="h-4 w-4" /></button>
      </div>

      <Section title="Основное">
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Название"><input value={p.name} onChange={(e) => set("name", e.target.value)} className="input" /></Field>
          <Field label="Slug (URL)"><input value={p.slug} onChange={(e) => set("slug", e.target.value)} className="input" placeholder="iphone-17-pro" /></Field>
          <Field label="Категория">
            <select value={p.category_id ?? ""} onChange={(e) => set("category_id", e.target.value || null)} className="input">
              <option value="">— без категории —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Порядок"><input type="number" value={p.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} className="input" /></Field>
          <Field label="Цена (₽)"><input type="number" value={p.price} onChange={(e) => set("price", Number(e.target.value))} className="input" /></Field>
          <Field label="Старая цена (₽, необязательно)"><input type="number" value={p.old_price ?? ""} onChange={(e) => set("old_price", e.target.value ? Number(e.target.value) : null)} className="input" /></Field>
          <Field label="Главное фото (URL или ./assets/файл.jpg)"><input value={p.image ?? ""} onChange={(e) => set("image", e.target.value)} className="input" /></Field>
          <Field label="Слоган"><input value={p.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} className="input" /></Field>
        </div>
        <Field label="Описание"><textarea value={p.description ?? ""} onChange={(e) => set("description", e.target.value)} className="input min-h-24" /></Field>
        <Field label="Алиасы для поиска (через пробел)"><input value={p.aliases ?? ""} onChange={(e) => set("aliases", e.target.value)} className="input" /></Field>
        <div className="flex gap-4">
          <label className="flex items-center gap-2"><input type="checkbox" checked={p.in_stock} onChange={(e) => set("in_stock", e.target.checked)} /> В наличии</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={p.featured} onChange={(e) => set("featured", e.target.checked)} /> Рекомендованный</label>
        </div>
      </Section>

      <Section title="Скидка">
        <DiscountControl
          price={p.price}
          oldPrice={p.old_price}
          onChange={(price, oldPrice) => setP({ ...p, price, old_price: oldPrice })}
        />
      </Section>

      <Section title="Цвета">
        <RowList<ProductColor>
          items={p.colors}
          onChange={(items) => set("colors", items)}
          blank={() => ({ name: "Цвет", hex: "#cccccc" })}
          render={(c, upd) => (
            <>
              <input value={c.name} onChange={(e) => upd({ ...c, name: e.target.value })} placeholder="Название" className="input flex-1" />
              <input type="color" value={c.hex} onChange={(e) => upd({ ...c, hex: e.target.value })} className="h-9 w-12 border rounded cursor-pointer" />
              <input value={c.hex} onChange={(e) => upd({ ...c, hex: e.target.value })} className="input w-28" />
            </>
          )}
        />
      </Section>

      <Section title="Варианты (память/размер) с доплатой">
        <RowList<ProductVariant>
          items={p.variants}
          onChange={(items) => set("variants", items)}
          blank={() => ({ name: "256 ГБ", price_delta: 0 })}
          render={(v, upd) => (
            <>
              <input value={v.name} onChange={(e) => upd({ ...v, name: e.target.value })} placeholder="Название" className="input flex-1" />
              <input type="number" value={v.price_delta} onChange={(e) => upd({ ...v, price_delta: Number(e.target.value) })} placeholder="+₽" className="input w-32" />
            </>
          )}
        />
      </Section>

      <Section title="Характеристики">
        <RowList<ProductSpec>
          items={p.specs}
          onChange={(items) => set("specs", items)}
          blank={() => ({ key: "", value: "" })}
          render={(s, upd) => (
            <>
              <input value={s.key} onChange={(e) => upd({ ...s, key: e.target.value })} placeholder="Параметр" className="input flex-1" />
              <input value={s.value} onChange={(e) => upd({ ...s, value: e.target.value })} placeholder="Значение" className="input flex-1" />
            </>
          )}
        />
      </Section>

      <Section title="Дополнительные фото">
        <RowList<ProductImage>
          items={p.images}
          onChange={(items) => set("images", items)}
          blank={() => ({ url: "", alt: "" })}
          render={(im, upd) => (
            <>
              <input value={im.url} onChange={(e) => upd({ ...im, url: e.target.value })} placeholder="URL фото" className="input flex-1" />
              <input value={im.alt ?? ""} onChange={(e) => upd({ ...im, alt: e.target.value })} placeholder="alt" className="input w-40" />
            </>
          )}
        />
      </Section>

      <div className="flex gap-2 sticky bottom-0 bg-background py-3 border-t">
        <button onClick={save} className="px-4 py-2 rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1"><Save className="h-4 w-4" /> Сохранить</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-md border">Отмена</button>
      </div>

      <style>{`.input{width:100%;padding:.5rem .65rem;border:1px solid var(--border);border-radius:.5rem;background:var(--background);font-size:.875rem}`}</style>
    </div>
  );
}

/* =============== Helpers =============== */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="font-semibold text-base border-b pb-1">{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium block mb-1">{label}</span>
      {children}
    </label>
  );
}

function Modal({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full p-5 space-y-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded"><X className="h-4 w-4" /></button>
        </div>
        {children}
        <style>{`.input{width:100%;padding:.5rem .65rem;border:1px solid var(--border);border-radius:.5rem;background:var(--background);font-size:.875rem}`}</style>
      </div>
    </div>
  );
}

function RowList<T>({
  items, onChange, blank, render,
}: {
  items: T[]; onChange: (items: T[]) => void; blank: () => T;
  render: (item: T, update: (next: T) => void) => React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          {render(it, (next) => onChange(items.map((x, idx) => (idx === i ? next : x))))}
          <button
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="p-2 hover:bg-destructive/10 text-destructive rounded shrink-0"
          ><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
      <button onClick={() => onChange([...items, blank()])} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border text-xs hover:bg-secondary">
        <Plus className="h-3.5 w-3.5" /> Добавить
      </button>
    </div>
  );
}
