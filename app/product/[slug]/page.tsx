import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products-db";
import ProductPurchase from "@/components/product-purchase";
import CartLink from "@/components/cart-link";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-10 lg:px-10">
      <nav className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-black/70">
        <Link href="/" className="font-display text-2xl text-black">
          Molly Parton
        </Link>
        <CartLink className="rounded-full border border-black/30 px-4 py-2 text-xs tracking-[0.25em] transition hover:border-black/70" />
      </nav>

      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-[32px] border border-black/10 bg-white/80 p-6 shadow-xl">
            <div className="text-xs uppercase tracking-[0.3em] text-black/60">
              Product preview
            </div>
            <div className="relative mt-4 h-80 overflow-hidden rounded-3xl border border-black/10 bg-gray-100">
              {product.imageSrc ? (
                <Image
                  src={product.imageSrc}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-black/40">
                  No image available
                </div>
              )}
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-xl border border-black/10 bg-gray-100"
                >
                  <Image
                    src={image.src}
                    alt={`${product.title} view ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-black/60">
              {product.tags[0] ?? "Apparel"}
            </p>
            <h1 className="font-display text-5xl uppercase">{product.title}</h1>
          </div>
          {product.description && (
            <p className="text-base text-black/70">{product.description}</p>
          )}
          <ProductPurchase
            productId={product.id}
            productSlug={product.slug}
            productName={product.title}
            variants={product.variants}
          />
          <Link
            href="/shop"
            className="text-xs uppercase tracking-[0.3em] text-black/60"
          >
            Back to shop
          </Link>
        </div>
      </section>
    </main>
  );
}
