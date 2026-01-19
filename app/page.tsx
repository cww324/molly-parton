import Link from "next/link";
import ProductCard from "@/components/product-card";
import { featuredProduct, products } from "@/lib/products";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-10 lg:px-10">
      <nav className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-black/70">
        <div className="font-display text-2xl text-black">Molly Parton</div>
        <div className="hidden gap-8 md:flex">
          <span>Drop 01</span>
          <span>Story</span>
          <span>Cart</span>
        </div>
        <Link
          href="/cart"
          className="rounded-full border border-black/30 px-4 py-2 text-xs tracking-[0.25em] transition hover:border-black/70"
        >
          Cart
        </Link>
      </nav>

      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <div className="sticker inline-flex w-fit items-center gap-3 rounded-full border border-black/30 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em]">
            Festivalwear for the feral
          </div>
          <h1 className="font-display text-5xl uppercase leading-[0.9] tracking-wide md:text-7xl">
            Let go. Glow up. Get weird.
          </h1>
          <p className="max-w-xl text-base text-black/70">
            Molly Parton is a festival-inspired drop built for self-expression
            and sunrise stories. We are starting with a small print-on-demand
            capsule while we refine the wildest ideas.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/product/${featuredProduct.id}`}
              className="rounded-full bg-ember px-6 py-3 text-xs uppercase tracking-[0.3em] text-white shadow-glow transition hover:-translate-y-0.5"
            >
              Shop the drop
            </Link>
            <Link
              href="#drop"
              className="rounded-full border border-black/30 px-6 py-3 text-xs uppercase tracking-[0.3em] transition hover:border-black/70"
            >
              View pieces
            </Link>
          </div>
        </div>

        <div className="hero-orbit relative overflow-hidden rounded-[36px] border border-black/20 p-8 text-white shadow-2xl">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/20 bg-white/10 blur-2xl" />
          <div className="relative z-10 flex flex-col gap-6">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">
              Drop 01 / Printify trial run
            </p>
            <h2 className="font-display text-4xl uppercase">
              {featuredProduct.name}
            </h2>
            <p className="text-sm text-white/70">{featuredProduct.description}</p>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6">
              <div className="text-xs uppercase tracking-[0.25em] text-white/60">
                Placeholder art
              </div>
              <div className="mt-4 h-44 rounded-2xl border border-white/20 bg-[linear-gradient(135deg,#f04e2b_0%,#f7efe3_45%,#85a07a_100%)]" />
            </div>
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
              <span>${featuredProduct.price}</span>
              <span>Ships in 3-5 days</span>
            </div>
          </div>
        </div>
      </section>

      <section id="drop" className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-black/60">
              Drop 01
            </p>
            <h2 className="font-display text-4xl uppercase">Temporary capsule</h2>
          </div>
          <p className="max-w-sm text-sm text-black/60">
            These are placeholder pieces from Printify until the final art is
            ready. Fit, price, and quality are locked.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="grid gap-8 rounded-[32px] border border-black/10 bg-white/70 p-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.3em] text-black/60">
            How it works
          </p>
          <h3 className="font-display text-3xl uppercase">
            Print-on-demand for now
          </h3>
          <p className="text-sm text-black/70">
            We are using Printify blanks to validate sizing and demand. Once the
            visuals are locked, we will drop limited runs with original artwork.
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-black/60">
            <span className="rounded-full border border-black/20 px-3 py-1">
              No inventory risk
            </span>
            <span className="rounded-full border border-black/20 px-3 py-1">
              Ships in 3-5 days
            </span>
            <span className="rounded-full border border-black/20 px-3 py-1">
              Limited colors
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-dune/80 p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-black/60">
            The vibe check
          </div>
          <p className="text-sm text-black/70">
            Built for the people who show up dressed like a myth and dance like
            a secret. We are chasing the energy, not the trend.
          </p>
          <div className="mt-auto rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-xs uppercase tracking-[0.3em]">
            Limited drop, bigger drop soon
          </div>
        </div>
      </section>

      <footer className="flex flex-col items-center gap-3 pb-10 text-xs uppercase tracking-[0.3em] text-black/50">
        <span>Built for the wild-hearted</span>
        <span>Follow the glow</span>
      </footer>
    </main>
  );
}
