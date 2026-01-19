"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

type CartLinkProps = {
  className?: string;
};

export default function CartLink({ className }: CartLinkProps) {
  const { totalQuantity } = useCart();
  const countLabel = totalQuantity === 1 ? "1 item" : `${totalQuantity} items`;
  const label = totalQuantity > 0 ? `Cart - ${countLabel}` : "Cart";

  return (
    <Link href="/cart" className={className}>
      {label}
    </Link>
  );
}
