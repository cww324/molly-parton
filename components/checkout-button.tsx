"use client";

import { useState } from "react";

type CheckoutButtonProps = {
  productId: string;
  quantity?: number;
};

export default function CheckoutButton({
  productId,
  quantity = 1,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = (await response.json()) as { url?: string };

      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="rounded-full bg-ember px-6 py-4 text-xs uppercase tracking-[0.35em] text-white shadow-glow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
      onClick={handleCheckout}
      disabled={isLoading}
      type="button"
    >
      {isLoading ? "Loading checkout..." : "Checkout now"}
    </button>
  );
}
