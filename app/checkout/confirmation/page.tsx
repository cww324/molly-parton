"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/cart-provider";

export default function CheckoutConfirmationPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-10 lg:px-10">
      <nav className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-black/70">
        <Link href="/" className="font-display text-2xl text-black">
          Molly Parton
        </Link>
        <span>Order Confirmed</span>
      </nav>

      <section className="rounded-[32px] border border-black/10 bg-white/80 p-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-black/60">
          Thanks for the order
        </p>
        <h1 className="mt-4 font-display text-4xl uppercase">
          You are officially on the list
        </h1>
        <p className="mt-4 text-sm text-black/70">
          Your Drop 01 pieces are queued for print. We will send a confirmation
          email with tracking once they ship.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-ember px-6 py-3 text-xs uppercase tracking-[0.3em] text-white shadow-glow"
        >
          Back to the drop
        </Link>
      </section>
    </main>
  );
}
