"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Store, CreditCard, ShoppingCart } from "lucide-react";
import ProductDetailModal from "./ProductDetailModal";
import { Food } from "@/lib/apiClient";

interface ProductProps {
  product: Food;
}

/**
 * Thẻ hiển thị sản phẩm rút gọn trên trang chủ
 * Cho phép xem nhanh, đổi số lượng và thêm vào giỏ hàng
 */
export default function ProductCard({ product }: ProductProps) {
  const auth = useAuth();
  const cart = useCart();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuantity(Number(e.target.value));
  }

  async function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation();
    if (!auth.isAuthenticated) {
      router.push("/login");
      return;
    }

    await cart.addToCart(product, quantity);
    alert("Đã thêm vào giỏ hàng thành công!");
  }

  async function handleBuyNow(e: React.MouseEvent) {
    e.stopPropagation();
    if (!auth.isAuthenticated) {
      router.push("/login");
      return;
    }

    await cart.addToCart(product, quantity);
    router.push("/cart");
  }

  const displayPrice = (product.salePrice || product.originalPrice || 0).toLocaleString("vi-VN") + "đ";

  return (
    <>
      <Card
        className={`w-full max-w-sm hover:shadow-2xl transition-all duration-300 border-none bg-white rounded-3xl overflow-hidden group cursor-pointer !p-0 !pt-0 !gap-0 ${product.foodStatus === 0 ? "opacity-75" : ""}`}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative overflow-hidden h-56 w-full shrink-0">
          <img
            src={product.foodImage}
            alt={product.foodName}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${product.foodStatus === 0 ? "grayscale" : ""}`}
          />
          {product.foodStatus === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white/90 text-gray-900 font-black text-xs px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">Hết hàng</span>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex flex-col gap-1">
          <Link
            href={`/store/${product.merchantId}`}
            className="flex items-center gap-1.5 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-[#ee4d2d] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Store className="w-3 h-3" />
            {product.storeName || "Cửa hàng"}
          </Link>

          <CardTitle className="text-lg font-black text-gray-900 line-clamp-1 group-hover:text-[#ee4d2d] transition-colors">
            {product.foodName}
          </CardTitle>

          <p className="text-gray-400 text-xs line-clamp-2 font-medium mb-2 leading-relaxed">
            {product.descriptions}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <p className="text-xl font-black text-[#ee4d2d]">{displayPrice}</p>

            <div
              className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[10px] font-black text-gray-400 uppercase ml-1">
                SL:
              </span>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-10 h-7 bg-white text-xs font-bold text-center border-none rounded-md focus:ring-1 focus:ring-[#ee4d2d] transition-all"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            variant="outline"
            disabled={product.foodStatus === 0}
            className="flex-1 h-9 rounded-xl border-gray-100 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />+ Giỏ
          </Button>
          <Button
            disabled={product.foodStatus === 0}
            className="flex-1 h-9 rounded-xl bg-[#ee4d2d] hover:bg-[#d73211] text-white font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm disabled:bg-gray-200 disabled:text-gray-400"
            onClick={handleBuyNow}
          >
            Mua
          </Button>
        </CardFooter>
      </Card>

      <ProductDetailModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
