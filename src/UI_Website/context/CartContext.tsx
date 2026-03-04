"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

// Types
export interface ToppingOption {
    toppingName: string;
    price: string;
}

export type CartItem = {
    id: number;
    name: string;
    price: string;
    image: string;
    quantity: number;
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
export const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/\D/g, ""), 10);
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
    const generateItemKey = (productId: number, toppings?: ToppingOption[]) => {
        if (!toppings || toppings.length === 0) return `${productId}`;
        const toppingStr = toppings.map(t => t.toppingName).sort().join(",");
        return `${productId}-${toppingStr}`;
    };

    const addToCart = (product: any, quantity: number, selectedToppings?: ToppingOption[]) => {
        setCart(prev => {
            const newItemKey = generateItemKey(product.id, selectedToppings);
            const existingIndex = prev.findIndex(item =>
                generateItemKey(item.id, item.selectedToppings) === newItemKey
            );

            if (existingIndex !== -1) {
                return prev.map((item, index) =>
                    index === existingIndex
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity, selectedToppings }];
        });
    };

    const removeFromCart = (tempId: string) => {
        setCart(prev => prev.filter(item =>
            generateItemKey(item.id, item.selectedToppings) !== tempId
        ));
    };

    const updateQuantity = (tempId: string, quantity: number) => {
        if (quantity < 1) return;
        setCart(prev => prev.map(item =>
            generateItemKey(item.id, item.selectedToppings) === tempId
                ? { ...item, quantity }
                : item
        ));
    };

    const clearCart = () => setCart([]);

    // Derived State
    const totalItems = useMemo(() =>
        cart.reduce((sum, item) => sum + item.quantity, 0),
        [cart]);

    const totalPrice = useMemo(() =>
        cart.reduce((sum, item) => {
            const basePrice = parsePrice(item.price);
            const toppingPrice = item.selectedToppings?.reduce((tSum, t) => tSum + parsePrice(t.price), 0) || 0;
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
