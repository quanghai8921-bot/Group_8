"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Chuyển đổi giá tiền từ chuỗi "37.690.000 VNĐ" sang số 37690000
export const parsePrice = function (priceStr: string) {
    return parseInt(priceStr.replace(/\D/g, ""), 10);
};

// Kiểu dữ liệu cho sản phẩm trong giỏ
export type CartItem = {
    id: number;
    name: string;
    price: string;
    image: string;
    quantity: number;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (product: any, quantity: number) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // 1. Load từ Local Storage khi ứng dụng chạy 
    useEffect(function () {
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

    // 2. Lưu vào Local Storage mỗi khi giỏ hàng thay đổi
    useEffect(function () {
        if (isMounted === true) {
            localStorage.setItem("shopping-cart", JSON.stringify(cart));
        }
    }, [cart, isMounted]);

    const addToCart = function (product: any, quantity: number) {
        setCart(function (prev) {
            const existing = prev.find(function (item) {
                return item.id === product.id;
            });

            if (existing) {
                return prev.map(function (item) {
                    if (item.id === product.id) {
                        return { ...item, quantity: item.quantity + quantity };
                    }
                    return item;
                });
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = function (id: number) {
        setCart(function (prev) {
            return prev.filter(function (item) {
                return item.id !== id;
            });
        });
    };

    const updateQuantity = function (id: number, quantity: number) {
        if (quantity < 1) return;
        setCart(function (prev) {
            return prev.map(function (item) {
                if (item.id === id) {
                    return { ...item, quantity };
                }
                return item;
            });
        });
    };

    const clearCart = function () {
        setCart([]);
    };

    // Tính toán tổng số lượng và tổng tiền
    const totalItems = cart.reduce(function (sum, item) {
        return sum + item.quantity;
    }, 0);

    const totalPrice = cart.reduce(function (sum, item) {
        return sum + parsePrice(item.price) * item.quantity;
    }, 0);

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
}

export const useCart = function () {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};