import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/products";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <div className="text-base font-semibold mb-3 text-foreground">
            AppleStore
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Официальная техника Apple с доставкой по всей России.
          </p>
        </div>
        <div>
          <div className="font-medium mb-3">Каталог</div>
          <ul className="space-y-2 text-muted-foreground">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  to="/category/$category"
                  params={{ category: c.id }}
                  className="hover:text-foreground transition-colors"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-medium mb-3">Покупка</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>Доставка по Москве</li>
            <li>Доставка по России</li>
            <li>Самовывоз</li>
            <li>Способы оплаты</li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-3">Контакты</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>+7 (999) 000-00-00</li>
            <li>info@applestore.ru</li>
            <li>Москва, ул. Тверская, 1</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AppleStore. Apple, логотип Apple, iPhone, iPad, Mac — товарные знаки Apple Inc.
      </div>
    </footer>
  );
}
