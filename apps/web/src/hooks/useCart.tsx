import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartResponse, Product, CartItem } from "@kalakart/shared";
import { api } from "../lib/api";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";


const GUEST_CART_KEY = "kalakart_guest_cart";

interface GuestCartItem {
  productId: string;
  quantity: number;
  product: Product;
}

interface CartContextValue {
  cart: CartResponse | null;
  isLoading: boolean;
  itemCount: number;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const [guestCart, setGuestCart] = useState<GuestCartItem[]>(() => {
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync guestCart with localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
    }
  }, [guestCart, user]);

  // Merge guest cart when user logs in
  useEffect(() => {
    if (user && guestCart.length > 0) {
      const mergeItems = guestCart.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      }));

      api
        .post<CartResponse>("/cart/merge", { items: mergeItems })
        .then((merged) => {
          queryClient.setQueryData(["cart"], merged);
          setGuestCart([]);
          localStorage.removeItem(GUEST_CART_KEY);
          success("Guest cart merged with your account!");
        })
        .catch(() => {
          // Keep guest cart if merge fails
        });
    }
  }, [user, queryClient, success]);

  // Server cart query (when authenticated)
  const { data: serverCart, isLoading: serverCartLoading } = useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: () => api.get<CartResponse>("/cart"),
    enabled: !!user,
  });

  // Construct guest cart response when not logged in
  const computedGuestCart: CartResponse = React.useMemo(() => {
    let subtotal_inr = 0;
    const items: CartItem[] = guestCart.map((i) => {
      subtotal_inr += Number(i.product.price_inr) * i.quantity;
      return {
        id: `guest-${i.productId}`,
        user_id: "guest",
        product_id: i.productId,
        quantity: i.quantity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product: i.product,
      };
    });

    const freeThreshold = 499;
    const flatShipping = 40;
    const shipping_inr = subtotal_inr >= freeThreshold || subtotal_inr === 0 ? 0 : flatShipping;

    return {
      items,
      subtotal_inr,
      shipping_inr,
      total_inr: subtotal_inr + shipping_inr,
      free_shipping_threshold: freeThreshold,
      amount_needed_for_free_shipping: Math.max(0, freeThreshold - subtotal_inr),
    };
  }, [guestCart]);

  const activeCart = user ? serverCart || null : computedGuestCart;

  // Server Mutations
  const updateQtyMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      api.put<CartResponse>(`/cart/items/${productId}`, { quantity }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["cart"], updated);
    },
    onError: (err: any) => {
      toastError("Failed to update quantity", err?.message);
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (productId: string) => api.delete<CartResponse>(`/cart/items/${productId}`),
    onSuccess: (updated) => {
      queryClient.setQueryData(["cart"], updated);
      success("Item removed from cart");
    },
    onError: (err: any) => {
      toastError("Failed to remove item", err?.message);
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => api.delete<CartResponse>("/cart"),
    onSuccess: (updated) => {
      queryClient.setQueryData(["cart"], updated);
    },
  });

  const addItem = useCallback(
    async (product: Product, quantity: number = 1) => {
      if (user) {
        const currentQty =
          serverCart?.items.find((i) => i.product_id === product.id)?.quantity || 0;
        const newQty = Math.min(currentQty + quantity, product.stock_qty, 20);
        await updateQtyMutation.mutateAsync({ productId: product.id, quantity: newQty });
        success(`Added "${product.title}" to cart`);
      } else {
        setGuestCart((prev) => {
          const existing = prev.find((i) => i.productId === product.id);
          if (existing) {
            const newQty = Math.min(existing.quantity + quantity, product.stock_qty, 20);
            return prev.map((i) => (i.productId === product.id ? { ...i, quantity: newQty } : i));
          }
          return [...prev, { productId: product.id, quantity, product }];
        });
        success(`Added "${product.title}" to cart`);
      }
    },
    [user, serverCart, updateQtyMutation, success]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (user) {
        await updateQtyMutation.mutateAsync({ productId, quantity });
      } else {
        setGuestCart((prev) =>
          prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
        );
      }
    },
    [user, updateQtyMutation]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (user) {
        await removeItemMutation.mutateAsync(productId);
      } else {
        setGuestCart((prev) => prev.filter((i) => i.productId !== productId));
        success("Item removed from cart");
      }
    },
    [user, removeItemMutation, success]
  );

  const clearCart = useCallback(async () => {
    if (user) {
      await clearCartMutation.mutateAsync();
    } else {
      setGuestCart([]);
      localStorage.removeItem(GUEST_CART_KEY);
    }
  }, [user, clearCartMutation]);

  const itemCount = activeCart?.items.reduce((acc, cur) => acc + cur.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart: activeCart,
        isLoading: user ? serverCartLoading : false,
        itemCount,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
