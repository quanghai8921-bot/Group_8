"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  LogOut,
  Bell,
  Settings,
} from "lucide-react";

// UI Components
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

/**
 * Thành phần Link cho Sidebar với hiệu ứng active và thu gọn
 */
const SidebarLink = ({
  href,
  icon,
  label,
  isActive,
  isExpanded,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isExpanded: boolean;
}) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-[#ee4d2d] text-white shadow-lg shadow-red-100 font-bold"
        : "text-gray-600 hover:bg-gray-50 font-medium"
    } ${!isExpanded ? "justify-center px-2" : ""}`}
  >
    <div className="shrink-0">{icon}</div>
    {isExpanded && (
      <span className="truncate transition-opacity duration-300">{label}</span>
    )}
  </Link>
);

/**
 * Layout chính cho khu vực Admin
 * Bao gồm Sidebar mở rộng khi di chuột và Header
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Handlers
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    window.dispatchEvent(new Event("authChange"));
    router.push("/login");
  };

  const isPathActive = (path: string) => pathname === path;

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-sans relative overflow-x-hidden">
      {/* Sidebar với hiệu ứng Reveal khi di chuột */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out group
                    ${isSidebarHovered ? "w-72 shadow-2xl translate-x-0" : "w-20 lg:w-20 -translate-x-full lg:translate-x-0"}
                `}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        {/* Vùng kích hoạt hover ẩn */}
        {!isSidebarHovered && (
          <div className="absolute top-0 right-[-20px] w-10 h-full cursor-pointer z-[-1]" />
        )}

        <div className="p-4 flex flex-col h-full">
          {/* Logo */}
          <Link
            href="/admin"
            className="flex items-center gap-3 mb-10 overflow-hidden"
          >
            <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-100 transition-transform hover:scale-105 shrink-0">
              <Image
                src="/Logo.jpg"
                alt="ShopeeFood Admin"
                width={isSidebarHovered ? 140 : 40}
                height={35}
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Menu chính */}
          <nav className="space-y-2">
            <SidebarLink
              href="/admin"
              icon={<LayoutDashboard className="h-5 w-5" />}
              label="Dashboard"
              isActive={isPathActive("/admin")}
              isExpanded={isSidebarHovered}
            />
            <SidebarLink
              href="/admin/customers"
              icon={<Users className="h-5 w-5" />}
              label="Quản lý Khách hàng"
              isActive={isPathActive("/admin/customers")}
              isExpanded={isSidebarHovered}
            />
            <SidebarLink
              href="/admin/applications"
              icon={<Store className="h-5 w-5" />}
              label="Duyệt Merchant"
              isActive={isPathActive("/admin/applications")}
              isExpanded={isSidebarHovered}
            />
          </nav>

          {/* Footer của Sidebar */}
          <div className="mt-auto pt-6 border-t border-gray-100">
            <div
              className={`flex items-center gap-3 p-3 rounded-xl bg-slate-50 mb-4 border border-slate-100 transition-all ${
                !isSidebarHovered ? "justify-center p-2" : ""
              }`}
            >
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
                <AvatarFallback className="bg-slate-200 text-slate-700 font-black tracking-tighter">
                  SA
                </AvatarFallback>
              </Avatar>
              {isSidebarHovered && (
                <div className="flex-1 min-w-0 transition-opacity duration-300">
                  <p className="text-sm font-black text-slate-900 truncate">
                    Hệ Thống Admin
                  </p>
                  <p className="text-xs text-slate-500 font-medium truncate">
                    Site Owner
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#ee4d2d] transition-colors w-full px-2 ${
                !isSidebarHovered ? "justify-center" : ""
              }`}
            >
              <LogOut className="h-4 w-4" />
              {isSidebarHovered && (
                <span className="transition-opacity duration-300">
                  Đăng xuất hệ thống
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Vùng nội dung chính */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarHovered ? "lg:pl-72" : "lg:pl-20"
        }`}
      >
        <header className="bg-white px-8 py-5 flex items-center justify-between border-b border-gray-50 sticky top-0 z-30">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Hệ Thống Quản Trị
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              Portal dành cho chủ sở hữu website
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4"></div>
          </div>
        </header>

        <main className="flex-1 p-8 bg-[#FDFDFD]">{children}</main>
      </div>
    </div>
  );
}
