import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { products } from "@/lib/products";

type CheckoutRequest = {
  productId: string;
  quantity: number;
};

export async function POST(request: Request) {
  const body = (await request.json()) as CheckoutRequest;
  const product = products.find((item) => item.id === body.productId);

  if (!product || body.quantity < 1) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: product.name,
            description: product.description,
          },
        },
        quantity: body.quantity,
      },
    ],
    metadata: {
      items: JSON.stringify([
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: body.quantity,
        },
      ]),
    },
    client_reference_id: product.id,
    success_url: `${baseUrl}/?success=1`,
    cancel_url: `${baseUrl}/product/${product.id}`,
  });

  return NextResponse.json({ url: session.url });
}
