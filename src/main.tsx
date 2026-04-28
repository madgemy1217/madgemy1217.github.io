import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          <Toaster richColors position="top-center" />
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
);
