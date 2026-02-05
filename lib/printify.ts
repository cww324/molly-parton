const PRINTIFY_API_URL = "https://api.printify.com/v1";

const apiKey = process.env.PRINTIFY_API_KEY;

async function printifyFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!apiKey) {
    throw new Error("PRINTIFY_API_KEY is not configured");
  }

  const url = `${PRINTIFY_API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Printify API error (${response.status}): ${text}`);
  }

  return response.json() as Promise<T>;
}

export type PrintifyShop = {
  id: number;
  title: string;
  sales_channel: string;
};

export type PrintifyImage = {
  src: string;
  variant_ids: number[];
  position: string;
  is_default: boolean;
};

export type PrintifyVariant = {
  id: number;
  sku: string;
  cost: number;
  price: number;
  title: string;
  grams: number;
  is_enabled: boolean;
  is_default: boolean;
  is_available: boolean;
  options: number[];
};

export type PrintifyProduct = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  options: Array<{
    name: string;
    type: string;
    values: Array<{ id: number; title: string }>;
  }>;
  variants: PrintifyVariant[];
  images: PrintifyImage[];
  created_at: string;
  updated_at: string;
  visible: boolean;
  is_locked: boolean;
  blueprint_id: number;
  user_id: number;
  shop_id: number;
  print_provider_id: number;
  print_areas: unknown[];
  sales_channel_properties: unknown[];
};

export type PrintifyProductsResponse = {
  current_page: number;
  data: PrintifyProduct[];
  last_page: number;
  total: number;
};

export type PrintifyOrderLineItem = {
  product_id: string;
  variant_id: number;
  quantity: number;
};

export type PrintifyOrderAddress = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  region: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
};

export type PrintifyOrderCreate = {
  external_id: string;
  line_items: PrintifyOrderLineItem[];
  shipping_method: number;
  send_shipping_notification: boolean;
  address_to: PrintifyOrderAddress;
  is_printify_express?: boolean;
  is_economy_shipping?: boolean;
};

export type PrintifyOrderResponse = {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export async function getShops(): Promise<PrintifyShop[]> {
  return printifyFetch<PrintifyShop[]>("/shops.json");
}

export async function getProducts(shopId: string): Promise<PrintifyProduct[]> {
  const allProducts: PrintifyProduct[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await printifyFetch<PrintifyProductsResponse>(
      `/shops/${shopId}/products.json?page=${page}`
    );
    allProducts.push(...response.data);
    hasMore = page < response.last_page;
    page++;
  }

  return allProducts;
}

export async function getProduct(
  shopId: string,
  productId: string
): Promise<PrintifyProduct> {
  return printifyFetch<PrintifyProduct>(
    `/shops/${shopId}/products/${productId}.json`
  );
}

export async function createOrder(
  shopId: string,
  payload: PrintifyOrderCreate
): Promise<PrintifyOrderResponse> {
  return printifyFetch<PrintifyOrderResponse>(
    `/shops/${shopId}/orders.json`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function sendOrderToProduction(
  shopId: string,
  orderId: string
): Promise<void> {
  await printifyFetch(`/shops/${shopId}/orders/${orderId}/send_to_production.json`, {
    method: "POST",
  });
}
