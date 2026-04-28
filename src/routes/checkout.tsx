import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Оформление заказа — ATH STORE" }],
  }),
  component: CheckoutPage,
});

type Delivery = "pickup" | "moscow" | "russia";
type Payment = "cash" | "card_transfer";

function CheckoutPage() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [delivery, setDelivery] = useState<Delivery>("pickup");
  const [payment, setPayment] = useState<Payment>("cash");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Constraint: cash only for pickup
  const availablePayments: Payment[] = delivery === "pickup" ? ["cash"] : ["card_transfer"];
  const effectivePayment: Payment = availablePayments.includes(payment) ? payment : availablePayments[0];

  if (items.length === 0 && !done) {
    return (
      <div className="mx-auto max-w-3xl px-4 md:px-8 py-24 text-center">
        <h1 className="text-3xl font-semibold">Корзина пуста</h1>
        <button
          onClick={() => navigate({ to: "/" })}
          className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          В каталог
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 md:px-8 py-24 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Check className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-semibold">Заказ принят!</h1>
        <p className="mt-3 text-muted-foreground">
          Мы свяжемся с вами по телефону <span className="text-foreground">{phone}</span> в ближайшее время для подтверждения.
        </p>
        <button
          onClick={() => navigate({ to: "/" })}
          className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 glow"
        >
          На главную
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) return toast.error("Укажите имя");
    if (!/^[+\d\s()-]{7,20}$/.test(phone)) return toast.error("Укажите корректный телефон");
    if (delivery !== "pickup" && address.trim().length < 5) return toast.error("Укажите адрес доставки");

    setSubmitting(true);
    try {
      const orderItems = items.map(({ product, quantity }) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
      }));

      const { data, error } = await supabase
        .from("orders")
        .insert({
          customer_name: name.trim().slice(0, 200),
          customer_phone: phone.trim().slice(0, 30),
          delivery_method: delivery,
          payment_method: effectivePayment,
          delivery_address: delivery === "pickup" ? null : address.trim().slice(0, 500),
          items: orderItems,
          total_amount: total,
          notes: notes.trim().slice(0, 1000) || null,
        })
        .select("id")
        .single();

      if (error) throw error;

      // Fire-and-forget email notification (won't block success)
      supabase.functions
        .invoke("send-order-email", {
          body: {
            orderId: data.id,
            name,
            phone,
            delivery,
            payment: effectivePayment,
            address: delivery === "pickup" ? null : address,
            notes,
            items: orderItems,
            total,
          },
        })
        .catch(() => {
          /* silently ignore — order is saved in DB */
        });

      clear();
      setDone(true);
    } catch (err) {
      console.error(err);
      toast.error("Не удалось оформить заказ. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  };

  const deliveryOptions: { id: Delivery; label: string; desc: string }[] = [
    { id: "pickup", label: "Самовывоз", desc: "Москва, Тверская 1" },
    { id: "moscow", label: "Доставка по Москве", desc: "1 день" },
    { id: "russia", label: "Доставка по России", desc: "3–7 дней" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8 py-12">
      <h1 className="text-4xl font-semibold mb-10">Оформление заказа</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-8">
          {/* Contact */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-5">Контакты</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">ФИО или имя</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={200}
                  placeholder="Иван Иванов"
                  className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Телефон</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  type="tel"
                  maxLength={30}
                  placeholder="+7 (999) 123-45-67"
                  className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-5">Способ получения</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {deliveryOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setDelivery(opt.id)}
                  className={`text-left rounded-xl border p-4 transition-colors ${
                    delivery === opt.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/30 hover:bg-secondary"
                  }`}
                >
                  <div className="text-sm font-medium">{opt.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
            {delivery !== "pickup" && (
              <div className="mt-5">
                <label className="text-xs text-muted-foreground mb-1.5 block">Адрес доставки</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  maxLength={500}
                  placeholder="Город, улица, дом, кв."
                  className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
            )}
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-5">Способ оплаты</h2>
            <div className="space-y-2">
              {delivery === "pickup" ? (
                <div className="rounded-xl border border-primary bg-primary/10 p-4">
                  <div className="text-sm font-medium">Наличными при получении</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Оплата в пункте самовывоза
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-primary bg-primary/10 p-4">
                  <div className="text-sm font-medium">Перевод на карту</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Реквизиты пришлём после подтверждения заказа
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                При самовывозе — только наличные. При доставке — только переводом на карту.
              </p>
            </div>
          </section>

          {/* Notes */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-5">Комментарий к заказу</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="Необязательно"
              className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-sm outline-none focus:border-primary resize-none"
            />
          </section>
        </div>

        {/* Summary */}
        <aside className="rounded-2xl border border-border bg-card p-6 h-fit lg:sticky lg:top-20 space-y-4">
          <div className="text-lg font-semibold">Ваш заказ</div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 items-center text-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-12 w-12 rounded-lg object-cover bg-secondary"
                  loading="lazy"
                  width={48}
                  height={48}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{product.name}</div>
                  <div className="text-xs text-muted-foreground">× {quantity}</div>
                </div>
                <div className="text-sm font-semibold">
                  {formatPrice(product.price * quantity)}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 flex justify-between font-semibold">
            <span>К оплате</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 glow disabled:opacity-60"
          >
            {submitting ? "Отправляем…" : "Подтвердить заказ"}
          </button>
        </aside>
      </form>
    </div>
  );
}
