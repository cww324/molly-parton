"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

type ProductPurchaseProps = {
  productId: string;
  productName: string;
};

export default function ProductPurchase({
  productId,
  productName,
}: ProductPurchaseProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const adjustQuantity = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAdd = () => {
    addItem(productId, quantity);
    setMessage(`${productName} added to your bag.`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full border border-black/20 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em]">
          <button
            className="px-2 text-black/60 transition hover:text-black"
            type="button"
            onClick={() => adjustQuantity(-1)}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="px-3 text-black">{quantity}</span>
          <button
            className="px-2 text-black/60 transition hover:text-black"
            type="button"
            onClick={() => adjustQuantity(1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          className="rounded-full bg-ember px-6 py-4 text-xs uppercase tracking-[0.35em] text-white shadow-glow transition hover:-translate-y-0.5"
          type="button"
          onClick={handleAdd}
        >
          Add to bag
        </button>
      </div>
      {message ? (
        <p className="text-xs uppercase tracking-[0.25em] text-black/50">
          {message}
        </p>
      ) : null}
    </div>
  );
}
