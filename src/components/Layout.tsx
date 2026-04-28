import { Link } from "react-router-dom";
import { ShoppingCart, ShieldCheck, LogOut } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

export function Header() {
  const { count } = useCart();
  const { isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}assets/logo-ath.jpg`} alt="ATH STORE" className="h-9 w-9 rounded-md object-cover" />
          <span className="font-bold text-lg tracking-tight">ATH STORE</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-primary transition-colors">Каталог</Link>
        </nav>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link to="/admin" className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border hover:bg-secondary">
              <ShieldCheck className="h-4 w-4" /> Админ
            </Link>
          )}
          {isAdmin && (
            <button onClick={signOut} className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md hover:bg-secondary" title="Выйти">
              <LogOut className="h-4 w-4" />
            </button>
          )}
          <Link to="/cart" className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90">
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm font-medium">{count}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto px-4 py-8 text-sm text-muted-foreground flex flex-col md:flex-row gap-4 items-center justify-between">
        <p>© {new Date().getFullYear()} ATH STORE. Все права защищены.</p>
        <p>Оригинальная техника Apple</p>
      </div>
    </footer>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
