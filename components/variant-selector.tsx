"use client";

import type { DbProductVariant } from "@/types/product";

type VariantSelectorProps = {
  variants: DbProductVariant[];
  selectedVariantId: number | null;
  onSelect: (variant: DbProductVariant) => void;
};

export default function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps) {
  if (variants.length <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="variant-select"
        className="text-xs uppercase tracking-[0.3em] text-black/60"
      >
        Size
      </label>
      <select
        id="variant-select"
        value={selectedVariantId ?? ""}
        onChange={(e) => {
          const variant = variants.find((v) => v.id === Number(e.target.value));
          if (variant) {
            onSelect(variant);
          }
        }}
        className="rounded-full border border-black/20 bg-white/70 px-4 py-3 text-sm uppercase tracking-[0.2em] text-black/80 outline-none transition focus:border-black/50"
      >
        {variants.map((variant) => (
          <option key={variant.id} value={variant.id}>
            {variant.title} - ${variant.price.toFixed(2)}
          </option>
        ))}
      </select>
    </div>
  );
}
