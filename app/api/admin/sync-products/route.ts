import { NextResponse } from "next/server";
import { getProducts as getPrintifyProducts } from "@/lib/printify";
import { upsertProducts } from "@/lib/products-db";
import type { DbProductInsert, DbProductImage, DbProductVariant } from "@/types/product";
import type { PrintifyProduct } from "@/lib/printify";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function transformProduct(product: PrintifyProduct): DbProductInsert {
  const images: DbProductImage[] = product.images.map((img) => ({
    src: img.src,
    position: img.position,
    is_default: img.is_default,
    variant_ids: img.variant_ids,
  }));

  const variants: DbProductVariant[] = product.variants
    .filter((v) => v.is_enabled)
    .map((v) => ({
      id: v.id,
      title: v.title,
      price: v.price / 100, // Printify prices are in cents
      sku: v.sku,
      is_enabled: v.is_enabled,
      is_available: v.is_available,
      is_default: v.is_default,
    }));

  return {
    printify_id: product.id,
    slug: slugify(product.title),
    title: product.title,
    description: product.description || null,
    tags: product.tags,
    images,
    variants,
    active: product.visible,
  };
}

export async function POST() {
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!shopId) {
    return NextResponse.json(
      { error: "PRINTIFY_SHOP_ID is not configured" },
      { status: 500 }
    );
  }

  try {
    const printifyProducts = await getPrintifyProducts(shopId);
    const dbProducts = printifyProducts.map(transformProduct);

    await upsertProducts(dbProducts);

    return NextResponse.json({
      message: `Synced ${dbProducts.length} products`,
      count: dbProducts.length,
      products: dbProducts.map((p) => ({ slug: p.slug, title: p.title })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
