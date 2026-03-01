"use client";

import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";
import CategoryList from "@/components/CategoryList";
import { products } from "@/lib/data";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";


function HomeContent() {
  
  const urlSearchParams = useSearchParams();
  const activeSearchQuery = urlSearchParams.get("search") || "";

  
  function getMatchingProducts() {
    return products.filter(function checkProductMatch(productItem) {
      const lowerCasedProductName = productItem.name.toLowerCase();
      const lowerCasedSearchQuery = activeSearchQuery.toLowerCase();

      
      const isNameMatched = lowerCasedProductName.includes(lowerCasedSearchQuery);
      return isNameMatched;
    });
  }

  
  const visibleProductsList = getMatchingProducts();

  
  function renderProductCards() {
    return visibleProductsList.map(function createProductCard(productItem) {
      return (
        <ProductCard
          key={productItem.id}
          product={productItem}
        />
      );
    });
  }

  
  const productGridElements = renderProductCards();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {}
      <Navbar />

      <div className="container mx-auto py-12 px-4 flex-grow">
        {}
        <HeroSlider />

        {}
        <CategoryList />

        {}
        {visibleProductsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
            {productGridElements}
          </div>
        ) : (
          
          <div className="text-center py-20 bg-white rounded-3xl border border-orange-100 shadow-md mt-10 max-w-2xl mx-auto">
            <div className="mb-6 flex justify-center">
              <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-5xl">🔍</span>
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-800 tracking-tight">
              Không tìm thấy kết quả cho "{activeSearchQuery}"
            </h3>
            <p className="text-gray-500 font-medium mt-4 max-w-sm mx-auto leading-relaxed">
              Rất tiếc, chúng tôi không tìm thấy món ăn nào phù hợp. Bạn hãy thử kiểm tra lại chính tả hoặc tìm kiếm với từ khóa khác (ví dụ: Cơm, Phở, Trà sữa...) xem sao nhé!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}


export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-[#ee4d2d] font-black text-xl animate-pulse tracking-widest uppercase">
          Đang tải dữ liệu...
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}