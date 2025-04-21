'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Book } from './schema';

export type CartItem = {
  id: number;
  bookId: number;
  quantity: number;
  book: Book;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (book: Book, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotal: () => number;
  getCount: () => number;
};

let nextId = 1;

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (book: Book, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.bookId === book.id);
        
        if (existingItem) {
          set({
            items: items.map(item => 
              item.bookId === book.id 
                ? { ...item, quantity: item.quantity + quantity } 
                : item
            )
          });
        } else {
          set({
            items: [...items, { 
              id: nextId++, 
              bookId: book.id, 
              quantity, 
              book 
            }]
          });
        }
      },
      
      removeItem: (id: number) => {
        const { items } = get();
        set({ items: items.filter(item => item.id !== id) });
      },
      
      updateQuantity: (id: number, quantity: number) => {
        const { items } = get();
        set({
          items: items.map(item => 
            item.id === id 
              ? { ...item, quantity } 
              : item
          )
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
      
      getTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + parseFloat(item.book.price) * item.quantity, 
          0
        );
      },
      
      getCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);