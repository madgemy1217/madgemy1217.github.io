// Edge Function: send-order-email
// Sends order notification to admin email via Resend if RESEND_API_KEY is set.
// Otherwise logs the order so the user can check Cloud → Functions logs.
// Update ADMIN_EMAIL below with the real recipient.

const ADMIN_EMAIL = "admin@example.com"; // ← заменить на реальный email

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderPayload {
  orderId: string;
  name: string;
  phone: string;
  delivery: "pickup" | "moscow" | "russia";
  payment: "cash" | "card_transfer";
  address: string | null;
  notes: string | null;
  items: OrderItem[];
  total: number;
}

const deliveryLabel = (d: string) =>
  d === "pickup" ? "Самовывоз" : d === "moscow" ? "Доставка по Москве" : "Доставка по России";
const paymentLabel = (p: string) =>
  p === "cash" ? "Наличными при получении" : "Перевод на карту";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const order = (await req.json()) as OrderPayload;

    const itemsHtml = order.items
      .map(
        (i) =>
          `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td><td style="padding:8px;text-align:center">${i.quantity}</td><td style="padding:8px;text-align:right">${fmt(i.price * i.quantity)}</td></tr>`,
      )
      .join("");

    const html = `
      <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111">
        <h1 style="margin:0 0 8px">Новый заказ #${order.orderId.slice(0, 8)}</h1>
        <p style="color:#666;margin:0 0 24px">Сумма: <strong>${fmt(order.total)}</strong></p>

        <h2 style="font-size:16px;margin:0 0 8px">Покупатель</h2>
        <p style="margin:0 0 4px"><strong>${order.name}</strong></p>
        <p style="margin:0 0 16px">Тел: <a href="tel:${order.phone}">${order.phone}</a></p>

        <h2 style="font-size:16px;margin:0 0 8px">Доставка и оплата</h2>
        <p style="margin:0 0 4px">${deliveryLabel(order.delivery)}</p>
        ${order.address ? `<p style="margin:0 0 4px">Адрес: ${order.address}</p>` : ""}
        <p style="margin:0 0 16px">Оплата: ${paymentLabel(order.payment)}</p>

        ${order.notes ? `<p style="margin:0 0 16px"><em>Комментарий: ${order.notes}</em></p>` : ""}

        <h2 style="font-size:16px;margin:0 0 8px">Состав заказа</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <thead><tr style="border-bottom:2px solid #111">
            <th style="padding:8px;text-align:left">Товар</th>
            <th style="padding:8px">Кол-во</th>
            <th style="padding:8px;text-align:right">Сумма</th>
          </tr></thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot><tr><td colspan="2" style="padding:12px 8px;text-align:right;font-weight:600">Итого:</td><td style="padding:12px 8px;text-align:right;font-weight:600">${fmt(order.total)}</td></tr></tfoot>
        </table>
      </div>
    `;

    const text = `Новый заказ #${order.orderId.slice(0, 8)}
Сумма: ${fmt(order.total)}
Покупатель: ${order.name}, ${order.phone}
${deliveryLabel(order.delivery)}${order.address ? `\nАдрес: ${order.address}` : ""}
Оплата: ${paymentLabel(order.payment)}
${order.notes ? `Комментарий: ${order.notes}\n` : ""}
Товары:
${order.items.map((i) => `  • ${i.name} × ${i.quantity} — ${fmt(i.price * i.quantity)}`).join("\n")}`;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      console.log("📧 NEW ORDER (no RESEND_API_KEY set, logging only):");
      console.log(text);
      return new Response(
        JSON.stringify({ success: true, emailSent: false, reason: "RESEND_API_KEY not set" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ATH STORE <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `Новый заказ #${order.orderId.slice(0, 8)} — ${fmt(order.total)}`,
        html,
        text,
      }),
    });

    const result = await resp.json();
    if (!resp.ok) {
      console.error("Resend error:", result);
      return new Response(JSON.stringify({ success: false, error: result }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, emailSent: true, id: result.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-order-email error:", e);
    return new Response(JSON.stringify({ success: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
