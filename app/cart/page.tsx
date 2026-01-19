"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { products } from "@/lib/products";
import { formatCurrency } from "@/lib/format";
import CartCheckoutButton from "@/components/cart-checkout-button";
import CartLink from "@/components/cart-link";
import { useCart } from "@/components/cart-provider";

const productLookup = new Map(products.map((product) => [product.id, product]));

export default function CartPage() {
  const { items, updateItem, removeItem } = useCart();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cartItems = useMemo(
    () =>
      items
        .map((item) => ({
          item,
          product: productLookup.get(item.productId),
        }))
        .filter((entry) => Boolean(entry.product)),
    [items]
  );

  const subtotal = cartItems.reduce((total, entry) => {
    if (!entry.product) {
      return total;
    }
    return total + entry.product.price * entry.item.quantity;
  }, 0);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10 lg:px-10">
      <nav className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-black/70">
        <Link href="/" className="font-display text-2xl text-black">
          Molly Parton
        </Link>
        <CartLink className="text-sm uppercase tracking-[0.3em] text-black/70" />
      </nav>

      {cartItems.length === 0 ? (
        <section className="rounded-[32px] border border-black/10 bg-white/80 p-8">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-black/60">
              Your bag is empty
            </p>
            <h1 className="font-display text-4xl uppercase">
              Drop 01 is calling
            </h1>
            <p className="text-sm text-black/70">
              Add a piece from Drop 01 and we will hold it here while you build
              your festival-ready kit.
            </p>
            <Link
              href="/"
              className="mx-auto rounded-full bg-ember px-6 py-3 text-xs uppercase tracking-[0.3em] text-white shadow-glow"
            >
              Browse the drop
            </Link>
          </div>
        </section>
      ) : (
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-6">
            {cartItems.map(({ item, product }) => {
              if (!product) {
                return null;
              }
              return (
                <div
                  key={item.productId}
                  className="flex flex-col gap-4 rounded-[28px] border border-black/10 bg-white/80 p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-black/60">
                        {product.tag}
                      </p>
                      <h2 className="font-display text-2xl uppercase">
                        {product.name}
                      </h2>
                    </div>
                    <div className="text-sm uppercase tracking-[0.3em] text-black/70">
                      {formatCurrency(product.price)}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center rounded-full border border-black/20 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em]">
                      <button
                        className="px-2 text-black/60 transition hover:text-black"
                        type="button"
                        onClick={() =>
                          updateItem(item.productId, item.quantity - 1)
                        }
                        aria-label={`Decrease ${product.name} quantity`}
                      >
                        -
                      </button>
                      <span className="px-3 text-black">{item.quantity}</span>
                      <button
                        className="px-2 text-black/60 transition hover:text-black"
                        type="button"
                        onClick={() =>
                          updateItem(item.productId, item.quantity + 1)
                        }
                        aria-label={`Increase ${product.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="text-xs uppercase tracking-[0.3em] text-black/50 transition hover:text-black"
                      type="button"
                      onClick={() => removeItem(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="flex h-fit flex-col gap-6 rounded-[28px] border border-black/10 bg-white/80 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-black/60">
                Order summary
              </p>
              <div className="mt-4 flex items-center justify-between text-sm uppercase tracking-[0.3em] text-black/70">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-black/50">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            {errorMessage ? (
              <p className="rounded-2xl border border-ember/20 bg-ember/10 px-4 py-3 text-xs uppercase tracking-[0.25em] text-ember">
                {errorMessage}
              </p>
            ) : null}

            <CartCheckoutButton
              items={items}
              onError={(message) => setErrorMessage(message)}
            />

            <Link
              href="/"
              className="text-center text-xs uppercase tracking-[0.3em] text-black/50"
            >
              Continue shopping
            </Link>
          </aside>
        </section>
      )}
    </main>
  );
}
