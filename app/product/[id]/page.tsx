import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import ProductPurchase from "@/components/product-purchase";

type ProductPageProps = {
  params: { id: string };
};

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((item) => item.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-10 lg:px-10">
      <nav className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-black/70">
        <Link href="/" className="font-display text-2xl text-black">
          Molly Parton
        </Link>
        <Link
          href="/cart"
          className="rounded-full border border-black/30 px-4 py-2 text-xs tracking-[0.25em] transition hover:border-black/70"
        >
          Cart
        </Link>
      </nav>

      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-[32px] border border-black/10 bg-white/80 p-6 shadow-xl">
            <div className="text-xs uppercase tracking-[0.3em] text-black/60">
              Placeholder art preview
            </div>
            <div
              className="mt-4 h-80 rounded-3xl border border-black/10"
              style={{ background: product.gradient }}
            />
          </div>
          <div className="grid gap-4 rounded-3xl border border-black/10 bg-white/70 p-6 text-sm">
            <div className="text-xs uppercase tracking-[0.3em] text-black/60">
              Details
            </div>
            <div className="flex justify-between gap-6 text-black/70">
              <span>Fit</span>
              <span className="text-right">{product.fit}</span>
            </div>
            <div className="flex justify-between gap-6 text-black/70">
              <span>Colors</span>
              <span className="text-right">{product.colors}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-black/60">
              {product.tag}
            </p>
            <h1 className="font-display text-5xl uppercase">{product.name}</h1>
          </div>
          <p className="text-base text-black/70">{product.description}</p>
          <div className="flex items-center gap-4 text-sm uppercase tracking-[0.3em] text-black/60">
            <span>${product.price}</span>
            <span>Ships in 3-5 days</span>
          </div>
          <ProductPurchase
            productId={product.id}
            productName={product.name}
          />
          <div className="rounded-3xl border border-black/10 bg-white/70 p-6 text-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-black/60">
              Why this blank
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-black/70">
              {product.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.3em] text-black/60"
          >
            Back to drop
          </Link>
        </div>
      </section>
    </main>
  );
}
