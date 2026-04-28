import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Header, Footer } from "@/components/Layout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Edit3, X, Save } from "lucide-react";
import type { Category, Product, ProductColor, ProductVariant, ProductSpec, ProductImage } from "@/lib/products";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/login" });
  }, [loading, isAdmin, navigate]);

  const [tab, setTab] = useState<"products" | "categories">("products");

  if (loading) return <Shell><p>Загрузка…</p></Shell>;
  if (!isAdmin) return null;

  return (
    <Shell>
      <h1 className="text-3xl font-bold mb-6">Админ-панель</h1>
      <div className="flex gap-2 mb-6 border-b">
        <TabBtn active={tab === "products"} onClick={() => setTab("products")}>Товары</TabBtn>
        <TabBtn active={tab === "categories"} onClick={() => setTab("categories")}>Категории</TabBtn>
      </div>
      {tab === "products" ? <ProductsTab /> : <CategoriesTab />}
    </Shell>
  );
}

function TabBtn({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${active ? "border-primary text-primary" : "border-transparent hover:text-primary"}`}>
      {children}
    </button>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
      <Footer />
    </div>
  );
}

/* ================= CATEGORIES ================= */
function CategoriesTab() {
  const [list, setList] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);

  const reload = useCallback(async () => {
    const { data, error } = await supabase.from("categories").select("*").order("sort_order");
    if (error) toast.error(error.message);
    else setList((data ?? []) as Category[]);
  }, []);
  useEffect(() => { reload(); }, [reload]);

  async function save() {
    if (!editing?.name || !editing.slug) return toast.error("Заполните имя и slug");
    const payload = { name: editing.name, slug: editing.slug, sort_order: editing.sort_order ?? 0 };
    const { error } = editing.id
      ? await supabase.from("categories").update(payload).eq("id", editing.id)
      : await supabase.from("categories").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Сохранено");
    setEditing(null);
    reload();
  }

  async function del(id: string) {
    if (!confirm("Удалить категорию?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Удалено"); reload(); }
  }

  return (
    <div>
      <button onClick={() => setEditing({ name: "", slug: "", sort_order: 0 })} className="mb-4 inline-flex items-center gap-1 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm">
        <Plus className="h-4 w-4" /> Новая категория
      </button>
      <div className="border rounded-lg divide-y">
        {list.map((c) => (
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
        {list.length === 0 && <p className="p-4 text-muted-foreground text-sm">Нет категорий</p>}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Редактирование категории" : "Новая категория"}>
          <Field label="Название"><input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input" /></Field>
          <Field label="Slug (латиницей)"><input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="input" /></Field>
          <Field label="Порядок сортировки"><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className="input" /></Field>
          <div className="flex gap-2 pt-2">
            <button onClick={save} className="px-4 py-2 rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1"><Save className="h-4 w-4" /> Сохранить</button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-md border">Отмена</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ================= PRODUCTS ================= */
function ProductsTab() {
  const [list, setList] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  const reload = useCallback(async () => {
    const [p, c] = await Promise.all([
      supabase.from("products").select("*").order("sort_order"),
      supabase.from("categories").select("*").order("sort_order"),
    ]);
    if (p.error) toast.error(p.error.message); else setList((p.data ?? []) as Product[]);
    if (!c.error) setCats((c.data ?? []) as Category[]);
  }, []);
  useEffect(() => { reload(); }, [reload]);

  async function del(id: string) {
    if (!confirm("Удалить товар вместе с его вариантами/цветами/характеристиками?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Удалено"); reload(); }
  }

  if (editingId) {
    return <ProductEditor productId={editingId === "new" ? null : editingId} categories={cats} onClose={() => { setEditingId(null); reload(); }} />;
  }

  return (
    <div>
      <button onClick={() => setEditingId("new")} className="mb-4 inline-flex items-center gap-1 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm">
        <Plus className="h-4 w-4" /> Новый товар
      </button>
      <div className="border rounded-lg divide-y">
        {list.map((p) => (
          <div key={p.id} className="flex items-center gap-3 p-3">
            {p.image && <img src={p.image} alt="" className="h-12 w-12 rounded object-cover" />}
            <div className="flex-1">
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.slug} · {p.price} ₽ · {p.in_stock ? "в наличии" : "нет"}</p>
            </div>
            <Link to="/product/$slug" params={{ slug: p.slug }} className="text-xs text-primary underline">смотреть</Link>
            <button onClick={() => setEditingId(p.id)} className="p-2 hover:bg-secondary rounded"><Edit3 className="h-4 w-4" /></button>
            <button onClick={() => del(p.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {list.length === 0 && <p className="p-4 text-muted-foreground text-sm">Нет товаров</p>}
      </div>
    </div>
  );
}

/* ================= PRODUCT EDITOR ================= */
function ProductEditor({ productId, categories, onClose }: { productId: string | null; categories: Category[]; onClose: () => void }) {
  const [p, setP] = useState<Partial<Product>>({
    name: "", slug: "", price: 0, in_stock: true, featured: false, sort_order: 0,
    category_id: null, old_price: null, tagline: "", description: "", image: "", aliases: "",
  });
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [specs, setSpecs] = useState<ProductSpec[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) { setLoading(false); return; }
    Promise.all([
      supabase.from("products").select("*").eq("id", productId).maybeSingle(),
      supabase.from("product_colors").select("*").eq("product_id", productId).order("sort_order"),
      supabase.from("product_variants").select("*").eq("product_id", productId).order("sort_order"),
      supabase.from("product_specs").select("*").eq("product_id", productId).order("sort_order"),
      supabase.from("product_images").select("*").eq("product_id", productId).order("sort_order"),
    ]).then(([pr, co, va, sp, im]) => {
      if (pr.data) setP(pr.data);
      setColors((co.data ?? []) as ProductColor[]);
      setVariants((va.data ?? []) as ProductVariant[]);
      setSpecs((sp.data ?? []) as ProductSpec[]);
      setImages((im.data ?? []) as ProductImage[]);
      setLoading(false);
    });
  }, [productId]);

  async function save() {
    if (!p.name || !p.slug) return toast.error("Имя и slug обязательны");
    const payload = {
      name: p.name, slug: p.slug, category_id: p.category_id || null,
      price: Number(p.price) || 0, old_price: p.old_price ? Number(p.old_price) : null,
      tagline: p.tagline || null, description: p.description || null,
      image: p.image || null, aliases: p.aliases || null,
      in_stock: !!p.in_stock, featured: !!p.featured, sort_order: Number(p.sort_order) || 0,
    };

    let id = productId;
    if (id) {
      const { error } = await supabase.from("products").update(payload).eq("id", id);
      if (error) return toast.error(error.message);
    } else {
      const { data, error } = await supabase.from("products").insert(payload).select("id").single();
      if (error) return toast.error(error.message);
      id = data.id;
    }

    // Sync child tables: simple approach — delete & reinsert
    await supabase.from("product_colors").delete().eq("product_id", id);
    if (colors.length) await supabase.from("product_colors").insert(colors.map((c, i) => ({ product_id: id!, name: c.name, hex: c.hex, sort_order: i })));
    await supabase.from("product_variants").delete().eq("product_id", id);
    if (variants.length) await supabase.from("product_variants").insert(variants.map((v, i) => ({ product_id: id!, name: v.name, price_delta: Number(v.price_delta) || 0, sort_order: i })));
    await supabase.from("product_specs").delete().eq("product_id", id);
    if (specs.length) await supabase.from("product_specs").insert(specs.map((s, i) => ({ product_id: id!, spec_key: s.spec_key, spec_value: s.spec_value, sort_order: i })));
    await supabase.from("product_images").delete().eq("product_id", id);
    if (images.length) await supabase.from("product_images").insert(images.map((im, i) => ({ product_id: id!, url: im.url, alt: im.alt, sort_order: i })));

    toast.success("Сохранено");
    onClose();
  }

  if (loading) return <p>Загрузка…</p>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{productId ? "Редактирование" : "Новый товар"}</h2>
        <button onClick={onClose} className="p-2 hover:bg-secondary rounded"><X className="h-4 w-4" /></button>
      </div>

      <Section title="Основное">
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Название"><input value={p.name ?? ""} onChange={(e) => setP({ ...p, name: e.target.value })} className="input" /></Field>
          <Field label="Slug (URL, латиницей)"><input value={p.slug ?? ""} onChange={(e) => setP({ ...p, slug: e.target.value })} className="input" /></Field>
          <Field label="Категория">
            <select value={p.category_id ?? ""} onChange={(e) => setP({ ...p, category_id: e.target.value || null })} className="input">
              <option value="">— без категории —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Порядок"><input type="number" value={p.sort_order ?? 0} onChange={(e) => setP({ ...p, sort_order: Number(e.target.value) })} className="input" /></Field>
          <Field label="Цена (₽)"><input type="number" value={p.price ?? 0} onChange={(e) => setP({ ...p, price: Number(e.target.value) })} className="input" /></Field>
          <Field label="Старая цена (₽, необязательно)"><input type="number" value={p.old_price ?? ""} onChange={(e) => setP({ ...p, old_price: e.target.value ? Number(e.target.value) : null })} className="input" /></Field>
          <Field label="Главное фото (URL)"><input value={p.image ?? ""} onChange={(e) => setP({ ...p, image: e.target.value })} className="input" placeholder="/assets/iphone.jpg или https://…" /></Field>
          <Field label="Слоган"><input value={p.tagline ?? ""} onChange={(e) => setP({ ...p, tagline: e.target.value })} className="input" /></Field>
        </div>
        <Field label="Описание"><textarea value={p.description ?? ""} onChange={(e) => setP({ ...p, description: e.target.value })} className="input min-h-24" /></Field>
        <Field label="Алиасы для поиска (через пробел)"><input value={p.aliases ?? ""} onChange={(e) => setP({ ...p, aliases: e.target.value })} className="input" /></Field>
        <div className="flex gap-4">
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!p.in_stock} onChange={(e) => setP({ ...p, in_stock: e.target.checked })} /> В наличии</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!p.featured} onChange={(e) => setP({ ...p, featured: e.target.checked })} /> Рекомендованный</label>
        </div>
      </Section>

      <Section title="Цвета">
        <RowList
          items={colors}
          onAdd={() => setColors([...colors, { id: crypto.randomUUID(), product_id: "", name: "Цвет", hex: "#cccccc", sort_order: colors.length }])}
          onRemove={(i) => setColors(colors.filter((_, idx) => idx !== i))}
          render={(c, i) => (
            <>
              <input value={c.name} onChange={(e) => setColors(colors.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} placeholder="Название" className="input flex-1" />
              <input type="color" value={c.hex} onChange={(e) => setColors(colors.map((x, idx) => idx === i ? { ...x, hex: e.target.value } : x))} className="h-9 w-12 border rounded cursor-pointer" />
              <input value={c.hex} onChange={(e) => setColors(colors.map((x, idx) => idx === i ? { ...x, hex: e.target.value } : x))} className="input w-28" />
            </>
          )}
        />
      </Section>

      <Section title="Варианты (память/размер) с доплатой">
        <RowList
          items={variants}
          onAdd={() => setVariants([...variants, { id: crypto.randomUUID(), product_id: "", name: "256 ГБ", price_delta: 0, sort_order: variants.length }])}
          onRemove={(i) => setVariants(variants.filter((_, idx) => idx !== i))}
          render={(v, i) => (
            <>
              <input value={v.name} onChange={(e) => setVariants(variants.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} placeholder="Название" className="input flex-1" />
              <input type="number" value={v.price_delta} onChange={(e) => setVariants(variants.map((x, idx) => idx === i ? { ...x, price_delta: Number(e.target.value) } : x))} placeholder="+₽" className="input w-32" />
            </>
          )}
        />
      </Section>

      <Section title="Характеристики">
        <RowList
          items={specs}
          onAdd={() => setSpecs([...specs, { id: crypto.randomUUID(), product_id: "", spec_key: "", spec_value: "", sort_order: specs.length }])}
          onRemove={(i) => setSpecs(specs.filter((_, idx) => idx !== i))}
          render={(s, i) => (
            <>
              <input value={s.spec_key} onChange={(e) => setSpecs(specs.map((x, idx) => idx === i ? { ...x, spec_key: e.target.value } : x))} placeholder="Параметр (Процессор)" className="input flex-1" />
              <input value={s.spec_value} onChange={(e) => setSpecs(specs.map((x, idx) => idx === i ? { ...x, spec_value: e.target.value } : x))} placeholder="Значение (A18 Pro)" className="input flex-1" />
            </>
          )}
        />
      </Section>

      <Section title="Дополнительные фото">
        <RowList
          items={images}
          onAdd={() => setImages([...images, { id: crypto.randomUUID(), product_id: "", url: "", alt: "", sort_order: images.length }])}
          onRemove={(i) => setImages(images.filter((_, idx) => idx !== i))}
          render={(im, i) => (
            <>
              <input value={im.url} onChange={(e) => setImages(images.map((x, idx) => idx === i ? { ...x, url: e.target.value } : x))} placeholder="URL фото" className="input flex-1" />
              <input value={im.alt ?? ""} onChange={(e) => setImages(images.map((x, idx) => idx === i ? { ...x, alt: e.target.value } : x))} placeholder="alt" className="input w-40" />
            </>
          )}
        />
      </Section>

      <div className="flex gap-2 sticky bottom-0 bg-background py-4 border-t">
        <button onClick={save} className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1"><Save className="h-4 w-4" /> Сохранить</button>
        <button onClick={onClose} className="px-5 py-2.5 rounded-md border">Отмена</button>
      </div>

      <style>{`.input{width:100%;padding:.5rem .7rem;border:1px solid var(--border);border-radius:.5rem;background:var(--background);font-size:.9rem}`}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border rounded-lg p-4 space-y-3 bg-card">
      <h3 className="font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function RowList<T>({ items, onAdd, onRemove, render }: { items: T[]; onAdd: () => void; onRemove: (i: number) => void; render: (item: T, i: number) => React.ReactNode }) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          {render(it, i)}
          <button onClick={() => onRemove(i)} className="p-2 hover:bg-destructive/10 text-destructive rounded shrink-0"><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
      <button onClick={onAdd} className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded border hover:bg-secondary"><Plus className="h-3 w-3" /> Добавить</button>
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-background border rounded-xl p-6 max-w-md w-full space-y-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
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
