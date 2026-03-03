"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useCart, parsePrice } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { placeOrder, handleApiError } from "@/lib/apiClient";
import { AxiosError } from "axios";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-8 text-center">Giỏ Hàng Của Bạn</h1>

                {cart.length === 0 ? (
                    <div className="text-center">
                        <p className="text-lg text-gray-500 mb-4">Giỏ hàng đang trống</p>
                        <Link href="/">
                            <Button>Tiếp tục mua sắm</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Danh sách sản phẩm */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                            <div className="space-y-6">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 border-b pb-4 last:border-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded-md"
                                        />
                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="font-semibold text-lg">{item.name}</h3>
                                            <p className="text-gray-600">{item.price}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                -
                                            </Button>
                                            <Input
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                                className="w-16 h-8 text-center"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </Button>
                                        </div>

                                        <div className="text-right min-w-[120px]">
                                            <p className="font-bold text-blue-600">
                                                {formatCurrency(parsePrice(item.price) * item.quantity)}
                                            </p>
                                        </div>

                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="mt-6 w-full sm:w-auto" onClick={clearCart}>
                                Xóa tất cả
                            </Button>
                        </div>

                        {/* Tổng tiền */}
                        <div className="lg:col-span-1">
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
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}