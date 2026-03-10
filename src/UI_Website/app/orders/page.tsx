"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  Package,
  ChevronRight,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  Truck,
  Receipt,
} from "lucide-react";

// Mock data for orders
const MOCK_ORDERS = [
  {
    id: "SHOPEEFOOD_827163",
    date: "09/03/2026",
    total: 125000,
    status: "SHIPPING",
    statusLabel: "Đang giao",
    items: ["Phở Bò (2)", "Nước Chanh (1)"],
    shopName: "Phở Gia Truyền",
  },
  {
    id: "SHOPEEFOOD_192837",
    date: "08/03/2026",
    total: 85000,
    status: "DELIVERED",
    statusLabel: "Đã giao",
    items: ["Cơm Tấm Sườn (1)", "Trà Đá (1)"],
    shopName: "Cơm Tấm Bụi",
  },
  {
    id: "SHOPEEFOOD_456789",
    date: "07/03/2026",
    total: 210000,
    status: "DELIVERED",
    statusLabel: "Đã giao",
    items: ["Pizza Hải Sản (1)", "Coca Cola (2)"],
    shopName: "The Pizza Company",
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = MOCK_ORDERS.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shopName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SHIPPING":
        return "text-blue-500 bg-blue-50 border-blue-100";
      case "DELIVERED":
        return "text-green-500 bg-green-50 border-green-100";
      case "PREPARING":
        return "text-orange-500 bg-orange-50 border-orange-100";
      default:
        return "text-gray-500 bg-gray-50 border-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SHIPPING":
        return <Truck className="w-4 h-4" />;
      case "DELIVERED":
        return <CheckCircle2 className="w-4 h-4" />;
      case "PREPARING":
        return <Package className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  function formatVNDPrice(amount: number) {
    return amount.toLocaleString("vi-VN", {
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
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => router.push("/order-status")}
                className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#ee4d2d]/20 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                  <Receipt className="w-20 h-20" />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-4 rounded-2xl border ${getStatusColor(order.status)} transform group-hover:rotate-6 transition-transform`}
                    >
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-lg group-hover:text-[#ee4d2d] transition-colors">
                        {order.shopName}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                        <span className="uppercase tracking-wider">
                          {order.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest flex items-center gap-2 ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.statusLabel}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-50 relative z-10">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-300" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                        Ngày đặt
                      </p>
                      <p className="font-bold text-gray-700">{order.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Receipt className="w-5 h-5 text-gray-300" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                        Sản phẩm
                      </p>
                      <p className="font-bold text-gray-700 truncate max-w-[150px]">
                        {order.items.join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-3">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                        Tổng cộng
                      </p>
                      <p className="font-black text-xl text-[#ee4d2d]">
                        {formatVNDPrice(order.total)}
                      </p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-[#ee4d2d] group-hover:text-white transition-all transform group-hover:translate-x-1">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-20 rounded-3xl border border-gray-100 text-center flex flex-col items-center gap-4">
              <div className="p-6 bg-gray-50 rounded-full">
                <Search className="w-12 h-12 text-gray-200" />
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase">
                Không tìm thấy đơn hàng
              </h3>
              <p className="text-gray-400 font-medium max-w-xs">
                Thử tìm kiếm với mã đơn hàng hoặc tên quán khác bạn nhé.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
