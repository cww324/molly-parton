import type Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabase";
import {
  createOrder,
  sendOrderToProduction,
  type PrintifyOrderAddress,
} from "@/lib/printify";
import { getDbProductById } from "@/lib/products-db";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

type CheckoutItem = {
  id: string;
  variantId: number;
  quantity: number;
  name?: string;
  price?: number;
  variantTitle?: string;
};

function splitName(fullName: string | null | undefined): {
  first: string;
  last: string;
} {
  const safeName = (fullName ?? "").trim();
  if (!safeName) {
    return { first: "Customer", last: "Order" };
  }

  const parts = safeName.split(/\s+/);
  if (parts.length === 1) {
    return { first: parts[0], last: "Customer" };
  }

  return {
    first: parts[0],
    last: parts.slice(1).join(" "),
  };
}

function toPrintifyAddress(
  session: Stripe.Checkout.Session
): PrintifyOrderAddress | null {
  const address =
    session.shipping_details?.address ?? session.customer_details?.address;
  const name = session.shipping_details?.name ?? session.customer_details?.name;
  const email = session.customer_details?.email ?? session.customer_email ?? "";
  const phone = session.customer_details?.phone ?? undefined;

  if (
    !address ||
    !address.line1 ||
    !address.city ||
    !address.postal_code ||
    !address.country ||
    !email
  ) {
    return null;
  }

  const { first, last } = splitName(name);

  return {
    first_name: first,
    last_name: last,
    email,
    phone,
    country: address.country,
    region: address.state ?? "",
    address1: address.line1,
    address2: address.line2 ?? undefined,
    city: address.city,
    zip: address.postal_code,
  };
}

export async function POST(request: Request) {
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const total = session.amount_total ? session.amount_total / 100 : 0;
    const itemsRaw = session.metadata?.items ?? "[]";
    const items: CheckoutItem[] =
      typeof itemsRaw === "string" ? JSON.parse(itemsRaw) : itemsRaw;

    const customerEmail =
      session.customer_details?.email ?? session.customer_email ?? null;
    const shippingDetails =
      session.shipping_details ?? session.customer_details ?? null;

    const { error: upsertError } = await supabaseServer.from("orders").upsert(
      {
        stripe_session_id: session.id,
        customer_email: customerEmail ?? "unknown",
        shipping_address: shippingDetails ?? {},
        items,
        total,
        status: "paid",
      },
      { onConflict: "stripe_session_id" }
    );

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    const shopId = process.env.PRINTIFY_SHOP_ID;
    if (!shopId) {
      return NextResponse.json(
        { error: "Missing PRINTIFY_SHOP_ID" },
        { status: 500 }
      );
    }

    const addressTo = toPrintifyAddress(session);
    if (!addressTo) {
      await supabaseServer
        .from("orders")
        .update({ status: "needs_shipping" })
        .eq("stripe_session_id", session.id);

      return NextResponse.json(
        { received: true, warning: "Missing shipping address" },
        { status: 200 }
      );
    }

    const lineItems = [];
    for (const item of items) {
      if (!item?.id || !item.variantId || item.quantity < 1) {
        continue;
      }

      const dbProduct = await getDbProductById(item.id);
      if (!dbProduct) {
        await supabaseServer
          .from("orders")
          .update({ status: "missing_product" })
          .eq("stripe_session_id", session.id);

        return NextResponse.json(
          { error: `Missing product ${item.id}` },
          { status: 500 }
        );
      }

      lineItems.push({
        product_id: dbProduct.printify_id,
        variant_id: item.variantId,
        quantity: item.quantity,
      });
    }

    if (lineItems.length === 0) {
      await supabaseServer
        .from("orders")
        .update({ status: "missing_items" })
        .eq("stripe_session_id", session.id);

      return NextResponse.json(
        { error: "No valid line items" },
        { status: 500 }
      );
    }

    try {
      const printifyOrder = await createOrder(shopId, {
        external_id: session.id,
        line_items: lineItems,
        shipping_method: 1,
        send_shipping_notification: true,
        address_to: addressTo,
        is_printify_express: false,
        is_economy_shipping: false,
      });

      await sendOrderToProduction(shopId, printifyOrder.id);

      await supabaseServer
        .from("orders")
        .update({
          printify_order_id: printifyOrder.id,
          status: "sent_to_production",
        })
        .eq("stripe_session_id", session.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Printify error";
      await supabaseServer
        .from("orders")
        .update({ status: "printify_error" })
        .eq("stripe_session_id", session.id);

      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
