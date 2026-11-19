'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, flavor?: string) => void;
  removeItem: (itemId: string, productName?: string) => void;
  updateQuantity: (itemId: string, newQty: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string, flavor?: string) => number;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage only on client after mount (avoids hydration mismatch)
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem('binary_bite_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('binary_bite_cart', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to storage', e);
      }
    }
  }, [items, isMounted]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addItem = (product: Product, flavor?: string) => {
    const itemId = flavor ? `${product.id}-${flavor}` : product.id;
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { id: itemId, product, quantity: 1, selectedFlavor: flavor }];
    });
    addToast(`${product.name}${flavor ? ` (${flavor})` : ''} berhasil ditambahkan ke keranjang!`, 'success');
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeItem = (itemId: string, productName?: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    addToast(productName ? `${productName} dihapus dari keranjang.` : 'Item telah dihapus dari keranjang.', 'info');
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (productId: string, flavor?: string): number => {
    const itemId = flavor ? `${productId}-${flavor}` : productId;
    const found = items.find((i) => i.id === itemId);
    return found ? found.quantity : 0;
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

