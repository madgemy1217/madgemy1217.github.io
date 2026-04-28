import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingBag, X, Menu } from "lucide-react";
import { CATEGORIES } from "@/lib/products";
import { searchProducts } from "@/lib/search";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import logoAth from "@/assets/logo-ath.jpg";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { count } = useCart();

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = query.trim() ? searchProducts(query) : [];

  return (
    <>
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight text-foreground" aria-label="ATH STORE — на главную">
            <img src={logoAth} alt="ATH STORE" className="h-8 w-8 object-contain" width={32} height={32} />
            <span className="text-lg">
              <span style={{ color: "#3b8b33" }}>ATH</span>
              <span className="ml-1 text-foreground">STORE</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to="/category/$category"
                params={{ category: c.id }}
                className="transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {c.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Поиск"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              to="/cart"
              className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Корзина"
            >
              <ShoppingBag className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden rounded-full p-2 text-muted-foreground hover:bg-secondary"
              aria-label="Меню"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden border-t border-border/50 bg-background/95 px-4 py-3 flex flex-col gap-1">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to="/category/$category"
                params={{ category: c.id }}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {c.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 backdrop-blur-md p-4 pt-[10vh]">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск… попробуйте «айфон» или «макбук»"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-secondary"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {query.trim() === "" && (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Поддерживается русский язык: «айфон», «макбук эйр», «часы ультра»…
                </div>
              )}
              {query.trim() !== "" && results.length === 0 && (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Ничего не найдено
                </div>
              )}
              {results.map(({ product }) => (
                <button
                  key={product.id}
                  onClick={() => {
                    navigate({ to: "/product/$slug", params: { slug: product.slug } });
                    setSearchOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-secondary"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-14 w-14 rounded-lg object-cover bg-muted"
                    loading="lazy"
                    width={56}
                    height={56}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{product.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{product.tagline}</div>
                  </div>
                  <div className="text-sm font-semibold whitespace-nowrap">
                    {formatPrice(product.price)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
