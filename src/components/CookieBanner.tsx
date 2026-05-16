import { useEffect, useState } from "react";

const STORAGE_KEY = "ath_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* ignore */
    }
  }, []);

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50 rounded-xl border bg-background shadow-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <p className="text-sm text-muted-foreground flex-1">
        Этот сайт использует cookie-файлы для сбора информации и улучшения работы. Продолжая использовать сайт, вы соглашаетесь с этим.
      </p>
      <button
        onClick={accept}
        className="shrink-0 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
      >
        Принять
      </button>
    </div>
  );
}
