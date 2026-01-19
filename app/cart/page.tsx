import Link from "next/link";

export default function CartPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10 lg:px-10">
      <nav className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-black/70">
        <Link href="/" className="font-display text-2xl text-black">
          Molly Parton
        </Link>
        <span>Cart</span>
      </nav>

      <section className="rounded-[32px] border border-black/10 bg-white/80 p-8">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-black/60">
            Placeholder cart
          </p>
          <h1 className="font-display text-4xl uppercase">Your bag is empty</h1>
          <p className="text-sm text-black/70">
            Add a piece from Drop 01 and we will hold it here. Checkout goes
            live once the catalog is final.
          </p>
          <Link
            href="/"
            className="mx-auto rounded-full bg-ember px-6 py-3 text-xs uppercase tracking-[0.3em] text-white shadow-glow"
          >
            Browse the drop
          </Link>
        </div>
      </section>
    </main>
  );
}
