"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  UtensilsCrossed,
  ShoppingBag,
  BarChart3,
  Star,
  Ticket,
  LogOut,
  Bell,
} from "lucide-react";
import { useMerchant } from "@/hooks/useMerchant";

// UI Components
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { merchantId, isLoading: isMerchantLoading, error: merchantError } = useMerchant();
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const [merchantInfo, setMerchantInfo] = useState({
    storeName: "Đang tải...",
    openTime: "08:00",
    closeTime: "22:00",
    shopType: "Food" as "Food" | "Drink",
  });

  const [userFullName, setUserFullName] = useState("Người dùng");

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserFullName(user.fullName || user.FullName || "Chủ quán");
    }
  }, []);

  useEffect(() => {
    async function fetchMerchantData() {
        if (merchantId) {
            try {
                const response = await fetch(`http://localhost:4040/api/merchants/${merchantId}`);
                const result = await response.json();
                if (result.success && result.data) {
                    setMerchantInfo({
                        storeName: result.data.storeName,
                        openTime: result.data.openTime || "08:00",
                        closeTime: result.data.closeTime || "22:00",
                        shopType: result.data.shopType === "Drink" ? "Drink" : "Food",
                    });
                }
            } catch (err) {
                console.error("Error fetching merchant details in layout", err);
            }
        }
    }
    fetchMerchantData();
  }, [merchantId]);


  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
    router.push("/login");
  };

  const isPathActive = (path: string) => pathname === path;

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-sans relative overflow-x-hidden">
      <aside
        className={`fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out group
                    ${isSidebarHovered ? "w-72 shadow-2xl translate-x-0" : "w-20 lg:w-20 -translate-x-full lg:translate-x-0"}
                `}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        <div className="p-4 flex flex-col h-full">
          <Link href="/merchant/menu" className="flex items-center gap-3 mb-10 overflow-hidden">
            <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-100 transition-transform hover:scale-105 shrink-0">
              <Image src="/Logo.jpg" alt="ShopeeFood Admin" width={isSidebarHovered ? 140 : 40} height={35} className="object-contain" priority />
            </div>
          </Link>

          <nav className="space-y-2">
            <SidebarLink href="/merchant/menu" icon={<UtensilsCrossed className="h-5 w-5" />} label="Quản lý Menu" isActive={isPathActive("/merchant/menu")} isExpanded={isSidebarHovered} />
            <SidebarLink href="/merchant/orders" icon={<ShoppingBag className="h-5 w-5" />} label="Quản lý Đơn hàng" isActive={isPathActive("/merchant/orders")} isExpanded={isSidebarHovered} />
            <SidebarLink href="/merchant/reports" icon={<BarChart3 className="h-5 w-5" />} label="Báo cáo Doanh thu" isActive={isPathActive("/merchant/reports")} isExpanded={isSidebarHovered} />
            <SidebarLink href="/merchant/reviews" icon={<Star className="h-5 w-5" />} label="Đánh giá Khách hàng" isActive={isPathActive("/merchant/reviews")} isExpanded={isSidebarHovered} />
            <SidebarLink href="/merchant/vouchers" icon={<Ticket className="h-5 w-5" />} label="Quản lý Voucher" isActive={isPathActive("/merchant/vouchers")} isExpanded={isSidebarHovered} />
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-100">
            <div className={`flex items-center gap-3 p-3 rounded-xl bg-orange-50 mb-4 border border-orange-100 transition-all ${!isSidebarHovered ? "justify-center p-2" : ""}`}>
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
                <AvatarFallback className="bg-orange-100 text-[#ee4d2d] font-black tracking-tighter">
                  {userFullName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isSidebarHovered && (
                <div className="flex-1 min-w-0 transition-opacity duration-300">
                  <p className="text-sm font-black text-gray-900 truncate">{userFullName}</p>
                  <p className="text-xs text-gray-500 font-medium truncate">{merchantInfo.storeName}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#ee4d2d] transition-colors w-full px-2 ${!isSidebarHovered ? "justify-center" : ""}`}
            >
              <LogOut className="h-4 w-4" />
              {isSidebarHovered && <span className="transition-opacity duration-300">Đăng xuất khỏi hệ thống</span>}
            </button>
          </div>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarHovered ? "lg:pl-72" : "lg:pl-20"}`}>
        <header className="bg-white px-8 py-5 flex items-center justify-between border-b border-gray-50 sticky top-0 z-30">
          <div className="flex-1" />
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 bg-[#FDFDFD]">{children}</main>

      </div>
    </div>
  );
}
