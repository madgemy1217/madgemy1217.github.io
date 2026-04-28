import { supabase } from "@/integrations/supabase/client";

export type Category = { id: string; slug: string; name: string; sort_order: number };
export type Product = {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  price: number;
  old_price: number | null;
  tagline: string | null;
  description: string | null;
  image: string | null;
  in_stock: boolean;
  featured: boolean;
  aliases: string | null;
  sort_order: number;
};
export type ProductColor = { id: string; product_id: string; name: string; hex: string; sort_order: number };
export type ProductVariant = { id: string; product_id: string; name: string; price_delta: number; sort_order: number };
export type ProductSpec = { id: string; product_id: string; spec_key: string; spec_value: string; sort_order: number };
export type ProductImage = { id: string; product_id: string; url: string; alt: string | null; sort_order: number };

export async function fetchCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("sort_order");
  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function fetchProducts() {
  const { data, error } = await supabase.from("products").select("*").order("sort_order");
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function fetchProductBySlug(slug: string) {
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!product) return null;
  const [colors, variants, specs, images] = await Promise.all([
    supabase.from("product_colors").select("*").eq("product_id", product.id).order("sort_order"),
    supabase.from("product_variants").select("*").eq("product_id", product.id).order("sort_order"),
    supabase.from("product_specs").select("*").eq("product_id", product.id).order("sort_order"),
    supabase.from("product_images").select("*").eq("product_id", product.id).order("sort_order"),
  ]);
  return {
    product: product as Product,
    colors: (colors.data ?? []) as ProductColor[],
    variants: (variants.data ?? []) as ProductVariant[],
    specs: (specs.data ?? []) as ProductSpec[],
    images: (images.data ?? []) as ProductImage[],
  };
}
