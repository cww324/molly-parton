import { supabaseServer } from "@/lib/supabase";
import type { DbProduct, DbProductInsert, Product } from "@/types/product";
import { toProduct } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabaseServer
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return (data as DbProduct[]).map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabaseServer
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  return toProduct(data as DbProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabaseServer
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  return toProduct(data as DbProduct);
}

export async function getDbProductById(id: string): Promise<DbProduct | null> {
  const { data, error } = await supabaseServer
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  return data as DbProduct;
}

export async function upsertProduct(product: DbProductInsert): Promise<void> {
  const { error } = await supabaseServer.from("products").upsert(
    {
      ...product,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "printify_id",
    }
  );

  if (error) {
    throw new Error(`Failed to upsert product: ${error.message}`);
  }
}

export async function upsertProducts(products: DbProductInsert[]): Promise<void> {
  const productsWithTimestamp = products.map((product) => ({
    ...product,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabaseServer.from("products").upsert(
    productsWithTimestamp,
    {
      onConflict: "printify_id",
    }
  );

  if (error) {
    throw new Error(`Failed to upsert products: ${error.message}`);
  }
}
