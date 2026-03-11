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
export const parsePrice = (price: any) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') return parseInt(price.replace(/\D/g, ""), 10) || 0;
    return 0;
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
        const id = productId || "unknown";
        if (!toppings || toppings.length === 0) return `${id}`;
        const toppingStr = toppings.map(t => t.ToppingName).sort().join(",");
        return `${id}-${toppingStr}`;
    };

    const addToCart = (product: any, quantity: number, selectedToppings?: ToppingOption[]) => {
        if (!product) return;

        // Map from API Product to CartItem format
        const foodId = product.FoodId || product.id; 
        const foodName = product.FoodName || product.name;
        
        // Critical validation: must have ID and Name
        if (!foodId || !foodName) {
            console.error("Invalid product added to cart:", product);
            return;
        }

        const price = parsePrice(product.SalePrice || product.OriginalPrice || product.Price || product.price);
        const image = product.FoodImage || product.image || "";
        const validQuantity = Math.max(1, quantity || 1);

        setCart(prev => {
            const newItemKey = generateItemKey(foodId, selectedToppings);
            const existingIndex = prev.findIndex(item =>
                generateItemKey(item.FoodId, item.selectedToppings) === newItemKey
            );

            if (existingIndex !== -1) {
                return prev.map((item, index) =>
                    index === existingIndex
                        ? { ...item, Quantity: (item.Quantity || 0) + validQuantity }
                        : item
                );
            }
            return [...prev, { 
                FoodId: foodId, 
                FoodName: foodName, 
                Price: price, 
                FoodImage: image, 
                Quantity: validQuantity, 
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
            const basePrice = Number(item.Price) || 0;
            const toppingPrice = item.selectedToppings?.reduce((tSum, t) => tSum + (Number(t.Price) || 0), 0) || 0;
            const quantity = Number(item.Quantity) || 0;
            return sum + (basePrice + toppingPrice) * quantity;
        }, 0),
        [cart]);
    
    // Cleanup: Remove invalid items that might have leaked into the cart
    useEffect(() => {
        if (isMounted && cart.length > 0) {
            const hasInvalidItems = cart.some(item => !item.FoodId || !item.FoodName);
            if (hasInvalidItems) {
                setCart(prev => prev.filter(item => item.FoodId && item.FoodName));
            }
        }
    }, [cart, isMounted]);

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
