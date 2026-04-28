import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header, Footer } from "@/components/Layout";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const TELEGRAM_USERNAME = "your_username"; // замените на свой Telegram

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(5).max(30),
  delivery: z.enum(["pickup", "courier", "post"]),
  payment: z.enum(["cash", "card", "transfer"]),
  address: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", delivery: "pickup" as const, payment: "cash" as const, address: "", notes: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return toast.error("Корзина пуста");
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setSubmitting(true);
    try {
      const { error } = await supabase.from("orders").insert({
        customer_name: parsed.data.name,
        customer_phone: parsed.data.phone,
        delivery_method: parsed.data.delivery,
        payment_method: parsed.data.payment,
        delivery_address: parsed.data.address || null,
        notes: parsed.data.notes || null,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        total_amount: total,
      });
      if (error) throw error;

      const lines = items.map((i) => `• ${i.name} × ${i.qty} — ${money(i.price * i.qty)}`).join("%0A");
      const msg = `Новый заказ ATH STORE%0A%0A${lines}%0A%0AИтого: ${money(total)}%0AИмя: ${parsed.data.name}%0AТел: ${parsed.data.phone}`;
      window.open(`https://t.me/${TELEGRAM_USERNAME}?text=${msg}`, "_blank");

      clear();
      toast.success("Заказ принят!");
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err.message ?? "Ошибка отправки");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Оформление заказа</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Имя"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></Field>
          <Field label="Телефон"><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" /></Field>
          <Field label="Способ доставки">
            <select value={form.delivery} onChange={(e) => setForm({ ...form, delivery: e.target.value as any })} className="input">
              <option value="pickup">Самовывоз</option>
              <option value="courier">Курьер</option>
              <option value="post">Почта</option>
            </select>
          </Field>
          <Field label="Способ оплаты">
            <select value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value as any })} className="input">
              <option value="cash">Наличные</option>
              <option value="card">Карта</option>
              <option value="transfer">Перевод</option>
            </select>
          </Field>
          {form.delivery !== "pickup" && (
            <Field label="Адрес"><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input" /></Field>
          )}
          <Field label="Комментарий"><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input min-h-20" /></Field>
          <div className="flex items-center justify-between pt-4 border-t">
            <span className="text-lg">Итого: <strong>{money(total)}</strong></span>
            <button disabled={submitting} className="px-6 py-2.5 rounded-md bg-primary text-primary-foreground font-medium disabled:opacity-50">
              {submitting ? "Отправка…" : "Оформить"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
      <style>{`.input{width:100%;padding:.55rem .75rem;border:1px solid var(--border);border-radius:.5rem;background:var(--background)}`}</style>
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
