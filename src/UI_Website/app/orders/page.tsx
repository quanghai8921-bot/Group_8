"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getUserOrders, Order } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import {
  Package,
  ChevronRight,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  Truck,
  Receipt,
  X,
} from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      getUserOrders(userId)
        .then((data) => {
          setOrders(data || []);
        })
        .catch(err => console.error("Error fetching orders:", err))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const filteredOrders = orders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.storeName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0:
        return { label: "Đã hủy", color: "text-red-500 bg-red-50 border-red-100", icon: <X className="w-4 h-4" /> };
      case 1:
        return { label: "Chờ xác nhận", color: "text-gray-500 bg-gray-50 border-gray-100", icon: <Clock className="w-4 h-4" /> };
      case 2:
        return { label: "Đang chuẩn bị", color: "text-orange-500 bg-orange-50 border-orange-100", icon: <Package className="w-4 h-4" /> };
      case 3:
        return { label: "Đang giao", color: "text-blue-500 bg-blue-50 border-blue-100", icon: <Truck className="w-4 h-4" /> };
      case 4:
        return { label: "Thành công", color: "text-green-500 bg-green-50 border-green-100", icon: <CheckCircle2 className="w-4 h-4" /> };
      default:
        return { label: "N/A", color: "text-gray-500 bg-gray-50 border-gray-100", icon: <Clock className="w-4 h-4" /> };
    }
  };

  function formatVNDPrice(amount: number) {
    return (amount || 0).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-12 px-4 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              Đơn hàng của tôi
            </h1>
            <p className="text-gray-500 font-medium">
              Theo dõi và quản lý các đơn hàng bạn đã đặt
            </p>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng, cửa hàng..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ee4d2d] focus:border-transparent transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="h-10 w-10 border-4 border-orange-100 border-t-[#ee4d2d] rounded-full animate-spin" />
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Đang tải đơn hàng...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.orderStatus);
              return (
                <div
                  key={order.orderId}
                  onClick={() => router.push(`/order-status?id=${order.orderId}`)}
                  className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#ee4d2d]/20 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                    <Receipt className="w-20 h-20" />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-4 rounded-2xl border ${statusInfo.color} transform group-hover:rotate-6 transition-transform`}
                      >
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 text-lg group-hover:text-[#ee4d2d] transition-colors">
                          {order.storeName || "Cửa hàng ShopeeFood"}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                          <span className="uppercase tracking-wider">
                            #{order.orderId}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest flex items-center gap-2 ${statusInfo.color}`}
                    >
                      {statusInfo.icon}
                      {statusInfo.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-50 relative z-10">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-300" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                          Ngày đặt
                        </p>
                        <p className="font-bold text-gray-700">
                          {new Date(order.orderTime).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Receipt className="w-5 h-5 text-gray-300" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                          Sản phẩm
                        </p>
                        <p className="font-bold text-gray-700 truncate max-w-[150px]">
                          {order.orderItemsSummary || ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-3">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                          Tổng cộng
                        </p>
                        <p className="font-black text-xl text-[#ee4d2d]">
                          {formatVNDPrice(order.finalAmount)}
                        </p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-[#ee4d2d] group-hover:text-white transition-all transform group-hover:translate-x-1">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-20 rounded-3xl border border-gray-100 text-center flex flex-col items-center gap-4">
              <div className="p-6 bg-gray-50 rounded-full">
                <Search className="w-12 h-12 text-gray-200" />
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase">
                Không tìm thấy đơn hàng
              </h3>
              <p className="text-gray-400 font-medium max-w-xs">
                Bạn chưa có đơn hàng nào hoặc không tìm thấy kết quả phù hợp.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
