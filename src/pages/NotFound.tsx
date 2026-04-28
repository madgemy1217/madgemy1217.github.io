import { Link } from "react-router-dom";
import { Shell } from "@/components/Layout";

export default function NotFoundPage() {
  return (
    <Shell>
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground mb-6">Страница не найдена</p>
        <Link to="/" className="text-primary underline">На главную</Link>
      </div>
    </Shell>
  );
}
