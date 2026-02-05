"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CartItem = {
  productId: string;
  variantId: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  addItem: (productId: string, variantId: number, quantity?: number) => void;
  updateItem: (productId: string, variantId: number, quantity: number) => void;
  removeItem: (productId: string, variantId: number) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "molly-parton-cart";

// Default value for SSR - provides safe no-op functions
const defaultCartValue: CartContextValue = {
  items: [],
  totalQuantity: 0,
  addItem: () => {},
  updateItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
};

const CartContext = createContext<CartContextValue>(defaultCartValue);

function normalizeItems(items: CartItem[]) {
  return items
    .filter((item) => item.quantity > 0 && item.variantId)
    .map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: Math.max(1, Math.floor(item.quantity)),
    }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        setItems(normalizeItems(parsed));
      }
    } catch (error) {
      console.warn("Failed to load cart", error);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(normalizeItems(items))
      );
    } catch (error) {
      console.warn("Failed to save cart", error);
    }
  }, [items, hasLoaded]);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (productId: string, variantId: number, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find(
          (item) => item.productId === productId && item.variantId === variantId
        );
        if (!existing) {
          return [...prev, { productId, variantId, quantity }];
        }
        return prev.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      });
    };

    const updateItem = (
      productId: string,
      variantId: number,
      quantity: number
    ) => {
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter(
            (item) =>
              !(item.productId === productId && item.variantId === variantId)
          )
        );
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity }
            : item
        )
      );
    };

    const removeItem = (productId: string, variantId: number) => {
      setItems((prev) =>
        prev.filter(
          (item) =>
            !(item.productId === productId && item.variantId === variantId)
        )
      );
    };

    const clearCart = () => {
      setItems([]);
    };

    const totalQuantity = items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    return { items, totalQuantity, addItem, updateItem, removeItem, clearCart };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

export type { CartItem };
