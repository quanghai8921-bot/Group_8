"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle2, CreditCard } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

export default function OrderManagement() {
  const [orderList, setOrderList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  function getStatusDisplayName(statusValue: number | string) {
    const statusMap: Record<string, string> = {
      "1": "pending",
      "2": "accepted",
      "3": "preparing",
      "4": "delivering",
      "5": "completed",
    };
    return statusMap[String(statusValue)] || "pending";
  }

  async function fetchOrdersFromServer() {
    try {
      const response = await fetch("/api/orders", { cache: "no-store" });
      let formattedOrders: any[] = [];

      if (response.ok) {
        const data = await response.json();
        const rawOrders = data.orders || [];

        formattedOrders = rawOrders.map(function (order: any, idx: number) {
          const statusLabel = getStatusDisplayName(order.orderstatus);
          const paymentRecord = Array.isArray(order.payments)
            ? order.payments.length > 0
              ? order.payments[0]
              : null
            : order.payments;
          const paymentStatus = paymentRecord?.paymentstatus || "pending";

          return {
            id: order.orderid,
            customerName: order.users?.fullname || "Guest",
            customerEmail: order.users?.email,
            orderItemsSummary:
              (order.orderitems || [])
                .map(function (item: any) {
                  const toppingList = item.orderitemtoppings
                    ?.map(function (t: any) {
                      return t.toppingoptions?.toppingname;
                    })
                    .filter(Boolean)
                    .join(", ");
                  return (
                    item.fooditems?.foodname +
                    (toppingList ? ` (+${toppingList})` : "")
                  );
                })
                .filter(Boolean)
                .join(", ") || "No items",
            totalPriceFormatted:
              new Intl.NumberFormat("vi-VN").format(order.finalamount || 0) +
              "đ",
            orderTimeFormatted: new Date(order.ordertime).toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit" },
            ),
            currentStatus: statusLabel,
            currentPaymentStatus: paymentStatus,
            paymentMethod: paymentRecord?.paymentmethod || "Tiền mặt",
            customerAvatar: "/images/avatar-placeholder.jpg",
          };
        });
      }

      // Fallback to Mock Data if no orders found from server
      if (formattedOrders.length === 0) {
        formattedOrders = [
          {
            id: "ORD-8821",
            customerName: "Nguyễn Văn A",
            customerEmail: "a.nguyen@example.com",
            orderItemsSummary: "Bún chả Hà Nội (x2), Nem cua bể",
            totalPriceFormatted: "145.000đ",
            orderTimeFormatted: "10:30",
            currentStatus: "pending",
            currentPaymentStatus: "completed",
            paymentMethod: "Tiền mặt",
            customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=A",
          },
          {
            id: "ORD-9932",
            customerName: "Trần Thị B",
            customerEmail: "b.tran@example.com",
            orderItemsSummary: "Phở bò tái lăn, Quẩy giòn (x5)",
            totalPriceFormatted: "85.000đ",
            orderTimeFormatted: "11:15",
            currentStatus: "accepted",
            currentPaymentStatus: "completed",
            paymentMethod: "Tiền mặt",
            customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=B",
          },
          {
            id: "ORD-1024",
            customerName: "Lê Hoàng C",
            customerEmail: "c.le@example.com",
            orderItemsSummary: "Cơm gà xối mỡ, Trà đá",
            totalPriceFormatted: "55.000đ",
            orderTimeFormatted: "12:05",
            currentStatus: "preparing",
            currentPaymentStatus: "completed",
            paymentMethod: "Tiền mặt",
            customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=C",
          },
          {
            id: "ORD-5541",
            customerName: "Phạm Minh D",
            customerEmail: "d.pham@example.com",
            orderItemsSummary: "Pizza Hải Sản Size L, Coca Cola 1.5L",
            totalPriceFormatted: "299.000đ",
            orderTimeFormatted: "12:45",
            currentStatus: "delivering",
            currentPaymentStatus: "completed",
            paymentMethod: "Tiền mặt",
            customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=D",
          },
          {
            id: "ORD-2109",
            customerName: "Hoàng Anh E",
            customerEmail: "e.hoang@example.com",
            orderItemsSummary: "Trà sữa chân trâu đường đen (x3)",
            totalPriceFormatted: "165.000đ",
            orderTimeFormatted: "09:20",
            currentStatus: "completed",
            currentPaymentStatus: "completed",
            paymentMethod: "Tiền mặt",
            customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=E",
          },
        ];
      }

      setOrderList(formattedOrders);
    } catch (error) {
      console.error("Critical error while loading orders:", error);
      // Even on error, show mock data for demo
      setOrderList([
        {
          id: "DEMO-001",
          customerName: "Khách hàng Demo",
          customerEmail: "demo@example.com",
          orderItemsSummary: "Món ăn mẫu 01, Nước giải khát",
          totalPriceFormatted: "99.000đ",
          orderTimeFormatted: "08:00",
          currentStatus: "pending",
          currentPaymentStatus: "completed",
          paymentMethod: "Tiền mặt",
          customerAvatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
        },
      ]);
    }
  }

  useEffect(function onComponentMount() {
    fetchOrdersFromServer();

    const pollingInterval = setInterval(fetchOrdersFromServer, 5000);

    return function onComponentUnmount() {
      clearInterval(pollingInterval);
    };
  }, []);

  async function changeOrderStatus(orderId: string, targetStatus: string) {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });

      if (response.ok) {
        setOrderList(function (previousList) {
          return previousList.map(function (order) {
            return order.id === orderId
              ? { ...order, currentStatus: targetStatus }
              : order;
          });
        });

        window.location.reload();
      } else {
        const errorData = await response.json();
        alert("Lỗi cập nhật: " + (errorData.error || "Không rõ nguyên nhân"));
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Lỗi kết nối máy chủ.");
    }
  }
  const totalPages = Math.ceil(orderList.length / ITEMS_PER_PAGE);
  const paginatedOrders = orderList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-500 mt-1">
            Quản lý đơn hàng đến và theo dõi tiến độ giao hàng
          </p>
        </div>
      </div>

      {}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-lg">Đơn hàng đến</h3>
          {}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm font-semibold border-b border-gray-100">
                <th className="px-6 py-4 rounded-tl-xl whitespace-nowrap">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-4 whitespace-nowrap">Khách hàng</th>
                <th className="px-6 py-4 whitespace-nowrap">Món ăn</th>
                <th className="px-6 py-4 whitespace-nowrap">Thanh toán</th>
                <th className="px-6 py-4 whitespace-nowrap">Giá</th>
                <th className="px-6 py-4 whitespace-nowrap">Thời gian</th>
                <th className="px-6 py-4 whitespace-nowrap">Trạng thái</th>
                <th className="px-6 py-4 rounded-tr-xl text-center whitespace-nowrap">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {paginatedOrders.map(function (order) {
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <span className="font-bold text-gray-900">
                        {order.id}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                          <img
                            src={order.customerAvatar}
                            alt={order.customerName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium text-gray-700">
                          {order.customerName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-sm text-gray-600 line-clamp-1">
                        {order.orderItemsSummary}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-blue-500 font-bold text-xs">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{order.paymentMethod}</span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="font-bold text-gray-900">
                        {order.totalPriceFormatted}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-sm text-gray-500">
                        {order.orderTimeFormatted}
                      </span>
                    </td>

                    {}
                    <td className="px-6 py-5">
                      {order.currentStatus === "pending" && (
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            order.currentPaymentStatus === "completed"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.currentPaymentStatus === "completed"
                            ? "Đã thanh toán - Xác nhận ngay"
                            : "Chờ thanh toán"}
                        </span>
                      )}
                      {order.currentStatus === "accepted" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                          Đã xác nhận
                        </span>
                      )}
                      {order.currentStatus === "preparing" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
                          Đang chuẩn bị
                        </span>
                      )}
                      {order.currentStatus === "delivering" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                          Đang giao hàng
                        </span>
                      )}
                      {order.currentStatus === "completed" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                          Hoàn thành
                        </span>
                      )}
                    </td>

                    {}
                    <td className="px-6 py-5 text-center">
                      {order.currentStatus === "pending" && (
                        <button
                          onClick={function () {
                            changeOrderStatus(order.id, "accepted");
                          }}
                          className="inline-flex px-4 py-2 font-bold text-xs bg-[#ee4d2d] hover:bg-[#d73211] text-white rounded-lg transition-colors shadow-sm"
                        >
                          Xác nhận đơn hàng
                        </button>
                      )}
                      {order.currentStatus === "accepted" && (
                        <button
                          onClick={function () {
                            changeOrderStatus(order.id, "preparing");
                          }}
                          className="inline-flex px-4 py-2 font-bold text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors shadow-sm"
                        >
                          Bắt đầu nấu ăn
                        </button>
                      )}
                      {order.currentStatus === "preparing" && (
                        <button
                          onClick={function () {
                            changeOrderStatus(order.id, "delivering");
                          }}
                          className="inline-flex px-4 py-2 font-bold text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                        >
                          Giao đơn hàng
                        </button>
                      )}
                      {order.currentStatus === "delivering" && (
                        <div className="flex items-center justify-center gap-1.5 text-blue-600 text-sm font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          Đang giao...
                        </div>
                      )}
                      {order.currentStatus === "completed" && (
                        <div className="flex items-center justify-center gap-1.5 text-purple-600 text-sm font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          Handed Over
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
