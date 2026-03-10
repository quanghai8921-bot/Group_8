"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Star,
  MessageSquare,
  Calendar,
  User,
  ShoppingBag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function AdminReviews() {
  const [reviewList, setReviewList] = useState<any[]>([]);

  const [activeRatingFilter, setActiveRatingFilter] = useState<number | null>(
    null,
  );
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>("order");

  const [isPageLoading, setIsPageLoading] = useState(true);

  async function fetchReviewsFromServer() {
    try {
      const response = await fetch("/api/reviews");
      let reviews: any[] = [];

      if (response.ok) {
        const data = await response.json();
        reviews = data.reviews || [];
      }

      // Fallback to Mock Data if no reviews found from server
      if (reviews.length === 0) {
        reviews = [
          {
            reviewid: "REV-101",
            rating: 5,
            comment:
              "Đồ ăn rất ngon, đóng gói chắc chắn. Sẽ ủng hộ quán dài dài!",
            type: "order",
            createdat: new Date(Date.now() - 3600000 * 2).toISOString(),
            orderid: "ORD-8821",
            mediaUrl:
              "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=500&auto=format&fit=crop",
            orders: {
              users: { fullname: "Nguyễn Văn A", phoneNumber: "0901234567" },
              ordertime: new Date(Date.now() - 86400000).toISOString(),
            },
          },
          {
            reviewid: "REV-102",
            rating: 4,
            comment:
              "Giao hàng nhanh, nhân viên thân thiện. Tuy nhiên bún hơi ít một chút.",
            type: "order",
            createdat: new Date(Date.now() - 3600000 * 5).toISOString(),
            orderid: "ORD-9932",
            mediaUrl:
              "https://images.unsplash.com/photo-1512058560366-cd242dfe5cc3?q=80&w=500&auto=format&fit=crop",
            orders: {
              users: { fullname: "Trần Thị B", phoneNumber: "0912345678" },
              ordertime: new Date(Date.now() - 3600000 * 24).toISOString(),
            },
          },
          {
            reviewid: "REV-103",
            rating: 5,
            comment: "Cơm gà rất thơm, gà chiên giòn rụm. Rất hài lòng!",
            type: "order", // Review type là đơn hàng
            createdat: new Date(Date.now() - 3600000 * 12).toISOString(),
            orderid: "ORD-1024",
            mediaUrl:
              "https://images.unsplash.com/photo-1562967913-64415842848c?q=80&w=500&auto=format&fit=crop",
            orders: {
              users: { fullname: "Lê Hoàng C", phoneNumber: "0987654321" },
              ordertime: new Date(Date.now() - 3600000 * 48).toISOString(),
            },
          },
        ];
      }

      setReviewList(reviews);
    } catch (error) {
      console.error("Critical error while loading reviews:", error);
      // Even on error, show mock data for demo
      setReviewList([
        {
          reviewid: "DEMO-REV",
          rating: 5,
          comment: "Cửa hàng phục vụ rất tốt!",
          type: "order",
          createdat: new Date().toISOString(),
          orderid: "DEMO-ORD",
          mediaUrl:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop",
          orders: {
            users: { fullname: "Khách hàng mẫu", phoneNumber: "0999999999" },
          },
        },
      ]);
    } finally {
      setIsPageLoading(false);
    }
  }

  useEffect(function onComponentMount() {
    fetchReviewsFromServer();
  }, []);

  function getFilteredReviews() {
    return reviewList.filter(function (review) {
      const isRatingMatch =
        activeRatingFilter === null || review.rating === activeRatingFilter;

      const isTypeMatch =
        activeTypeFilter === "all" || review.type === activeTypeFilter;

      return isRatingMatch && isTypeMatch;
    });
  }

  const currentFilteredReviews = getFilteredReviews();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Phản hồi khách hàng
          </h1>
          <p className="text-gray-500 mt-1">
            Theo dõi và quản lý các đánh giá từ khách hàng
          </p>
        </div>
      </div>

      {}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={function () {
                  setActiveRatingFilter(null);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeRatingFilter === null ? "bg-[#ee4d2d] text-white shadow-sm" : "bg-gray-50 hover:bg-gray-100 text-gray-600"}`}
              >
                Tất cả đánh giá
              </button>
              {[5, 4, 3, 2, 1].map(function (stars) {
                return (
                  <button
                    key={stars}
                    onClick={function () {
                      setActiveRatingFilter(stars);
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeRatingFilter === stars ? "bg-yellow-100 text-yellow-700 border border-yellow-200" : "bg-gray-50 hover:bg-gray-100 text-gray-600"}`}
                  >
                    {stars}{" "}
                    <Star
                      className={`w-3.5 h-3.5 ${activeRatingFilter === stars ? "fill-yellow-500 text-yellow-500" : "fill-none"}`}
                    />
                  </button>
                );
              })}
            </div>
            {}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-400">
              Loại đánh giá:
            </span>
            <div className="flex gap-2">
              <button
                onClick={function () {
                  setActiveTypeFilter("order");
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTypeFilter === "order" ? "bg-blue-600 text-white shadow-md" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
              >
                Đơn hàng
              </button>
            </div>
          </div>
        </div>

        {}
        <div className="divide-y divide-gray-50">
          {isPageLoading ? (
            <div className="p-16 text-center text-gray-400 animate-pulse">
              Đang tải danh sách đánh giá...
            </div>
          ) : currentFilteredReviews.length === 0 ? (
            <div className="p-16 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 text-gray-100 mx-auto mb-4" />
              <p className="font-medium">
                Chưa có đánh giá nào phù hợp với bộ lọc.
              </p>
            </div>
          ) : (
            currentFilteredReviews.map(function (review) {
              return (
                <div
                  key={review.reviewid}
                  className="p-6 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row gap-8">
                    {}
                    <div className="w-full lg:w-1/4 space-y-5 border-r-0 lg:border-r border-gray-100 pr-0 lg:pr-8">
                      <div className="flex items-center gap-2">
                        {review.type === "order" ? (
                          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                            Phân loại: Đơn hàng
                          </span>
                        ) : (
                          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100">
                            Phân loại: Món ăn
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5 text-gray-900 font-bold mb-1.5">
                          <User className="w-4 h-4 text-gray-300" />
                          <span>
                            {review.orders?.users?.fullname || "Ẩn danh"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 pl-6.5 truncate">
                          {review.orders?.users?.phoneNumber ||
                            "Chưa cung cấp SĐT"}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5 text-gray-700 font-semibold mb-1.5 text-sm">
                          <ShoppingBag className="w-4 h-4 text-gray-300" />
                          <span className="text-[#ee4d2d]">
                            #{review.orderid?.substring(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[10px] text-gray-400 pl-6.5 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(
                            review.orders?.ordertime || review.createdat,
                          ).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </div>

                    {}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map(function (star) {
                            return (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${star <= review.rating ? "fill-yellow-400 text-yellow-400 drop-shadow-sm" : "fill-gray-100 text-gray-200"}`}
                              />
                            );
                          })}
                        </div>
                        <span className="text-xs text-gray-400 font-medium italic">
                          Gửi lúc:{" "}
                          {new Date(review.createdat).toLocaleString("vi-VN")}
                        </span>
                      </div>

                      {/* Media Display (for order reviews with mediaUrl or food reviews) */}
                      {review.mediaUrl && (
                        <div className="mb-5">
                          <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                            <img
                              src={review.mediaUrl}
                              alt="Review Image"
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                      )}

                      {review.type === "food" && review.fooditems && (
                        <div className="flex items-center gap-4 mb-5 p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                            {review.fooditems.foodimageurl ? (
                              <img
                                src={review.fooditems.foodimageurl}
                                alt={review.fooditems.foodname}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200" />
                            )}
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                              Sản phẩm đánh giá
                            </p>
                            <p className="text-base font-bold text-gray-900">
                              {review.fooditems.foodname}
                            </p>
                          </div>
                        </div>
                      )}

                      {}
                      <div className="bg-[#ee4d2d]/5 rounded-3xl p-6 text-gray-700 relative border border-[#ee4d2d]/10 group hover:bg-[#ee4d2d]/10 transition-all duration-300">
                        <MessageSquare className="absolute top-5 right-5 w-5 h-5 text-[#ee4d2d]/20 group-hover:scale-125 group-hover:text-[#ee4d2d]/40 transition-all" />
                        {review.comment ? (
                          <p className="pr-10 leading-relaxed text-base font-medium text-gray-800">
                            "{review.comment}"
                          </p>
                        ) : (
                          <p className="pr-10 leading-relaxed text-sm italic text-gray-400">
                            Khách hàng không để lại nhận xét bằng lời.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
