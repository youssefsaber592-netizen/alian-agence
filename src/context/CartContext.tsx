"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine } from "@/lib/types";

const STORAGE_KEY = "alian:cart";

type CartValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  lastAdded: string | null;
  open: () => void;
  close: () => void;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartValue | null>(null);

function readStoredCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line): line is CartLine =>
        typeof line?.slug === "string" && typeof line?.price === "number",
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  /* restore the persisted cart after mount (keeps SSR markup identical) */
  useEffect(() => {
    setLines(readStoredCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable — cart stays in memory */
    }
  }, [lines, hydrated]);

  const add = useCallback(
    (line: Omit<CartLine, "quantity">, quantity = 1) => {
      setLines((current) => {
        const existing = current.find((item) => item.slug === line.slug);
        if (existing) {
          return current.map((item) =>
            item.slug === line.slug
              ? {
                  ...item,
                  quantity: Math.min(item.quantity + quantity, item.stock || 99),
                }
              : item,
          );
        }
        return [
          ...current,
          { ...line, quantity: Math.min(quantity, line.stock || 99) },
        ];
      });
      setLastAdded(line.slug);
      setIsOpen(true);
    },
    [],
  );

  const remove = useCallback((slug: string) => {
    setLines((current) => current.filter((item) => item.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setLines((current) =>
      current.flatMap((item) => {
        if (item.slug !== slug) return [item];
        const next = Math.max(0, Math.min(quantity, item.stock || 99));
        return next === 0 ? [] : [{ ...item, quantity: next }];
      }),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = lines.reduce(
      (sum, line) => sum + line.price * line.quantity,
      0,
    );

    return {
      lines,
      count,
      subtotal,
      isOpen,
      lastAdded,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      remove,
      setQuantity,
      clear,
    };
  }, [lines, isOpen, lastAdded, add, remove, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
