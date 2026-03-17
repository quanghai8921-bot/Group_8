"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle2, CreditCard } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { getMerchantOrders, updateOrderStatus, handleApiError, Order } from "@/lib/apiClient";
import { useMerchant } from "@/hooks/useMerchant";

export default function OrderManagement() {
  const { merchantId, isLoading: isMerchantLoading, error: merchantError } = useMerchant();
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;

  function getStatusDisplayName(statusValue: number) {
    const statusMap: Record<number, string> = {
      0: "cancelled",
      1: "pending",
      2: "preparing",
      3: "delivering",
      4: "completed",
    };
    return statusMap[statusValue] || "pending";
  }

  async function fetchOrdersFromServer() {
    if (!merchantId) return;
    try {
      const orders = await getMerchantOrders(merchantId);
      setOrderList(orders || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(function onComponentMount() {
    if (merchantId) {
      fetchOrdersFromServer();
      const pollingInterval = setInterval(fetchOrdersFromServer, 10000); // 10s polling
      return function onComponentUnmount() {
        clearInterval(pollingInterval);
      };
    }
  }, [merchantId]);

  async function handleStatusChange(orderId: string, targetStatusNum: number) {
    try {
      const updated = await updateOrderStatus(orderId, targetStatusNum);
      setOrderList(previousList => 
        previousList.map(order => 
          order.orderId === orderId ? updated : order
        )
      );
      alert(`Đã cập nhật trạng thái đơn hàng #${orderId}`);
    } catch (error: any) {
      const apiErr = handleApiError(error);
      alert(apiErr.message);
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
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Quản lý Đơn hàng</h1>
          <p className="text-gray-500 font-medium">Theo dõi và xử lý đơn hàng thời gian thực từ Database</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30">
          <h3 className="font-black text-gray-900 text-lg uppercase tracking-widest">Đơn hàng đến</h3>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
               <div className="h-10 w-10 border-4 border-orange-100 border-t-[#ee4d2d] rounded-full animate-spin" />
               <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Đang tải đơn hàng...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                  <th className="px-8 py-4">Mã đơn</th>
                  <th className="px-8 py-4">Khách hàng</th>
                  <th className="px-8 py-4">Thanh toán</th>
                  <th className="px-8 py-4">Tổng tiền</th>
                  <th className="px-8 py-4">Thời gian</th>
                  <th className="px-8 py-4 text-center">Trạng thái</th>
                  <th className="px-8 py-4 text-right">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {paginatedOrders.map((order) => {
                  return (
                    <tr key={order.orderId} className="hover:bg-gray-50/50 transition-all group">
                      <td className="px-8 py-6">
                        <span className="font-black text-gray-900">{order.orderId}</span>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 overflow-hidden border border-orange-100 shrink-0">
                              <img
                                src={order.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${order.orderId}`}
                                alt="User"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-bold text-gray-700">{order.customerName || "Khách hàng"}</span>
                          </div>
                          {order.contactPhone && (
                            <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">📞 {order.contactPhone}</span>
                          )}
                          {order.customerNote && (
                            <span className="text-[9px] text-[#ee4d2d] italic">📝 {order.customerNote}</span>
                          )}
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex items-center gap-1.5 text-[#ee4d2d] font-black text-[10px] uppercase tracking-widest">
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{order.paymentMethod || "COD"}</span>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <span className="font-black text-gray-900">
                          {order.finalAmount.toLocaleString()}đ
                        </span>
                      </td>

                      <td className="px-8 py-6">
                        <span className="text-xs text-gray-500 font-bold">
                          {new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="px-8 py-6 text-center">
                        <div className="flex justify-center">
                          {order.orderStatus === 0 && <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-100 text-red-600 border border-red-200">Đã hủy</span>}
                          {order.orderStatus === 1 && <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-500">Chờ xác nhận</span>}
                          {order.orderStatus === 2 && <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-600">Đang chuẩn bị</span>}
                          {order.orderStatus === 3 && <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-100 text-blue-600">Đang giao</span>}
                          {order.orderStatus === 4 && <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-100 text-green-600">Thành công</span>}
                        </div>
                      </td>

                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          {order.orderStatus === 1 && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStatusChange(order.orderId, 2)}
                                className="h-10 px-4 text-[10px] font-black uppercase tracking-widest bg-[#ee4d2d] text-white rounded-xl shadow-lg shadow-orange-100 hover:bg-[#d73211] transition-all active:scale-95"
                              >
                                Xác nhận
                              </button>
                              <button
                                onClick={() => {
                                  if(confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
                                    handleStatusChange(order.orderId, 0);
                                  }
                                }}
                                className="h-10 px-4 text-[10px] font-black uppercase tracking-widest bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-all active:scale-95"
                              >
                                Hủy đơn
                              </button>
                            </div>
                          )}
                          {order.orderStatus === 2 && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStatusChange(order.orderId, 3)}
                                className="h-10 px-4 text-[10px] font-black uppercase tracking-widest bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all active:scale-95"
                              >
                                Giao hàng
                              </button>
                              <button
                                onClick={() => {
                                  if(confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
                                    handleStatusChange(order.orderId, 0);
                                  }
                                }}
                                className="h-10 px-4 text-[10px] font-black uppercase tracking-widest bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-all active:scale-95"
                              >
                                Hủy đơn
                              </button>
                            </div>
                          )}
                          {order.orderStatus === 3 && (
                             <div className="h-10 flex items-center gap-2 text-blue-500 px-4">
                                <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Chờ khách nhận hàng</span>
                             </div>
                          )}
                          {order.orderStatus >= 4 && (
                             <div className="h-10 flex items-center gap-2 text-green-500 px-4">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Thành công</span>
                             </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {orderList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Không có đơn hàng nào</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
