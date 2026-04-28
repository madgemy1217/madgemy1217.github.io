import { Link } from "react-router-dom";
import { Shell } from "@/components/Layout";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, setQty, remove, total } = useCart();

  return (
    <Shell>
      <h1 className="text-3xl font-bold mb-6">Корзина</h1>
      {items.length === 0 ? (
        <div className="text-muted-foreground">
          Корзина пуста. <Link to="/" className="text-primary underline">Перейти к каталогу</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((i) => (
              <div key={i.id} className="flex gap-4 p-4 border rounded-lg bg-card">
                {i.image && <img src={i.image} alt={i.name} className="h-20 w-20 object-cover rounded-md" />}
                <div className="flex-1">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-sm text-muted-foreground">{money(i.price)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => setQty(i.id, i.qty - 1)} className="h-7 w-7 rounded border hover:bg-secondary">−</button>
                    <span className="w-8 text-center text-sm">{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)} className="h-7 w-7 rounded border hover:bg-secondary">+</button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  <p className="font-semibold">{money(i.price * i.qty)}</p>
                </div>
              </div>
            ))}
          </div>
          <aside className="border rounded-lg p-5 bg-card h-fit">
            <p className="flex justify-between text-lg"><span>Итого</span><span className="font-bold">{money(total)}</span></p>
            <Link to="/checkout" className="mt-4 block w-full text-center py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90">
              Оформить заказ
            </Link>
          </aside>
        </div>
      )}
    </Shell>
  );
}
