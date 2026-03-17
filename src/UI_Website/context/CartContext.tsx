"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { 
  addToCartInDb, 
  getCartFromDb, 
  getCartsByUser, 
  removeCartItemFromDb, 
  clearCartFromDb,
  CartResponseDTO,
  CartItemDTO
} from "@/lib/apiClient";

// Types
export interface ToppingOption {
    toppingId: string;
    toppingName: string;
    price: number;
}

export type CartItem = {
    foodId: string;
    foodName: string;
    price: number;
    foodImage: string;
    quantity: number;
    merchantId: string;
    cartItemId?: string; // ID from DB
    selectedToppings?: ToppingOption[];
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (product: any, quantity: number, selectedToppings?: ToppingOption[]) => Promise<void>;
    removeFromCart: (foodId: string, toppings?: ToppingOption[]) => Promise<void>;
    updateQuantity: (foodId: string, quantity: number, toppings?: ToppingOption[]) => Promise<void>;
    clearCart: () => Promise<void>;
    totalItems: number;
    totalPrice: number;
    refreshCart: () => Promise<void>;
};

// Utilities
export const parsePrice = (price: any) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') return parseInt(price.replace(/\D/g, ""), 10) || 0;
    return 0;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, userId } = useAuth();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // Initial load from Local Storage
    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem("shopping-cart");
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Lỗi đọc Local Storage", e);
            }
        }
    }, []);

    // Load from DB when user logs in
    useEffect(() => {
        if (isMounted && isAuthenticated && userId) {
            refreshCart();
        }
    }, [isMounted, isAuthenticated, userId]);

    // Save to Local Storage as fallback
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("shopping-cart", JSON.stringify(cart));
        }
    }, [cart, isMounted]);

    const refreshCart = async () => {
        if (!isAuthenticated || !userId) return;
        try {
            const carts = await getCartsByUser(userId);
            const allItems: CartItem[] = [];
            
            carts.forEach(c => {
                c.items.forEach(item => {
                    allItems.push({
                        foodId: item.foodId,
                        foodName: item.foodName,
                        price: item.unitPrice,
                        foodImage: item.foodImage || "",
                        quantity: item.quantity,
                        merchantId: c.merchantId,
                        cartItemId: item.cartItemId,
                        selectedToppings: item.toppings.map(t => ({
                            toppingId: t.toppingId,
                            toppingName: t.toppingName,
                            price: t.price
                        }))
                    });
                });
            });
            setCart(allItems);
        } catch (error) {
            console.error("Failed to refresh cart from DB:", error);
        }
    };

    const generateItemKey = (foodId: string, toppings?: ToppingOption[]) => {
        if (!toppings || toppings.length === 0) return foodId;
        const toppingStr = toppings.map(t => t.toppingId).sort().join(",");
        return `${foodId}-${toppingStr}`;
    };

    const addToCart = async (product: any, quantity: number, selectedToppings?: ToppingOption[]) => {
        if (!product) return;

        const foodId = product.foodId || product.FoodId || product.id;
        const merchantId = product.merchantId || product.MerchantId;

        if (isAuthenticated && userId && merchantId) {
            try {
                await addToCartInDb({
                    userId,
                    merchantId,
                    foodId,
                    quantity,
                    toppingIds: selectedToppings?.map(t => t.toppingId) || []
                });
                await refreshCart();
                return;
            } catch (error) {
                console.error("Failed to add to cart in DB:", error);
            }
        }

        // Local fallback
        const foodName = product.foodName || product.FoodName || product.name || "Món ăn";
        const price = parsePrice(product.salePrice || product.SalePrice || product.originalPrice || product.OriginalPrice || product.price);
        const image = product.foodImage || product.FoodImage || "";

        setCart(prev => {
            const newItemKey = generateItemKey(foodId, selectedToppings);
            const existingIndex = prev.findIndex(item =>
                generateItemKey(item.foodId, item.selectedToppings) === newItemKey
            );

            if (existingIndex !== -1) {
                return prev.map((item, index) =>
                    index === existingIndex
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { 
                foodId, 
                foodName, 
                price, 
                foodImage: image, 
                quantity, 
                merchantId: merchantId || "unknown",
                selectedToppings 
            }];
        });
    };

    const removeFromCart = async (foodId: string, toppings?: ToppingOption[]) => {
        const itemKey = generateItemKey(foodId, toppings);
        const item = cart.find(i => generateItemKey(i.foodId, i.selectedToppings) === itemKey);
        
        if (isAuthenticated && item?.cartItemId) {
            try {
                await removeCartItemFromDb(item.cartItemId);
                await refreshCart();
                return;
            } catch (error) {
                console.error("Failed to remove from DB:", error);
            }
        }

        setCart(prev => prev.filter(i => generateItemKey(i.foodId, i.selectedToppings) !== itemKey));
    };

    const updateQuantity = async (foodId: string, quantity: number, toppings?: ToppingOption[]) => {
        if (quantity < 1) return;

        const itemKey = generateItemKey(foodId, toppings);
        const item = cart.find(i => generateItemKey(i.foodId, i.selectedToppings) === itemKey);

        if (isAuthenticated && item && item.merchantId && userId) {
            try {
                // Backend addToCart handles updates if item exists
                await addToCartInDb({
                    userId,
                    merchantId: item.merchantId,
                    foodId,
                    quantity: quantity - item.quantity, // Diff
                    toppingIds: toppings?.map(t => t.toppingId) || []
                });
                await refreshCart();
                return;
            } catch (error) {
                console.error("Failed to update quantity in DB:", error);
            }
        }

        setCart(prev => prev.map(i =>
            generateItemKey(i.foodId, i.selectedToppings) === itemKey
                ? { ...i, quantity }
                : i
        ));
    };

    const clearCart = async () => {
        if (isAuthenticated && cart.length > 0) {
            try {
                // Clear each unique merchant cart
                const merchantIds = Array.from(new Set(cart.map(i => i.merchantId)));
                for (const mid of merchantIds) {
                    const cData = await getCartFromDb(userId!, mid);
                    if (cData && cData.cartId) {
                        await clearCartFromDb(cData.cartId);
                    }
                }
                await refreshCart();
                return;
            } catch (error) {
                console.error("Failed to clear DB cart:", error);
            }
        }
        setCart([]);
    };

    const totalItems = useMemo(() =>
        cart.reduce((sum, item) => sum + item.quantity, 0),
        [cart]);

    const totalPrice = useMemo(() =>
        cart.reduce((sum, item) => {
            const basePrice = item.price || 0;
            const toppingPrice = item.selectedToppings?.reduce((tSum, t) => tSum + (t.price || 0), 0) || 0;
            return sum + (basePrice + toppingPrice) * item.quantity;
        }, 0),
        [cart]);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
                refreshCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
