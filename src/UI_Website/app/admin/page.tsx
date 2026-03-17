"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Store,
  ShoppingBag,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import apiClient from "@/lib/apiClient";

/**
 * Trang tổng quan Admin Dashboard
 */
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMerchants: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/admin/stats');
        if (response.data && response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return (val / 1000000000).toFixed(1) + " Tỷ";
    if (val >= 1000000) return (val / 1000000).toFixed(1) + " Triệu";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 bg-white rounded-3xl shadow-sm border border-gray-100 italic text-gray-400">
      Đang tải dữ liệu hệ thống...
    </div>
  );

  return (
    <div className="space-y-8 font-sans">
      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
              Tổng Người Dùng
            </p>
            <h3 className="text-3xl font-black text-gray-900 mt-2 tracking-tight">
              {stats.totalUsers.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 rounded-2xl">
              <Store className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
              Đối Tác Merchant
            </p>
            <h3 className="text-3xl font-black text-gray-900 mt-2 tracking-tight">
              {stats.totalMerchants.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 rounded-2xl">
              <ShoppingBag className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
              Đơn Hàng Toàn Sàn
            </p>
            <h3 className="text-3xl font-black text-gray-900 mt-2 tracking-tight">
              {stats.totalOrders.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 rounded-2xl">
              <CreditCard className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
              Doanh Thu Hệ Thống
            </p>
            <h3 className="text-3xl font-black text-gray-900 mt-2 tracking-tight">
              {formatCurrency(stats.totalRevenue)}
            </h3>
          </div>
        </div>
      </div>

      {/* Nút hành động nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/admin/applications" className="group">
          <div className="bg-[#ee4d2d] p-8 rounded-[40px] text-white flex justify-between items-center overflow-hidden relative shadow-xl shadow-red-100 transition-transform active:scale-95 cursor-pointer">
            <div className="relative z-10">
              <h4 className="text-2xl font-black mb-1">Duyệt Đơn Merchant</h4>
              <p className="text-white/80 font-medium">Xử lý các hồ sơ đăng ký kinh doanh mới</p>
            </div>
            <ChevronRight className="h-8 w-8 relative z-10 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
            <Store className="absolute right-[-20px] bottom-[-20px] h-40 w-40 text-black/5 z-0" />
          </div>
        </Link>
        <Link href="/admin/customers" className="group">
          <div className="bg-blue-600 p-8 rounded-[40px] text-white flex justify-between items-center overflow-hidden relative shadow-xl shadow-blue-100 transition-transform active:scale-95 cursor-pointer">
            <div className="relative z-10">
              <h4 className="text-2xl font-black mb-1">Quản lý Người dùng</h4>
              <p className="text-white/80 font-medium">Xem danh sách và trạng thái tài khoản</p>
            </div>
            <ChevronRight className="h-8 w-8 relative z-10 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
            <Users className="absolute right-[-20px] bottom-[-20px] h-40 w-40 text-black/5 z-0" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
