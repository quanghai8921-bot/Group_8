"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Reports() {
  const [businessStatistics, setBusinessStatistics] = useState<any>(null);

  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessStatistics = async () => {
      try {
        const response = await apiClient.get("/admin/stats");
        if (response.data && response.data.success) {
          setBusinessStatistics(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load business statistics:", error);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchBusinessStatistics();
  }, []);

  function formatCurrencyToVND(amount: number) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  if (isDataLoading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        Loading business reports...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Reports</h1>
          <p className="text-gray-500 mt-1">
            Overview of your business performance metrics
          </p>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-red-100 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#ee4d2d]">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Total Revenue
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {formatCurrencyToVND(businessStatistics?.totalRevenue || 0)}
            </h3>
          </div>
        </div>

        {}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-blue-100 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Total Orders
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {businessStatistics?.totalOrders || 0}
            </h3>
          </div>
        </div>

        {}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-green-100 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Avg. Order Value
            </p>
            <h3 className="text-2xl font-bold text-gray-900">
              {formatCurrencyToVND(businessStatistics?.averageOrderValue || 0)}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
