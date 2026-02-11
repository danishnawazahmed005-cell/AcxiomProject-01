'use client';

import { create } from 'zustand';

export interface CartItem {
  productId: number;
  vendorId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item: CartItem) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.productId === item.productId);

      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }

      return { items: [...state.items, item] };
    });
  },

  removeItem: (productId: number) => {
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    }));
  },

  updateQuantity: (productId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    const state = get();
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    const state = get();
    return state.items.reduce((count, item) => count + item.quantity, 0);
  },
}));
