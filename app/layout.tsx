import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import "./globals.css";

const display = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Space_Grotesk({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Molly Parton | Festivalwear for the Feral",
  description:
    "Festival-inspired clothing celebrating self-expression, freedom, and the feral joy of letting go.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="grain">
        <CartProvider>
          <div className="min-h-screen">{children}</div>
        </CartProvider>
      </body>
    </html>
  );
}
