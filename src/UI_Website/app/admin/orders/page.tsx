"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function OrderManagement() {
  const [orderList, setOrderList] = useState<any[]>([]);

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

      if (response.ok) {
        const data = await response.json();
        const rawOrders = data.orders || [];

        const formattedOrders = rawOrders.map(function (order: any) {
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
            customerAvatar: "/images/avatar-placeholder.jpg",
          };
        });

        setOrderList(formattedOrders);
      }
    } catch (error) {
      console.error("Critical error while loading orders:", error);
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500 mt-1">
            Manage incoming orders and track their delivery progress
          </p>
        </div>
      </div>

      {}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-lg">Incoming Orders</h3>
          {}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm font-semibold border-b border-gray-100">
                <th className="px-6 py-4 rounded-tl-xl whitespace-nowrap">
                  Order ID
                </th>
                <th className="px-6 py-4 whitespace-nowrap">Customer</th>
                <th className="px-6 py-4 whitespace-nowrap">Items</th>
                <th className="px-6 py-4 whitespace-nowrap">Price</th>
                <th className="px-6 py-4 whitespace-nowrap">Time</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 rounded-tr-xl text-center whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {orderList.map(function (order) {
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
                            ? "Paid - Confirm Now"
                            : "Awaiting Payment"}
                        </span>
                      )}
                      {order.currentStatus === "accepted" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                          Confirmed
                        </span>
                      )}
                      {order.currentStatus === "preparing" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
                          Preparing
                        </span>
                      )}
                      {order.currentStatus === "delivering" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                          Delivering
                        </span>
                      )}
                      {order.currentStatus === "completed" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                          Completed
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
                          Confirm Order
                        </button>
                      )}
                      {order.currentStatus === "accepted" && (
                        <button
                          onClick={function () {
                            changeOrderStatus(order.id, "preparing");
                          }}
                          className="inline-flex px-4 py-2 font-bold text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors shadow-sm"
                        >
                          Start Cooking
                        </button>
                      )}
                      {order.currentStatus === "preparing" && (
                        <button
                          onClick={function () {
                            changeOrderStatus(order.id, "delivering");
                          }}
                          className="inline-flex px-4 py-2 font-bold text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
                        >
                          Ship Order
                        </button>
                      )}
                      {order.currentStatus === "delivering" && (
                        <button
                          onClick={function () {
                            changeOrderStatus(order.id, "completed");
                          }}
                          className="inline-flex px-4 py-2 font-bold text-xs bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors shadow-sm"
                        >
                          Finalize
                        </button>
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
    </div>
  );
}
