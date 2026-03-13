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
import { Product, ToppingOption } from "@/lib/data";

interface ProductDetailModalProps {
  product: Product;
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
  const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([]);

  const cart = useCart();
  const auth = useAuth();
  const router = useRouter();

  // Handlers
  const handleToppingToggle = (topping: ToppingOption) => {
    setSelectedToppings((prev) => {
      const isSelected = prev.some(
        (t) => t.ToppingId === topping.ToppingId,
      );
      if (isSelected) {
        return prev.filter((t) => t.ToppingId !== topping.ToppingId);
      }
      return [...prev, topping];
    });
  };

  const calculateTotalPrice = () => {
    const basePrice = product.SalePrice || product.OriginalPrice || 0;
    const toppingPrice = selectedToppings.reduce(
      (sum, t) => sum + t.Price,
      0,
    );
    return (basePrice + toppingPrice) * quantity;
  };

  const handleAddToCart = () => {
    if (!auth.isAuthenticated) {
      router.push("/login");
      return;
    }
    cart.addToCart(product, quantity, selectedToppings);
    onClose();
    alert(`Đã thêm ${quantity} ${product.FoodName} vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    if (!auth.isAuthenticated) {
      router.push("/login");
      return;
    }
    cart.addToCart(product, quantity, selectedToppings);
    router.push("/cart");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <div className="flex flex-col h-full max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* Image Section - Now on Top */}
          <div className="w-full h-72 relative shrink-0">
            <img
              src={product.FoodImage}
              alt={product.FoodName}
              className="w-full h-full object-cover"
            />
            {product.discount && (
              <div className="absolute top-4 left-4 bg-[#ee4d2d] text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                {product.discount}
              </div>
            )}
            {/* Close button area - the Dialog content usually has its own close button, but we ensure it doesn't overlap awkwardly */}
          </div>

          {/* Info Section - Now Below */}
          <div className="w-full p-6 flex flex-col gap-6 bg-white">
            <div>
              <Link
                href={`/store/${product.MerchantId}`}
                className="flex items-center gap-2 text-[#ee4d2d] font-bold text-xs uppercase tracking-widest mb-2 hover:opacity-80 transition-opacity"
              >
                <Store className="w-4 h-4" />
                {product.merchantName || "Cửa hàng"}
              </Link>
              <DialogTitle className="text-2xl font-black text-gray-900 leading-tight mb-2">
                {product.FoodName}
              </DialogTitle>
              <p className="text-gray-500 text-sm leading-relaxed">
                {product.Descriptions}
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
                      (t) => t.ToppingId === topping.ToppingId,
                    );
                    return (
                      <div
                        key={topping.ToppingId}
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
                            {topping.ToppingName}
                          </span>
                        </div>
                        <span className="text-sm font-black text-[#ee4d2d]">
                          +{topping.Price.toLocaleString("vi-VN")}đ
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
                  <span className="text-2xl font-black text-[#ee4d2d] tracking-tight">
                    {calculateTotalPrice().toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleBuyNow}
                  className="w-full h-14 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-100"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  MUA NGAY
                </Button>
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="w-full h-14 border-2 border-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center"
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
