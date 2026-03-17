"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/apiClient";

export default function OrderManagement() {
  const [orderList, setOrderList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  function getStatusDisplayName(statusValue: number | string) {
    const statusMap: Record<string, string> = {
      "1": "pending",
      "2": "preparing",
      "3": "delivering",
      "4": "completed",
    };
    return statusMap[String(statusValue)] || "pending";
  }

  async function fetchOrdersFromServer() {
    try {
      const response = await apiClient.get("/orders");

      if (response.data && response.data.success) {
        const rawOrders = response.data.data || [];

        const formattedOrders = rawOrders.map(function (order: any) {
          const statusLabel = getStatusDisplayName(order.orderStatus);

          return {
            id: order.orderId,
            customerName: order.customerName || "Khách",
            customerEmail: order.customerEmail,
            orderItemsSummary: order.orderItemsSummary || "Đơn hàng hệ thống",
            totalPriceFormatted:
              new Intl.NumberFormat("vi-VN").format(order.finalAmount || 0) + "đ",
            orderTimeFormatted: new Date(order.orderTime).toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit" },
            ),
            currentStatus: statusLabel,
            currentPaymentStatus: "completed", // Simplification for now
            customerAvatar: "/images/avatar-placeholder.jpg",
          };
        });

        setOrderList(formattedOrders);
      }
    } catch (error) {
      console.error("Critical error while loading orders:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(function onComponentMount() {
    fetchOrdersFromServer();

    const pollingInterval = setInterval(fetchOrdersFromServer, 10000);

    return function onComponentUnmount() {
      clearInterval(pollingInterval);
    };
  }, []);

  async function changeOrderStatus(orderId: string, targetStatus: string) {
    const statusMap: Record<string, number> = {
      "pending": 1,
      "preparing": 2,
      "delivering": 3,
      "completed": 4,
    };
    
    try {
      const response = await apiClient.patch(`/orders/${orderId}/status`, { 
        status: statusMap[targetStatus] 
      });

      if (response.data && response.data.success) {
        setOrderList(function (previousList) {
          return previousList.map(function (order) {
            return order.id === orderId
              ? { ...order, currentStatus: targetStatus }
              : order;
          });
        });
      } else {
        alert("Lỗi cập nhật: " + (response.data.message || "Không rõ nguyên nhân"));
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Lỗi kết nối máy chủ.");
    }
  }

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 bg-white rounded-3xl shadow-sm border border-gray-100 italic text-gray-400">
      Đang tải danh sách đơn hàng...
    </div>
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
          <p className="text-gray-500 mt-1">
            Theo dõi và cập nhật trạng thái các đơn hàng trên toàn hệ thống
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-lg">Đơn hàng mới nhất</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm font-semibold border-b border-gray-100">
                <th className="px-6 py-4 rounded-tl-xl whitespace-nowrap">Mã đơn</th>
                <th className="px-6 py-4 whitespace-nowrap">Khách hàng</th>
                <th className="px-6 py-4 whitespace-nowrap">Tổng tiền</th>
                <th className="px-6 py-4 whitespace-nowrap">Thời gian</th>
                <th className="px-6 py-4 whitespace-nowrap">Trạng thái</th>
                <th className="px-6 py-4 rounded-tr-xl text-center whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {orderList.map(function (order) {
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <span className="font-bold text-gray-900">{order.id}</span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                          {order.customerName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">{order.customerName}</span>
                          <span className="text-[10px] text-gray-400">{order.customerEmail}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="font-bold text-[#ee4d2d]">{order.totalPriceFormatted}</span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-sm text-gray-500">{order.orderTimeFormatted}</span>
                    </td>

                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.currentStatus === 'completed' ? 'bg-green-50 text-green-600' :
                        order.currentStatus === 'pending' ? 'bg-orange-50 text-orange-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {order.currentStatus}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center gap-2">
                        {order.currentStatus === "pending" && (
                          <button
                            onClick={() => changeOrderStatus(order.id, "preparing")}
                            className="px-3 py-1.5 bg-[#ee4d2d] text-white text-[10px] font-bold rounded-lg uppercase"
                          >
                            Duyệt
                          </button>
                        )}
                        {order.currentStatus === "preparing" && (
                          <button
                            onClick={() => changeOrderStatus(order.id, "delivering")}
                            className="px-3 py-1.5 bg-blue-500 text-white text-[10px] font-bold rounded-lg uppercase"
                          >
                            Giao hàng
                          </button>
                        )}
                        {order.currentStatus === "delivering" && (
                          <div className="flex items-center gap-1 text-blue-500 text-[10px] font-bold uppercase animate-pulse">
                            Đang giao
                          </div>
                        )}
                        {order.currentStatus === "completed" && (
                          <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold uppercase">
                            <CheckCircle2 className="w-3 h-3" />
                            Xong
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {orderList.length === 0 && (
            <div className="py-20 text-center text-gray-400 italic">
              Không có đơn hàng nào trong hệ thống
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
