"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Store,
  ShoppingBag,
  CreditCard,
  ChevronRight,
} from "lucide-react";

/**
 * Trang tổng quan Admin Dashboard
 */
const AdminDashboard = () => {
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
              1,284
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
              42
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
              56,204
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
              12.8 Tỷ
            </h3>
          </div>
        </div>
      </div>

      {/* Hoạt động gần đây */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Yêu cầu Merchant mới */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-black text-gray-900 tracking-tight">
              Đăng Ký Merchant Mới
            </h4>
            <Link
              href="/admin/merchant-requests"
              className="text-[#ee4d2d] text-sm font-bold hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                    R{i}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      Nhà hàng Hương Việt {i}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">
                      Đăng ký: 2 giờ trước
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[#ee4d2d] transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Người dùng mới */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-black text-gray-900 tracking-tight">
              Người Dùng Mới
            </h4>
            <Link
              href="/admin/customers"
              className="text-[#ee4d2d] text-sm font-bold hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center font-bold text-[#ee4d2d]">
                    U{i}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Khách hàng {i}</p>
                    <p className="text-xs text-gray-400 font-medium">
                      Tham gia: 3 giờ trước
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[#ee4d2d] transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
