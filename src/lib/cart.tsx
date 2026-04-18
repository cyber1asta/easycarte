import React, { createContext, useContext, useState, useCallback } from "react";

export interface CardConfig {
  id: string;
  name: string;
  jobTitle: string;
  phone: string;
  email: string;
  company: string;
  website: string;
  template: "minimal" | "corporate" | "luxury";
  primaryColor: string;
  quantity: number;
  unitPrice: number;
}

interface CartContextType {
  items: CardConfig[];
  addItem: (item: CardConfig) => void;
  removeItem: (id: string) => void;
  total: number;
  count: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [], addItem: () => {}, removeItem: () => {}, total: 0, count: 0, clearCart: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CardConfig[]>([]);

  const addItem = useCallback((item: CardConfig) => {
    setItems(prev => [...prev, item]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const count = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, total, count, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
