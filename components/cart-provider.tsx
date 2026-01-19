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
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  addItem: (productId: string, quantity?: number) => void;
  updateItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "molly-parton-cart";

function normalizeItems(items: CartItem[]) {
  return items
    .filter((item) => item.quantity > 0)
    .map((item) => ({
      productId: item.productId,
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
    const addItem = (productId: string, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.productId === productId);
        if (!existing) {
          return [...prev, { productId, quantity }];
        }
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      });
    };

    const updateItem = (productId: string, quantity: number) => {
      if (quantity <= 0) {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    };

    const removeItem = (productId: string) => {
      setItems((prev) => prev.filter((item) => item.productId !== productId));
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
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

export type { CartItem };
