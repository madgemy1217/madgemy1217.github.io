import { createFileRoute, notFound } from "@tanstack/react-router";
import { CATEGORIES, getProductsByCategory, type Category } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/category/$category")({
  loader: ({ params }) => {
    const cat = CATEGORIES.find((c) => c.id === params.category);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.cat.label} — AppleStore` },
      { name: "description", content: `Купить ${loaderData?.cat.label} (${loaderData?.cat.ru}) с доставкой по России.` },
      { property: "og:title", content: `${loaderData?.cat.label} — AppleStore` },
    ],
  }),
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-24 text-center">
      <h1 className="text-3xl font-semibold">Категория не найдена</h1>
    </div>
  ),
});

function CategoryPage() {
  const { category } = Route.useParams();
  const { cat } = Route.useLoaderData();
  const products = getProductsByCategory(category as Category);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
      <div className="mb-10 fade-in-up">
        <div className="text-sm text-muted-foreground mb-2">{cat.ru}</div>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
          {cat.label}
        </h1>
        <p className="text-muted-foreground mt-3 text-lg">
          {products.length} {products.length === 1 ? "модель" : "модели"} в каталоге
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
