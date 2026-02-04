import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white/70 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-black/10 bg-gray-100">
        {product.imageSrc ? (
          <Image
            src={product.imageSrc}
            alt={product.title}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-black/40">
            No image
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-1 flex-col gap-3">
        <div className="text-xs uppercase tracking-[0.2em] text-black/60">
          {product.tags[0] ?? "Apparel"}
        </div>
        <h3 className="font-display text-3xl uppercase tracking-wide">
          {product.title}
        </h3>
        <p className="line-clamp-2 text-sm text-black/70">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between text-sm">
          <span className="font-semibold">${product.price.toFixed(2)}</span>
          <span className="text-black/60">View drop</span>
        </div>
      </div>
      <div className="pointer-events-none absolute right-6 top-6 rounded-full border border-black/20 bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.25em]">
        New
      </div>
    </Link>
  );
}
