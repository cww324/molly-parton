import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import Script from "next/script";
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="grain">
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        ) : null}
        <CartProvider>
          <div className="min-h-screen">{children}</div>
        </CartProvider>
      </body>
    </html>
  );
}
