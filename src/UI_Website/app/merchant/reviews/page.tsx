"use client";

import { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  Calendar,
  User,
  ShoppingBag,
} from "lucide-react";
import { getMockReviews } from "@/lib/apiClient";

interface Review {
  ReviewId: string;
  OrderId: string;
  Rating: number;
  Comment: string;
  ReviewType: string; // 'Order' | 'FoodItem'
  ReviewDate: string;
  MediaUrl?: string;
  // Join fields
  FullName?: string;
  PhoneNumber?: string;
  FoodName?: string;
  FoodImage?: string;
  OrderDate?: string;
}

export default function MerchantReviews() {
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const [activeRatingFilter, setActiveRatingFilter] = useState<number | null>(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>("Order");
  const [isPageLoading, setIsPageLoading] = useState(true);

  async function fetchReviewsFromServer() {
    setIsPageLoading(true);
    try {
      const reviews = await getMockReviews();
      setReviewList(reviews);
    } catch (error) {
      console.error("Critical error while loading reviews:", error);
      setReviewList([
        {
          ReviewId: "REV-001",
          OrderId: "ORD-001",
          Rating: 5,
          Comment: "Cửa hàng phục vụ rất tốt!",
          ReviewType: "Order",
          ReviewDate: new Date().toISOString(),
          FullName: "Khách hàng mẫu",
          PhoneNumber: "0912345678",
          MediaUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop",
        },
      ]);
    } finally {
      setIsPageLoading(false);
    }
  }

  useEffect(function onComponentMount() {
    fetchReviewsFromServer();
  }, []);

  const filteredReviews = reviewList.filter((review) => {
    const isRatingMatch = activeRatingFilter === null || review.Rating === activeRatingFilter;
    const isTypeMatch = activeTypeFilter === "all" || review.ReviewType === activeTypeFilter;
    return isRatingMatch && isTypeMatch;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            Phản hồi khách hàng
          </h1>
          <p className="text-gray-500 font-medium">
            Theo dõi và quản lý các đánh giá từ khách hàng của bạn
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveRatingFilter(null)}
                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRatingFilter === null ? "bg-[#ee4d2d] text-white shadow-lg shadow-orange-100" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
              >
                Tất cả
              </button>
              {[5, 4, 3, 2, 1].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setActiveRatingFilter(stars)}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRatingFilter === stars ? "bg-yellow-100 text-yellow-700 border border-yellow-200" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                >
                  {stars} <Star className={`w-3.5 h-3.5 ${activeRatingFilter === stars ? "fill-yellow-500 text-yellow-500" : "fill-none"}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Loại:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTypeFilter("Order")}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTypeFilter === "Order" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
              >
                Đơn hàng
              </button>
              <button
                onClick={() => setActiveTypeFilter("FoodItem")}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTypeFilter === "FoodItem" ? "bg-orange-600 text-white" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}
              >
                Món ăn
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {isPageLoading ? (
            <div className="p-20 text-center flex flex-col items-center gap-4">
               <div className="h-10 w-10 border-4 border-orange-100 border-t-[#ee4d2d] rounded-full animate-spin" />
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đang tải đánh giá...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center gap-4 opacity-40">
              <MessageSquare className="w-16 h-16 text-gray-200" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Không có đánh giá phù hợp</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.ReviewId} className="p-8 hover:bg-gray-50/50 transition-all">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="w-full lg:w-1/4 space-y-6 lg:border-r border-gray-100 pr-8">
                    <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${review.ReviewType === "Order" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}>
                      {review.ReviewType === "Order" ? "Đơn hàng" : "Món ăn"}
                    </span>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-gray-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-300" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">{review.FullName || "Ẩn danh"}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{review.PhoneNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-gray-100 flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-gray-300" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#ee4d2d] uppercase tracking-tighter cursor-pointer hover:underline">#{review.OrderId.substring(0, 8)}</p>
                          <div className="flex items-center gap-1 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            <Calendar className="w-3 h-3" />
                            {new Date(review.OrderDate || review.ReviewDate).toLocaleDateString("vi-VN")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-5 h-5 ${s <= review.Rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-200"}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                        Gửi lúc: {new Date(review.ReviewDate).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {review.MediaUrl && (
                      <div className="relative w-48 h-48 rounded-[32px] overflow-hidden border-4 border-white shadow-xl transition-transform hover:scale-105 cursor-zoom-in">
                        <img src={review.MediaUrl} alt="Review" className="object-cover w-full h-full" />
                      </div>
                    )}

                    {review.ReviewType === "FoodItem" && review.FoodName && (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="h-14 w-14 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                          <img src={review.FoodImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} alt="" className="object-cover w-full h-full" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Sản phẩm</p>
                          <p className="text-sm font-black text-gray-900 leading-tight">{review.FoodName}</p>
                        </div>
                      </div>
                    )}

                    <div className="bg-orange-50/50 rounded-[40px] p-8 relative border border-orange-100 group hover:bg-orange-50 transition-colors">
                      <MessageSquare className="absolute top-6 right-8 w-8 h-8 text-orange-100" />
                      <p className="text-xl font-bold text-gray-800 leading-relaxed italic pr-12">
                        {review.Comment ? `"${review.Comment}"` : "Khách hàng không để lại nhận xét."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
