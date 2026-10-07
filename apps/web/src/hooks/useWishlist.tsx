import React, { createContext, useContext, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WishlistItem, Product } from "@kalakart/shared";
import { api } from "../lib/api";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";

interface WishlistContextValue {
  wishlist: WishlistItem[];
  isLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { success, info } = useToast();

  const { data: wishlist = [], isLoading } = useQuery<WishlistItem[]>({
    queryKey: ["wishlist"],
    queryFn: () => api.get<WishlistItem[]>("/wishlist"),
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: (productId: string) => api.put(`/wishlist/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => api.delete(`/wishlist/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.some((item) => item.product_id === productId);
    },
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (product: Product) => {
      if (!user) {
        info("Please sign in to save items to your wishlist");
        return;
      }

      if (isInWishlist(product.id)) {
        await removeMutation.mutateAsync(product.id);
        info(`Removed "${product.title}" from wishlist`);
      } else {
        await addMutation.mutateAsync(product.id);
        success(`Added "${product.title}" to wishlist`);
      }
    },
    [user, isInWishlist, addMutation, removeMutation, success, info]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}
