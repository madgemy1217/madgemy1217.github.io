import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "ath_admin_auth";
const ADMIN_LOGIN = "root";
const ADMIN_PASSWORD = "1234";

type AuthCtx = {
  isAdmin: boolean;
  loading: boolean;
  signIn: (login: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdmin(window.localStorage.getItem(STORAGE_KEY) === "1");
    }
    setLoading(false);
  }, []);

  async function signIn(login: string, password: string) {
    if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
      window.localStorage.setItem(STORAGE_KEY, "1");
      setIsAdmin(true);
      return {};
    }
    return { error: "Неверный логин или пароль" };
  }

  async function signOut() {
    window.localStorage.removeItem(STORAGE_KEY);
    setIsAdmin(false);
  }

  return (
    <Ctx.Provider value={{ isAdmin, loading, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
