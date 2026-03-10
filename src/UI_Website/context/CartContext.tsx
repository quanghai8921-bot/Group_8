"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

// Types
export interface ToppingOption {
    ToppingId: string;
    ToppingName: string;
    Price: number;
}

export type CartItem = {
    FoodId: string;
    FoodName: string;
    Price: number;
    FoodImage: string;
    Quantity: number;
    selectedToppings?: ToppingOption[];
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (product: any, quantity: number, selectedToppings?: ToppingOption[]) => void;
    removeFromCart: (tempId: string) => void;
    updateQuantity: (tempId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
};

// Utilities
export const parsePrice = (price: string | number) => {
    if (typeof price === 'number') return price;
    return parseInt(price.replace(/\D/g, ""), 10) || 0;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Provider quản lý trạng thái giỏ hàng toàn ứng dụng
 */
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // Khởi tạo từ Local Storage
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

    // Lưu vào Local Storage khi có thay đổi
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("shopping-cart", JSON.stringify(cart));
        }
    }, [cart, isMounted]);

    // Tạo key duy nhất để phân biệt các sản phẩm khác topping
    const generateItemKey = (productId: string, toppings?: ToppingOption[]) => {
        if (!toppings || toppings.length === 0) return `${productId}`;
        const toppingStr = toppings.map(t => t.ToppingName).sort().join(",");
        return `${productId}-${toppingStr}`;
    };

    const addToCart = (product: any, quantity: number, selectedToppings?: ToppingOption[]) => {
        // Map from API Product to CartItem format
        const foodId = product.FoodId || product.id; // Handle both old and new for migration
        const foodName = product.FoodName || product.name;
        const price = parsePrice(product.SalePrice || product.OriginalPrice || product.price);
        const image = product.FoodImage || product.image;

        setCart(prev => {
            const newItemKey = generateItemKey(foodId, selectedToppings);
            const existingIndex = prev.findIndex(item =>
                generateItemKey(item.FoodId, item.selectedToppings) === newItemKey
            );

            if (existingIndex !== -1) {
                return prev.map((item, index) =>
                    index === existingIndex
                        ? { ...item, Quantity: item.Quantity + quantity }
                        : item
                );
            }
            return [...prev, { 
                FoodId: foodId, 
                FoodName: foodName, 
                Price: price, 
                FoodImage: image, 
                Quantity: quantity, 
                selectedToppings 
            }];
        });
    };

    const removeFromCart = (tempId: string) => {
        setCart(prev => prev.filter(item =>
            generateItemKey(item.FoodId, item.selectedToppings) !== tempId
        ));
    };

    const updateQuantity = (tempId: string, quantity: number) => {
        if (quantity < 1) return;
        setCart(prev => prev.map(item =>
            generateItemKey(item.FoodId, item.selectedToppings) === tempId
                ? { ...item, Quantity: quantity }
                : item
        ));
    };

    const clearCart = () => setCart([]);

    // Derived State
    const totalItems = useMemo(() =>
        cart.reduce((sum, item) => sum + item.Quantity, 0),
        [cart]);

    const totalPrice = useMemo(() =>
        cart.reduce((sum, item) => {
            const basePrice = item.Price;
            const toppingPrice = item.selectedToppings?.reduce((tSum, t) => tSum + t.Price, 0) || 0;
            return sum + (basePrice + toppingPrice) * item.Quantity;
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
