"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import VariantSelector from "@/components/variant-selector";
import type { DbProductVariant } from "@/types/product";

type ProductPurchaseProps = {
  productId: string;
  productSlug: string;
  productName: string;
  variants: DbProductVariant[];
};

export default function ProductPurchase({
  productId,
  productSlug,
  productName,
  variants,
}: ProductPurchaseProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const defaultVariant =
    variants.find((v) => v.is_default) ?? variants[0] ?? null;
  const [selectedVariant, setSelectedVariant] =
    useState<DbProductVariant | null>(defaultVariant);

  const adjustQuantity = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAdd = () => {
    if (!selectedVariant) {
      setMessage("Please select a size");
      return;
    }
    addItem(productId, selectedVariant.id, quantity);
    setMessage(`${productName} added to your bag.`);
  };

  const price = selectedVariant?.price ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 text-sm uppercase tracking-[0.3em] text-black/60">
        <span>${price.toFixed(2)}</span>
        <span>Ships in 3-5 days</span>
      </div>

      <VariantSelector
        variants={variants}
        selectedVariantId={selectedVariant?.id ?? null}
        onSelect={setSelectedVariant}
      />

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
          className="rounded-full bg-ember px-6 py-4 text-xs uppercase tracking-[0.35em] text-white shadow-glow transition hover:-translate-y-0.5 disabled:opacity-50"
          type="button"
          onClick={handleAdd}
          disabled={!selectedVariant}
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
