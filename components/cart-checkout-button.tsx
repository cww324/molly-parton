"use client";

import { useState } from "react";
import type { CartItem } from "@/components/cart-provider";

const checkoutLabel = {
  idle: "Checkout",
  loading: "Loading checkout...",
};

type CartCheckoutButtonProps = {
  items: CartItem[];
  disabled?: boolean;
  onError?: (message: string) => void;
};

export default function CartCheckoutButton({
  items,
  disabled,
  onError,
}: CartCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Checkout failed");
      }

      const data = (await response.json()) as { url?: string };

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("Missing checkout URL");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Checkout failed";
      console.error(error);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = disabled || items.length === 0 || isLoading;

  return (
    <button
      className="rounded-full bg-ember px-6 py-4 text-xs uppercase tracking-[0.35em] text-white shadow-glow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
      onClick={handleCheckout}
      disabled={isDisabled}
      type="button"
    >
      {isLoading ? checkoutLabel.loading : checkoutLabel.idle}
    </button>
  );
}
