import Link from "next/link";
import { getProducts } from "@/lib/products-db";
import ProductCard from "@/components/product-card";
import CartLink from "@/components/cart-link";
import type { Product } from "@/types/product";

export const metadata = {
  title: "Shop | Molly Parton",
  description:
    "Festival-inspired clothing celebrating self-expression, freedom, and the feral joy of letting go.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  let products: Product[] = [];
  let hasCatalogError = false;

  try {
    products = await getProducts();
  } catch (error) {
    hasCatalogError = true;
    console.error("Failed to fetch products for shop", error);
  }

  return (
    <main className="grain mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-10 lg:px-10">
      <nav className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-black/70">
        <Link href="/" className="font-display text-2xl text-black">
          Molly Parton
        </Link>
        <div className="flex items-center gap-6">
          <span className="hidden md:inline">Drop 01</span>
          <CartLink className="rounded-full border border-black/30 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-black/70 transition hover:border-black/70" />
        </div>
      </nav>

      <section className="flex flex-col gap-4">
        <div className="sticker inline-flex w-fit items-center gap-3 rounded-full border border-black/30 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em]">
          Drop 01
        </div>
        <h1 className="font-display text-5xl uppercase leading-[0.9] tracking-wide md:text-6xl">
          The Collection
        </h1>
        <p className="max-w-xl text-base text-black/70">
          Festival-ready pieces built for self-expression and sunrise stories.
          Limited quantities, original art, made to feel like a memory.
        </p>
      </section>

      {hasCatalogError ? (
        <section className="rounded-[28px] border border-ember/30 bg-ember/10 p-6 text-sm text-ember">
          Shop is not ready yet. Create the `products` table in Supabase and run
          the Printify sync endpoint.
        </section>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 ? (
            <div className="rounded-[28px] border border-black/10 bg-white/80 p-8 text-sm text-black/70 sm:col-span-2 lg:col-span-3">
              No products found. Run product sync after your catalog is ready.
            </div>
          ) : null}
        </section>
      )}

      <footer className="mt-auto flex flex-col items-center gap-3 pb-10 pt-8 text-xs uppercase tracking-[0.3em] text-black/50">
        <Link href="/" className="transition hover:text-black/70">
          Back to home
        </Link>
        <span>Built for the wild-hearted</span>
      </footer>
    </main>
  );
}
