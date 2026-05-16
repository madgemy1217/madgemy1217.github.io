import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shell } from "@/components/Layout";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/utils";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", delivery: "pickup", payment: "cash", address: "", notes: "",
  });

  // При выборе наличных — автоматически самовывоз
  function setPayment(payment: string) {
    setForm((f) => ({
      ...f,
      payment,
      delivery: payment === "cash" ? "pickup" : f.delivery,
    }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return toast.error("Корзина пуста");
    if (form.name.trim().length < 2) return toast.error("Укажите имя");
    if (form.phone.trim().length < 5) return toast.error("Укажите телефон");
    setSubmitting(true);
    try {
      clear();
      toast.success("Заказ оформлен! Мы свяжемся с вами в ближайшее время.");
      navigate("/");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Shell>
      <h1 className="text-3xl font-bold mb-6">Оформление заказа</h1>
      <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
        <Field label="Имя"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></Field>
        <Field label="Телефон"><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" /></Field>
        <Field label="Способ доставки">
          <select value={form.delivery} onChange={(e) => setForm({ ...form, delivery: e.target.value })} className="input">
            <option value="pickup">Самовывоз</option>
            <option value="courier">Курьер</option>
            <option value="post">Почта</option>
          </select>
        </Field>
        <Field label="Способ оплаты">
          <select value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value })} className="input">
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
            {submitting ? "Отправка…" : "Оформить через Telegram"}
          </button>
        </div>
      </form>
      <style>{`.input{width:100%;padding:.55rem .75rem;border:1px solid var(--border);border-radius:.5rem;background:var(--background)}`}</style>
    </Shell>
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
