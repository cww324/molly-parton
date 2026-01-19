export type Product = {
  id: string;
  name: string;
  price: number;
  tag: string;
  description: string;
  fit: string;
  colors: string;
  gradient: string;
  bullets: string[];
};

export const products: Product[] = [
  {
    id: "afterglow-tee",
    name: "Afterglow Tee",
    price: 34,
    tag: "Unisex Soft Tee",
    description:
      "A sunset-soaked staple for dancing past midnight. Soft, breathable, and ready for whatever the night throws back.",
    fit: "Relaxed unisex fit, true to size",
    colors: "Bone, Clay, Vintage Black",
    gradient: "linear-gradient(135deg, #f6b07a 0%, #f04e2b 55%, #7c2d21 100%)",
    bullets: ["100% ring-spun cotton", "Pigment-dyed for a lived-in feel", "Printed on demand"],
  },
  {
    id: "wild-heart-crop",
    name: "Wild Heart Crop",
    price: 32,
    tag: "Festival Crop",
    description:
      "A bold crop with clean lines and a fearless vibe. Pair it with high-waisted denim or a shimmer skirt.",
    fit: "Boxy crop, hits above the waist",
    colors: "Sunbleached Peach, Charcoal",
    gradient: "linear-gradient(135deg, #f3cfa3 0%, #f5a26c 50%, #c6553a 100%)",
    bullets: ["Lightweight jersey", "Double-needle finish", "No tag itch"],
  },
  {
    id: "feral-long-sleeve",
    name: "Feral Long Sleeve",
    price: 42,
    tag: "Layering Essential",
    description:
      "A long sleeve built for desert nights and coastal mornings. Easy to throw on, hard to take off.",
    fit: "Slim through the sleeves, relaxed body",
    colors: "Dust, Olive, Black",
    gradient: "linear-gradient(135deg, #688c77 0%, #1d4733 55%, #0c0b0a 100%)",
    bullets: ["Cotton blend", "Ribbed cuffs", "Ships in 3-5 days"],
  },
  {
    id: "dawn-chaser-tee",
    name: "Dawn Chaser Tee",
    price: 36,
    tag: "Heavyweight Tee",
    description:
      "The late-night-to-sunrise fit. Heavyweight, structured, and built for repeat wear.",
    fit: "Oversized with dropped shoulders",
    colors: "Vintage White, Tobacco",
    gradient: "linear-gradient(135deg, #f7efe3 0%, #f0b28a 55%, #b4502f 100%)",
    bullets: ["220 GSM cotton", "Structured collar", "Printify blank"],
  },
];

export const featuredProduct = products[0];
