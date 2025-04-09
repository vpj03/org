import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';

interface CartItem {
  id: number;
  productId: number;
  cartId: number;
  quantity: number;
  product?: {
    id: number;
    name: string;
    price: number;
    discountPrice?: number;
    image: string;
    stock: number;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  cartCount: number;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery<CartItem[]>({
    queryKey: user ? ['/api/cart/items'] : [],
    enabled: !!user,
  });

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        cartCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
        addToCart: async (productId: number, quantity = 1) => { /* implement API call */ },
        removeFromCart: async (cartItemId: number) => { /* implement API call */ },
        updateQuantity: async (cartItemId: number, quantity: number) => { /* implement API call */ },
        clearCart: async () => { /* implement API call */ },
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