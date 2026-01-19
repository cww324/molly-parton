import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { products, type Product } from "@/lib/products";

type CheckoutItem = {
  productId: string;
  quantity: number;
};

type CheckoutRequest = {
  items: CheckoutItem[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as CheckoutRequest;
  const items = body.items ?? [];
  const resolved = items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product || item.quantity < 1) {
        return null;
      }
      return { product, quantity: item.quantity };
    })
    .filter(
      (item): item is { product: Product; quantity: number } => Boolean(item)
    );

  if (resolved.length === 0 || resolved.length !== items.length) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: resolved.map(({ product, quantity }) => ({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.name,
          description: product.description,
        },
      },
      quantity,
    })),
    metadata: {
      items: JSON.stringify(
        resolved.map(({ product, quantity }) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
        }))
      ),
    },
    success_url: `${baseUrl}/checkout/confirmation`,
    cancel_url: `${baseUrl}/cart`,
  });

  return NextResponse.json({ url: session.url });
}
