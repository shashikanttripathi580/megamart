import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product, ProductVariant, CartItem } from '@/types/store';
import { PRICING_CONFIG } from '@/constants/pricing';

export interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  mrpTotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  freeDeliveryThreshold: number;
  amountToFreeDelivery: number;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => { success: boolean; message?: string };
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  getItemQuantity: (productId: string, variantSku?: string) => number;
  refreshCartItems: (serverItems: { productId: string; variantSku?: string; price: number; mrp: number; stock: number }[]) => void;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = 'megamart_guest_cart_v1';
const FREE_DELIVERY_THRESHOLD = PRICING_CONFIG.FREE_DELIVERY_THRESHOLD;
const STANDARD_DELIVERY_FEE = PRICING_CONFIG.STANDARD_DELIVERY_FEE;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
      return [];
    }
  });

  // Sync to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items]);

  const getItemKey = (productId: string, variantSku?: string): string => {
    return `${productId}-${variantSku || 'default'}`;
  };

  const addItem = useCallback(
    (product: Product, variant?: ProductVariant, quantity = 1): { success: boolean; message?: string } => {
      const availableStock = variant ? variant.stock : product.stock;

      if (availableStock <= 0) {
        return { success: false, message: 'This item is currently out of stock' };
      }

      const itemId = getItemKey(product._id, variant?.sku);
      const unitPrice = variant ? variant.sellingPrice : product.sellingPrice;
      const unitMrp = variant ? variant.mrp : product.mrp;

      let result = { success: true, message: 'Added to cart' };

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.id === itemId);

        if (existingIndex > -1) {
          const currentQty = prevItems[existingIndex].quantity;
          const newQty = currentQty + quantity;

          if (newQty > availableStock) {
            result = {
              success: false,
              message: `Cannot add more. Maximum available stock is ${availableStock} units.`,
            };
            return prevItems;
          }

          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            price: unitPrice,
            mrp: unitMrp,
          };
          return updated;
        }

        if (quantity > availableStock) {
          result = {
            success: false,
            message: `Only ${availableStock} units available in stock.`,
          };
          return prevItems;
        }

        const newItem: CartItem = {
          id: itemId,
          productId: product._id,
          product,
          variant,
          variantSku: variant?.sku,
          quantity,
          price: unitPrice,
          mrp: unitMrp,
        };

        return [...prevItems, newItem];
      });

      return result;
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback(
    (itemId: string, quantity: number): { success: boolean; message?: string } => {
      if (quantity <= 0) {
        removeItem(itemId);
        return { success: true };
      }

      let result = { success: true, message: 'Quantity updated' };

      setItems((prevItems) => {
        const item = prevItems.find((i) => i.id === itemId);
        if (!item) return prevItems;

        const maxStock = item.variant ? item.variant.stock : item.product.stock;

        if (quantity > maxStock) {
          result = {
            success: false,
            message: `Only ${maxStock} units available in stock.`,
          };
          return prevItems.map((i) => (i.id === itemId ? { ...i, quantity: maxStock } : i));
        }

        return prevItems.map((i) => (i.id === itemId ? { ...i, quantity } : i));
      });

      return result;
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemQuantity = useCallback(
    (productId: string, variantSku?: string): number => {
      const itemId = getItemKey(productId, variantSku);
      const found = items.find((i) => i.id === itemId);
      return found ? found.quantity : 0;
    },
    [items]
  );

  const calculations = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const mrpTotal = items.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
    const discount = Math.max(0, mrpTotal - subtotal);
    const deliveryFee = itemCount === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
    const total = subtotal + deliveryFee;
    const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

    return {
      itemCount,
      subtotal,
      mrpTotal,
      discount,
      deliveryFee,
      total,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      amountToFreeDelivery,
    };
  }, [items]);

  const refreshCartItems = useCallback(
    (serverItems: { productId: string; variantSku?: string; price: number; mrp: number; stock: number }[]) => {
      setItems((prevItems) => {
        return prevItems.map((item) => {
          const match = serverItems.find(
            (si) => si.productId === item.productId && (si.variantSku || undefined) === (item.variantSku || undefined)
          );
          if (!match) return item;
          return {
            ...item,
            price: match.price,
            mrp: match.mrp,
            quantity: Math.min(item.quantity, match.stock > 0 ? match.stock : item.quantity),
          };
        });
      });
    },
    []
  );

  const value: CartContextValue = {
    items,
    ...calculations,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    refreshCartItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
