// Database product schema
export type DbProduct = {
  id: string;
  printify_id: string;
  slug: string;
  title: string;
  description: string | null;
  tags: string[];
  images: DbProductImage[];
  variants: DbProductVariant[];
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type DbProductImage = {
  src: string;
  position: string;
  is_default: boolean;
  variant_ids: number[];
};

export type DbProductVariant = {
  id: number;
  title: string;
  price: number;
  sku: string;
  is_enabled: boolean;
  is_available: boolean;
  is_default: boolean;
};

// For inserting/updating products in the database
export type DbProductInsert = Omit<DbProduct, "id" | "created_at" | "updated_at">;

// Simplified product for frontend display
export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  tags: string[];
  images: DbProductImage[];
  variants: DbProductVariant[];
  // Computed from first enabled variant
  price: number;
  // First default image src
  imageSrc: string | null;
};

// Helper to transform DB product to frontend Product
export function toProduct(dbProduct: DbProduct): Product {
  const enabledVariants = dbProduct.variants.filter((v) => v.is_enabled);
  const defaultVariant =
    enabledVariants.find((v) => v.is_default) ?? enabledVariants[0];
  const defaultImage =
    dbProduct.images.find((img) => img.is_default) ?? dbProduct.images[0];

  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    title: dbProduct.title,
    description: dbProduct.description,
    tags: dbProduct.tags,
    images: dbProduct.images,
    variants: enabledVariants,
    price: defaultVariant?.price ?? 0,
    imageSrc: defaultImage?.src ?? null,
  };
}
