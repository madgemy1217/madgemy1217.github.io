import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/Home";
import CategoryPage from "@/pages/Category";
import ProductPage from "@/pages/Product";
import CartPage from "@/pages/Cart";
import CheckoutPage from "@/pages/Checkout";
import LoginPage from "@/pages/Login";
import AdminPage from "@/pages/Admin";
import NotFoundPage from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:slug" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
