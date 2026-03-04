"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";
import { Store, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Trang cửa hàng của một Merchant cụ thể
 * Hiển thị tất cả món ăn mà Merchant đó đang bán
 */
const StorePage = () => {
    const params = useParams();
    const router = useRouter();
    const merchantId = params.id as string;

    // Lọc các sản phẩm thuộc về merchantId này
    const storeProducts = products.filter(p => p.merchantId === merchantId);

    // Lấy tên merchant từ sản phẩm đầu tiên (nếu có)
    const merchantName = storeProducts.length > 0 ? storeProducts[0].merchantName : "Cửa hàng";

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />

            <div className="container mx-auto py-12 px-4 flex-grow">
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <Button
                            variant="ghost"
                            className="p-0 h-auto text-gray-400 hover:text-[#ee4d2d] transition-colors flex items-center gap-2 group"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Quay lại trang chủ
                        </Button>

                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center text-[#ee4d2d]">
                                <Store className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                                    {merchantName}
                                </h1>
                                <p className="text-gray-500 font-medium">
                                    Khám phá thực đơn phong phú từ {merchantName}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Món ăn đang bán</p>
                        <p className="text-2xl font-black text-[#ee4d2d]">{storeProducts.length} món</p>
                    </div>
                </div>

                {storeProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {storeProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-orange-100 shadow-md max-w-2xl mx-auto">
                        <div className="mb-6 flex justify-center">
                            <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center">
                                <Store className="w-12 h-12 text-[#ee4d2d]" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 tracking-tight">
                            Cửa hàng hiện chưa có món ăn nào
                        </h3>
                        <p className="text-gray-500 font-medium mt-4 max-w-sm mx-auto leading-relaxed">
                            Rất tiếc, {merchantName} hiện đang cập nhật thực đơn. Bạn vui lòng quay lại sau nhé!
                        </p>
                        <Button
                            className="mt-8 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-black px-8 py-6 rounded-2xl shadow-lg transition-all active:scale-95"
                            onClick={() => router.push("/")}
                        >
                            Xem các quán khác
                        </Button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default StorePage;
