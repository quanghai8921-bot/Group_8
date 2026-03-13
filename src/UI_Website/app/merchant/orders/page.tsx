"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle2, CreditCard } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { getMockOrders } from "@/lib/apiClient";

interface Order {
  OrderId: string;
  UserId: string;
  MerchantId: string;
  OrderDate: string;
  TotalAmount: number;
  OrderStatus: number; // 1: Pending, 2: Accepted, 3: Preparing, 4: Delivering, 5: Completed
  PaymentStatus: number; // 1: Completed, 0: Pending
  FullName?: string;
  AvatarUrl?: string;
  OrderItemsSummary?: string;
  PaymentMethod?: string;
}

export default function OrderManagement() {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  function getStatusDisplayName(statusValue: number) {
    const statusMap: Record<number, string> = {
      1: "pending",
      2: "accepted",
      3: "preparing",
      4: "delivering",
      5: "completed",
    };
    return statusMap[statusValue] || "pending";
  }

  async function fetchOrdersFromServer() {
    try {
      const formattedOrders = await getMockOrders();
      setOrderList(formattedOrders);
    } catch (error) {
      console.error("Critical error while loading orders:", error);
      // Fallback/Demo data
      setOrderList([
        {
          OrderId: "ORD-001",
          UserId: "U001",
          MerchantId: "M001",
          FullName: "Khách hàng Demo",
          OrderItemsSummary: "Món ăn mẫu 01, Nước giải khát",
          TotalAmount: 99000,
          OrderDate: new Date().toISOString(),
          OrderStatus: 1,
          PaymentStatus: 1,
          PaymentMethod: "Tiền mặt",
          AvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
        },
      ]);
    }
  }

  useEffect(function onComponentMount() {
    fetchOrdersFromServer();
    const pollingInterval = setInterval(fetchOrdersFromServer, 10000); // 10s polling
    return function onComponentUnmount() {
      clearInterval(pollingInterval);
    };
  }, []);

  async function changeOrderStatus(orderId: string, targetStatusNum: number) {
    try {
      // Logic would typically be a PUT/PATCH call
      setOrderList(previousList => 
        previousList.map(order => 
          order.OrderId === orderId ? { ...order, OrderStatus: targetStatusNum } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }

  const totalPages = Math.ceil(orderList.length / ITEMS_PER_PAGE);
  const paginatedOrders = orderList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-500 mt-1">
            Quản lý đơn hàng đến và theo dõi tiến độ giao hàng
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-lg">Đơn hàng đến</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm font-semibold border-b border-gray-100">
                <th className="px-6 py-4 whitespace-nowrap">Mã đơn hàng</th>
                <th className="px-6 py-4 whitespace-nowrap">Khách hàng</th>
                <th className="px-6 py-4 whitespace-nowrap">Món ăn</th>
                <th className="px-6 py-4 whitespace-nowrap">Thanh toán</th>
                <th className="px-6 py-4 whitespace-nowrap">Giá</th>
                <th className="px-6 py-4 whitespace-nowrap">Thời gian</th>
                <th className="px-6 py-4 whitespace-nowrap">Trạng thái</th>
                <th className="px-6 py-4 text-center whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {paginatedOrders.map((order) => {
                const statusName = getStatusDisplayName(order.OrderStatus);
                return (
                  <tr key={order.OrderId} className="hover:bg-gray-50/50 transition-all">
                    <td className="px-6 py-5">
                      <span className="font-bold text-gray-900">{order.OrderId}</span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                          <img
                            src={order.AvatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${order.FullName}`}
                            alt={order.FullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium text-gray-700">{order.FullName}</span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-sm text-gray-600 line-clamp-1">
                        {order.OrderItemsSummary}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-blue-500 font-bold text-xs uppercase tracking-tight">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{order.PaymentMethod || "Tiền mặt"}</span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="font-bold text-gray-900">
                        {(order.TotalAmount || 0).toLocaleString()}đ
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-sm text-gray-500">
                        {order.OrderDate ? new Date(order.OrderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      {order.OrderStatus === 1 && (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${order.PaymentStatus === 1 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                          {order.PaymentStatus === 1 ? "Đã thanh toán" : "Chờ thanh toán"}
                        </span>
                      )}
                      {order.OrderStatus === 2 && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-green-100 text-green-700">Đã xác nhận</span>
                      )}
                      {order.OrderStatus === 3 && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-yellow-100 text-yellow-700">Đang chuẩn bị</span>
                      )}
                      {order.OrderStatus === 4 && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-blue-100 text-blue-700">Đang giao hàng</span>
                      )}
                      {order.OrderStatus === 5 && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-purple-100 text-purple-700">Hoàn thành</span>
                      )}
                    </td>

                    <td className="px-6 py-5 text-center">
                      {order.OrderStatus === 1 && (
                        <button
                          onClick={() => changeOrderStatus(order.OrderId, 2)}
                          className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-[#ee4d2d] text-white rounded-lg shadow-sm hover:bg-[#d73211] transition-all"
                        >
                          Xác nhận
                        </button>
                      )}
                      {order.OrderStatus === 2 && (
                        <button
                          onClick={() => changeOrderStatus(order.OrderId, 3)}
                          className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-yellow-500 text-white rounded-lg shadow-sm hover:bg-yellow-600 transition-all"
                        >
                          Chuẩn bị
                        </button>
                      )}
                      {order.OrderStatus === 3 && (
                        <button
                          onClick={() => changeOrderStatus(order.OrderId, 4)}
                          className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition-all"
                        >
                          Giao hàng
                        </button>
                      )}
                      {(order.OrderStatus === 4 || order.OrderStatus === 5) && (
                        <div className={`flex items-center justify-center gap-1.5 text-xs font-bold ${order.OrderStatus === 5 ? "text-purple-600" : "text-blue-600"}`}>
                          <CheckCircle2 className="w-4 h-4" />
                          {order.OrderStatus === 5 ? "Hoàn thành" : "Đang giao..."}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
