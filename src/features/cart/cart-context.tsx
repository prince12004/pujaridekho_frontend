"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  productSlug: string;
  name: string;
  price: number;
  marketPrice?: number;
  image?: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productSlug: string) => void;
  updateQuantity: (productSlug: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clear: () => {},
  count: 0,
  subtotal: 0,
});

const STORAGE_KEY = "pujaridekho_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // Corrupt/unavailable localStorage — start with an empty cart.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem: CartContextValue["addItem"] = (item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productSlug === item.productSlug);
      if (existing) {
        return prev.map((i) => (i.productSlug === item.productSlug ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeItem = (productSlug: string) => {
    setItems((prev) => prev.filter((i) => i.productSlug !== productSlug));
  };

  const updateQuantity = (productSlug: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productSlug);
      return;
    }
    setItems((prev) => prev.map((i) => (i.productSlug === productSlug ? { ...i, quantity } : i)));
  };

  const clear = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
