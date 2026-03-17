"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Minus, ShoppingCart, CreditCard, Store } from "lucide-react";
import { useCart, parsePrice } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Food, Topping } from "@/lib/apiClient";

interface ProductDetailModalProps {
  product: Food;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal hiển thị chi tiết sản phẩm
 * Cho phép chọn topping, điều chỉnh số lượng và thực hiện mua hàng
 */
export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);

  const cart = useCart();
  const auth = useAuth();
  const router = useRouter();

  // Handlers
  const handleToppingToggle = (topping: Topping) => {
    setSelectedToppings((prev) => {
      const isSelected = prev.some(
        (t) => t.toppingId === topping.toppingId,
      );
      if (isSelected) {
        return prev.filter((t) => t.toppingId !== topping.toppingId);
      }
      return [...prev, topping];
    });
  };

  const calculateTotalPrice = () => {
    const basePrice = product.salePrice || product.originalPrice || 0;
    const toppingPrice = selectedToppings.reduce(
      (sum, t) => sum + t.price,
      0,
    );
    return (basePrice + toppingPrice) * quantity;
  };

  const handleAddToCart = async () => {
    if (!auth.isAuthenticated) {
      router.push("/login");
      return;
    }
    await cart.addToCart(product, quantity, selectedToppings);
    onClose();
    alert(`Đã thêm ${quantity} ${product.foodName} vào giỏ hàng!`);
  };

  const handleBuyNow = async () => {
    if (!auth.isAuthenticated) {
      router.push("/login");
      return;
    }
    await cart.addToCart(product, quantity, selectedToppings);
    router.push("/cart");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <div className="flex flex-col h-full max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* Image Section - Now on Top */}
          <div className="w-full h-72 relative shrink-0">
            <img
              src={product.foodImage}
              alt={product.foodName}
              className={`w-full h-full object-cover ${product.foodStatus === 0 ? "grayscale" : ""}`}
            />
            {product.foodStatus === 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white/90 text-gray-900 font-black text-sm px-6 py-3 rounded-full uppercase tracking-widest shadow-xl">Hết hàng</span>
              </div>
            )}
            {/* Close button area - the Dialog content usually has its own close button, but we ensure it doesn't overlap awkwardly */}
          </div>

          {/* Info Section - Now Below */}
          <div className="w-full p-6 flex flex-col gap-6 bg-white">
            <div>
              <Link
                href={`/store/${product.merchantId}`}
                className="flex items-center gap-2 text-[#ee4d2d] font-bold text-xs uppercase tracking-widest mb-2 hover:opacity-80 transition-opacity"
              >
                <Store className="w-4 h-4" />
                {product.storeName || "Cửa hàng"}
              </Link>
              <DialogTitle className="text-2xl font-black text-gray-900 leading-tight mb-2">
                {product.foodName}
              </DialogTitle>
              <p className="text-gray-500 text-sm leading-relaxed">
                {product.descriptions}
              </p>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* Toppings Section */}
            {product.toppingOptions && product.toppingOptions.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  Thêm Topping
                  <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-bold">
                    TÙY CHỌN
                  </span>
                </h4>
                <div className="space-y-2">
                  {product.toppingOptions.map((topping) => {
                    const isSelected = !!selectedToppings.find(
                      (t) => t.toppingId === topping.toppingId,
                    );
                    return (
                      <div
                        key={topping.toppingId}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${
                          isSelected
                            ? "border-[#ee4d2d]/30 bg-orange-50/50"
                            : "border-gray-100 hover:bg-gray-50"
                        }`}
                        onClick={() => handleToppingToggle(topping)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-[#ee4d2d] border-[#ee4d2d]"
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span
                            className={`text-sm font-bold transition-colors ${isSelected ? "text-[#ee4d2d]" : "text-gray-700"}`}
                          >
                            {topping.toppingName}
                          </span>
                        </div>
                        <span className="text-sm font-black text-[#ee4d2d]">
                          +{topping.price.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & Action Section - Sticky-like feel but at bottom of content */}
            <div className="mt-4 pt-6 border-t border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Số lượng
                  </span>
                  <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl hover:bg-white hover:text-[#ee4d2d] shadow-sm transition-all"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-6 text-center font-black text-lg text-gray-900">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl hover:bg-white hover:text-[#ee4d2d] shadow-sm transition-all"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Tổng cộng
                  </span>
                  <span className={`text-2xl font-black tracking-tight ${product.foodStatus === 0 ? "text-gray-400" : "text-[#ee4d2d]"}`}>
                    {calculateTotalPrice().toLocaleString("vi-VN")} VNĐ
                  </span>
                  {product.foodStatus === 0 && (
                    <span className="text-[10px] font-black text-[#ee4d2d] uppercase tracking-widest mt-1">Sản phẩm hiện đã hết hàng</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleBuyNow}
                  disabled={product.foodStatus === 0}
                  className="w-full h-14 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-100 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:scale-100"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  MUA NGAY
                </Button>
                <Button
                  onClick={handleAddToCart}
                  disabled={product.foodStatus === 0}
                  variant="outline"
                  className="w-full h-14 border-2 border-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Thêm vào giỏ hàng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
