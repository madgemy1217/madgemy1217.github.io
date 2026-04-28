import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header, Footer } from "@/components/Layout";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { signIn, isAdmin, loading } = useAuth();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAdmin) navigate({ to: "/admin" });
  }, [loading, isAdmin, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(login, password);
    setSubmitting(false);
    if (error) toast.error(error);
    else {
      toast.success("Вход выполнен");
      navigate({ to: "/admin" });
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-12 flex-1 max-w-sm">
        <h1 className="text-2xl font-bold mb-6">Вход для администратора</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium block mb-1">Логин</span>
            <input
              type="text"
              required
              autoComplete="username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium block mb-1">Пароль</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </label>
          <button
            disabled={submitting}
            className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-medium disabled:opacity-50"
          >
            {submitting ? "Вход…" : "Войти"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
