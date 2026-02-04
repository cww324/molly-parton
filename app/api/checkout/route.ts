import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getProductById } from "@/lib/products-db";
import type { Product } from "@/types/product";

type CheckoutItem = {
  productId: string;
  variantId: number;
  quantity: number;
};

type CheckoutRequest = {
  items: CheckoutItem[];
};

type ResolvedItem = {
  product: Product;
  variantId: number;
  variantTitle: string;
  price: number;
  quantity: number;
};

export async function POST(request: Request) {
  const body = (await request.json()) as CheckoutRequest;
  const items = body.items ?? [];

  // Resolve all products and variants
  const resolved: ResolvedItem[] = [];
  for (const item of items) {
    if (item.quantity < 1) continue;

    const product = await getProductById(item.productId);
    if (!product) continue;

    const variant = product.variants.find((v) => v.id === item.variantId);
    if (!variant) continue;

    resolved.push({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: item.quantity,
    });
  }

  if (resolved.length === 0 || resolved.length !== items.length) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: resolved.map(({ product, variantTitle, price, quantity }) => ({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(price * 100),
        product_data: {
          name: product.title,
          description: variantTitle,
          images: product.imageSrc ? [product.imageSrc] : undefined,
        },
      },
      quantity,
    })),
    metadata: {
      items: JSON.stringify(
        resolved.map(({ product, variantId, variantTitle, price, quantity }) => ({
          id: product.id,
          name: product.title,
          variantId,
          variantTitle,
          price,
          quantity,
        }))
      ),
    },
    success_url: `${baseUrl}/checkout/confirmation`,
    cancel_url: `${baseUrl}/cart`,
  });

  return NextResponse.json({ url: session.url });
}
