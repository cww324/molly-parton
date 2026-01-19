import Link from "next/link";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white/70 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-glow"
    >
      <div
        className="h-48 w-full rounded-2xl border border-black/10"
        style={{ background: product.gradient }}
      />
      <div className="mt-6 flex flex-1 flex-col gap-3">
        <div className="text-xs uppercase tracking-[0.2em] text-black/60">
          {product.tag}
        </div>
        <h3 className="font-display text-3xl uppercase tracking-wide">
          {product.name}
        </h3>
        <p className="text-sm text-black/70">{product.description}</p>
        <div className="mt-auto flex items-center justify-between text-sm">
          <span className="font-semibold">${product.price}</span>
          <span className="text-black/60">View drop</span>
        </div>
      </div>
      <div className="pointer-events-none absolute right-6 top-6 rounded-full border border-black/20 bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.25em]">
        New
      </div>
    </Link>
  );
}
