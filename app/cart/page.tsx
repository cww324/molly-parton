"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/lib/format";
import CartCheckoutButton from "@/components/cart-checkout-button";
import CartLink from "@/components/cart-link";
import { useCart, type CartItem } from "@/components/cart-provider";
import type { Product } from "@/types/product";

type CartProduct = {
  item: CartItem;
  product: Product;
  variantTitle: string;
  price: number;
};

export default function CartPage() {
  const { items, updateItem, removeItem } = useCart();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [products, setProducts] = useState<Map<string, Product>>(new Map());
  const [loading, setLoading] = useState(true);

  // Fetch products for cart items
  useEffect(() => {
    const productIds = [...new Set(items.map((item) => item.productId))];
    if (productIds.length === 0) {
      setLoading(false);
      return;
    }

    async function fetchProducts() {
      try {
        const productMap = new Map<string, Product>();
        for (const productId of productIds) {
          const response = await fetch(`/api/products/${productId}`);
          if (response.ok) {
            const product = (await response.json()) as Product;
            productMap.set(productId, product);
          }
        }
        setProducts(productMap);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [items]);

  const cartProducts = useMemo<CartProduct[]>(() => {
    return items
      .map((item) => {
        const product = products.get(item.productId);
        if (!product) return null;

        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) return null;

        return {
          item,
          product,
          variantTitle: variant.title,
          price: variant.price,
        };
      })
      .filter((entry): entry is CartProduct => entry !== null);
  }, [items, products]);

  const subtotal = cartProducts.reduce(
    (total, entry) => total + entry.price * entry.item.quantity,
    0
  );

  if (loading && items.length > 0) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10 lg:px-10">
        <nav className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-black/70">
          <Link href="/" className="font-display text-2xl text-black">
            Molly Parton
          </Link>
          <CartLink className="text-sm uppercase tracking-[0.3em] text-black/70" />
        </nav>
        <div className="flex items-center justify-center py-20 text-sm text-black/50">
          Loading cart...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10 lg:px-10">
      <nav className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-black/70">
        <Link href="/" className="font-display text-2xl text-black">
          Molly Parton
        </Link>
        <CartLink className="text-sm uppercase tracking-[0.3em] text-black/70" />
      </nav>

      {cartProducts.length === 0 ? (
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
              href="/shop"
              className="mx-auto rounded-full bg-ember px-6 py-3 text-xs uppercase tracking-[0.3em] text-white shadow-glow"
            >
              Browse the drop
            </Link>
          </div>
        </section>
      ) : (
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-6">
            {cartProducts.map(({ item, product, variantTitle, price }) => (
              <div
                key={`${item.productId}:${item.variantId}`}
                className="flex gap-4 rounded-[28px] border border-black/10 bg-white/80 p-6"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-gray-100">
                  {product.imageSrc ? (
                    <Image
                      src={product.imageSrc}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-black/30">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-xl uppercase">
                        {product.title}
                      </h2>
                      <p className="text-xs uppercase tracking-[0.2em] text-black/60">
                        {variantTitle}
                      </p>
                    </div>
                    <div className="text-sm uppercase tracking-[0.3em] text-black/70">
                      {formatCurrency(price)}
                    </div>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center rounded-full border border-black/20 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em]">
                      <button
                        className="px-2 text-black/60 transition hover:text-black"
                        type="button"
                        onClick={() =>
                          updateItem(
                            item.productId,
                            item.variantId,
                            item.quantity - 1
                          )
                        }
                        aria-label={`Decrease ${product.title} quantity`}
                      >
                        -
                      </button>
                      <span className="px-3 text-black">{item.quantity}</span>
                      <button
                        className="px-2 text-black/60 transition hover:text-black"
                        type="button"
                        onClick={() =>
                          updateItem(
                            item.productId,
                            item.variantId,
                            item.quantity + 1
                          )
                        }
                        aria-label={`Increase ${product.title} quantity`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="text-xs uppercase tracking-[0.3em] text-black/50 transition hover:text-black"
                      type="button"
                      onClick={() => removeItem(item.productId, item.variantId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
              href="/shop"
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
