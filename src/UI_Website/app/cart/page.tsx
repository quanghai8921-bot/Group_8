"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useCart, parsePrice } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { placeOrder, handleApiError } from "@/lib/apiClient";
import { AxiosError } from "axios";


export default function CartPage() {
<<<<<<< HEAD
    const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
=======
>>>>>>> c04afd24cc616d1ab06d79b8eea1eb32c37d4155
    
    const {
        cart: itemsInCart,
        removeFromCart: deleteItemFromCart,
        updateQuantity: changeItemQuantity,
        totalPrice: totalOrderAmount,
        clearCart: emptyEntireCart
    } = useCart();

    
    const pageRouter = useRouter();

    
    function formatVNDCurrency(amount: number) {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    }

    
    function handleQuantityChange(itemId: number, newQuantity: number) {
        if (newQuantity <= 0) {
            deleteItemFromCart(itemId);
        } else {
            changeItemQuantity(itemId, newQuantity);
        }
    }

    const handleCheckout = async () => {
        setError("");
        setLoading(true);

        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                router.push("/login");
                return;
            }

            // For demo purposes, using first merchant from cart
            // In real app, you'd have merchant info in cart items
            const merchantId = "MERCH001";

            const response = await placeOrder({
                userId,
                merchantId,
                deliveryAddress: "User Address", // Should be fetched from user profile
                foodAmount: totalPrice,
                shippingFee: 3.0,
                discountAmount: 0,
            });

            // Clear cart and redirect to order confirmation
            clearCart();
            router.push(`/order/${response.orderId}`);
        } catch (err) {
            const axiosError = err as AxiosError;
            const errorData = handleApiError(axiosError);
            setError(errorData.message || "Không thể đặt hàng. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {}
            <Navbar />

            <div className="container mx-auto py-12 px-4 flex-grow">
                <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900">
                    Giỏ Hàng Của Bạn
                </h1>

                {itemsInCart.length === 0 ? (
                    
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
                        <div className="text-6xl mb-6">🛒</div>
                        <p className="text-xl text-gray-500 mb-8 font-medium">Giỏ hàng của bạn đang trống.</p>
                        <Link href="/">
                            <Button className="bg-[#ee4d2d] hover:bg-[#d73211] text-white px-8 py-6 rounded-xl text-lg transition-all shadow-md">
                                Tiếp tục mua sắm ngay
                            </Button>
                        </Link>
                    </div>
                ) : (
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="space-y-8">
                                    {itemsInCart.map(function (item) {
                                        return (
                                            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 border-b border-gray-50 pb-8 last:border-0 last:pb-0 group">
                                                {}
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-28 h-28 object-cover rounded-2xl shadow-sm group-hover:scale-105 transition-transform duration-300"
                                                />

                                                {}
                                                <div className="flex-1 text-center sm:text-left">
                                                    <h3 className="font-bold text-xl text-gray-900 mb-1">{item.name}</h3>
                                                    <p className="text-gray-500 font-medium">
                                                        Đơn giá: {item.price}
                                                    </p>
                                                </div>

                                                {}
                                                <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all font-bold"
                                                        onClick={function () { handleQuantityChange(item.id, item.quantity - 1); }}
                                                    >
                                                        -
                                                    </Button>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={item.quantity}
                                                        onChange={function (e) { handleQuantityChange(item.id, Number(e.target.value)); }}
                                                        className="w-14 h-9 text-center bg-transparent border-none focus-visible:ring-0 font-bold text-gray-900"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all font-bold"
                                                        onClick={function () { handleQuantityChange(item.id, item.quantity + 1); }}
                                                    >
                                                        +
                                                    </Button>
                                                </div>

                                                {}
                                                <div className="text-right min-w-[140px]">
                                                    <p className="font-bold text-xl text-[#ee4d2d]">
                                                        {formatVNDCurrency(parsePrice(item.price) * item.quantity)}
                                                    </p>
                                                </div>

                                                {}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    onClick={function () { deleteItemFromCart(item.id); }}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    className="mt-10 w-full sm:w-auto text-gray-500 hover:text-red-600 hover:border-red-200 rounded-xl border-gray-200"
                                    onClick={function () { if (confirm("Bạn có chắc muốn xóa tất cả?")) emptyEntireCart(); }}
                                >
                                    Xóa tất cả sản phẩm
                                </Button>
                            </div>
                        </div>

                        {}
                        <div className="lg:col-span-1">
<<<<<<< HEAD
                            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                                <h2 className="text-xl font-bold mb-4">Tổng đơn hàng</h2>
                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                        {error}
                                    </div>
                                )}
                                <div className="flex justify-between mb-2">
                                    <span>Tạm tính:</span>
                                    <span>{formatCurrency(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between mb-4 border-b pb-4">
                                    <span>Phí giao hàng:</span>
                                    <span>{formatCurrency(3.0)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold mb-6 text-red-600">
                                    <span>Tổng cộng:</span>
                                    <span>{formatCurrency(totalPrice + 3.0)}</span>
                                </div>
                                <Button 
                                    className="w-full py-6 text-lg" 
                                    onClick={handleCheckout}
                                    disabled={loading || cart.length === 0}
                                >
                                    {loading ? "Đang xử lý..." : "Thanh Toán Ngay"}
                                </Button>
=======
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
                                <h2 className="text-2xl font-bold mb-6 text-gray-900">Chi tiết đơn hàng</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-500 font-medium">
                                        <span>Tạm tính:</span>
                                        <span>{formatVNDCurrency(totalOrderAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 font-medium pb-4 border-b border-gray-50">
                                        <span>Phí vận chuyển:</span>
                                        <span className="text-gray-900 font-bold">15.000 ₫</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-extrabold text-[#ee4d2d] pt-2">
                                        <span>Tổng cộng:</span>
                                        <span>{formatVNDCurrency(totalOrderAmount + 15000)}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full py-8 text-xl font-bold bg-[#ee4d2d] hover:bg-[#d73211] text-white rounded-2xl shadow-lg shadow-orange-100 transition-all hover:scale-[1.02] active:scale-95"
                                    onClick={function () { pageRouter.push("/checkout"); }}
                                >
                                    Thanh Toán Ngay
                                </Button>

                                <p className="text-center text-xs text-gray-400 mt-6">
                                    Bằng việc nhấn đặt hàng, bạn đồng ý với các Điều khoản & Chính sách của ShopeeFood.
                                </p>
>>>>>>> c04afd24cc616d1ab06d79b8eea1eb32c37d4155
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
