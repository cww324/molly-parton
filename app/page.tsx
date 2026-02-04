import Link from "next/link";
import { getProducts } from "@/lib/products-db";
import ProductCard from "@/components/product-card";
import CartLink from "@/components/cart-link";
import type { Product } from "@/types/product";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: Product[] = [];
  let hasCatalogError = false;

  try {
    products = await getProducts();
  } catch (error) {
    hasCatalogError = true;
    console.error("Failed to load products for home page", error);
  }

  return (
    <main className="grain mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-6 py-10 lg:px-10">
      <nav className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-black/70">
        <div className="font-display text-2xl text-black">Molly Parton</div>
        <div className="flex items-center gap-6">
          <Link href="/shop" className="hidden md:inline">
            Shop
          </Link>
          <CartLink className="rounded-full border border-black/30 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-black/70 transition hover:border-black/70" />
        </div>
      </nav>

      <section className="flex flex-col gap-4">
        <div className="sticker inline-flex w-fit items-center gap-3 rounded-full border border-black/30 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em]">
          Drop 01
        </div>
        <h1 className="font-display text-5xl uppercase leading-[0.9] tracking-wide md:text-7xl">
          The collection is live
        </h1>
        <p className="max-w-2xl text-base text-black/70">
          Festivalwear for the feral. Original art, limited run, shipped on
          demand.
        </p>
      </section>

      <section className="flex flex-col gap-8">
        {hasCatalogError ? (
          <div className="rounded-[28px] border border-ember/30 bg-ember/10 p-6 text-sm text-ember">
            Catalog setup is incomplete. Please retry in a moment.
          </div>
        ) : null}
        {products.length === 0 && !hasCatalogError ? (
          <div className="rounded-[28px] border border-black/10 bg-white/80 p-8 text-sm text-black/70">
            No products are live yet.
          </div>
        ) : null}
        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </section>

      <footer className="flex flex-col items-center gap-3 pb-10 text-xs uppercase tracking-[0.3em] text-black/50">
        <span>Built for the wild-hearted</span>
        <Link href="/shop" className="transition hover:text-black/70">
          View full shop
        </Link>
      </footer>
    </main>
  );
}
