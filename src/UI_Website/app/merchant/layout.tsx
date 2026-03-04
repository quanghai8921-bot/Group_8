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
    Settings
} from "lucide-react";

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
    isExpanded
}: {
    href: string,
    icon: React.ReactNode,
    label: string,
    isActive: boolean,
    isExpanded: boolean
}) => (
    <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                ? 'bg-[#ee4d2d] text-white shadow-lg shadow-red-100 font-bold'
                : 'text-gray-600 hover:bg-gray-50 font-medium'
            } ${!isExpanded ? 'justify-center px-2' : ''}`}
    >
        <div className="shrink-0">{icon}</div>
        {isExpanded && <span className="truncate transition-opacity duration-300">{label}</span>}
    </Link>
);

/**
 * Layout chính cho khu vực Merchant
 * Bao gồm Sidebar mở rộng khi di chuột, Header và Modal cài đặt cửa hàng
 */
export default function MerchantLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    const [merchantInfo, setMerchantInfo] = useState({
        storeName: "ShopeeFood Restaurant",
        openTime: "08:00",
        closeTime: "22:00",
        shopType: "Food" as "Food" | "Drink"
    });

    const router = useRouter();
    const pathname = usePathname();

    // Khởi tạo thông tin cửa hàng từ Local Storage
    useEffect(() => {
        const savedInfo = localStorage.getItem('merchantInfo');
        if (savedInfo) {
            setMerchantInfo(JSON.parse(savedInfo));
        }
    }, []);

    // Handlers
    const handleSaveSettings = () => {
        localStorage.setItem('merchantInfo', JSON.stringify(merchantInfo));
        setIsSettingsModalOpen(false);
        alert("Cập nhật thông tin cửa hàng thành công!");
    };

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isAdmin');
        window.dispatchEvent(new Event("authChange"));
        router.push('/login');
    };

    const isPathActive = (path: string) => pathname === path;

    return (
        <div className="flex min-h-screen bg-[#FDFDFD] font-sans relative overflow-x-hidden">

            {/* Sidebar với hiệu ứng Reveal khi di chuột */}
            <aside
                className={`fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out group
                    ${isSidebarHovered ? 'w-72 shadow-2xl translate-x-0' : 'w-20 lg:w-20 -translate-x-full lg:translate-x-0'}
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
                    <Link href="/merchant/menu" className="flex items-center gap-3 mb-10 overflow-hidden">
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
                            href="/merchant/menu"
                            icon={<UtensilsCrossed className="h-5 w-5" />}
                            label="Quản lý Menu"
                            isActive={isPathActive('/merchant/menu')}
                            isExpanded={isSidebarHovered}
                        />
                        <SidebarLink
                            href="/merchant/orders"
                            icon={<ShoppingBag className="h-5 w-5" />}
                            label="Quản lý Đơn hàng"
                            isActive={isPathActive('/merchant/orders')}
                            isExpanded={isSidebarHovered}
                        />
                        <SidebarLink
                            href="/merchant/reports"
                            icon={<BarChart3 className="h-5 w-5" />}
                            label="Báo cáo Doanh thu"
                            isActive={isPathActive('/merchant/reports')}
                            isExpanded={isSidebarHovered}
                        />
                        <SidebarLink
                            href="/merchant/reviews"
                            icon={<Star className="h-5 w-5" />}
                            label="Đánh giá Khách hàng"
                            isActive={isPathActive('/merchant/reviews')}
                            isExpanded={isSidebarHovered}
                        />
                        <SidebarLink
                            href="/merchant/vouchers"
                            icon={<Ticket className="h-5 w-5" />}
                            label="Quản lý Voucher"
                            isActive={isPathActive('/merchant/vouchers')}
                            isExpanded={isSidebarHovered}
                        />
                    </nav>

                    {/* Footer của Sidebar */}
                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <div className={`flex items-center gap-3 p-3 rounded-xl bg-orange-50 mb-4 border border-orange-100 transition-all ${!isSidebarHovered ? 'justify-center p-2' : ''
                            }`}>
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
                                <AvatarFallback className="bg-orange-100 text-[#ee4d2d] font-black tracking-tighter">AD</AvatarFallback>
                            </Avatar>
                            {isSidebarHovered && (
                                <div className="flex-1 min-w-0 transition-opacity duration-300">
                                    <p className="text-sm font-black text-gray-900 truncate">Chu Quán</p>
                                    <p className="text-xs text-gray-500 font-medium truncate">Quản trị viên</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#ee4d2d] transition-colors w-full px-2 ${!isSidebarHovered ? 'justify-center' : ''
                                }`}
                        >
                            <LogOut className="h-4 w-4" />
                            {isSidebarHovered && <span className="transition-opacity duration-300">Đăng xuất khỏi hệ thống</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Vùng nội dung chính */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarHovered ? 'lg:pl-72' : 'lg:pl-20'
                }`}>
                <header className="bg-white px-8 py-5 flex items-center justify-between border-b border-gray-50 sticky top-0 z-30">
                    <div className="flex-1" />

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-gray-500 hover:bg-gray-50 hover:text-[#ee4d2d] rounded-full transition-colors">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-[#ee4d2d] rounded-full border-2 border-white animate-pulse"></span>
                            </button>
                            <button
                                onClick={() => setIsSettingsModalOpen(true)}
                                className="p-2 text-gray-500 hover:bg-gray-50 hover:text-[#ee4d2d] rounded-full transition-colors"
                                title="Cài đặt cửa hàng"
                            >
                                <Settings className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 bg-[#FDFDFD]">
                    {children}
                </main>

                {/* Modal Cài đặt Cửa hàng */}
                <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
                    <DialogContent className="sm:max-w-[500px] rounded-3xl p-8 border-none shadow-2xl">
                        <DialogHeader className="mb-4">
                            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">Cài đặt Cửa hàng</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="storeName" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Tên Cửa Hàng</Label>
                                <Input
                                    id="storeName"
                                    value={merchantInfo.storeName}
                                    onChange={(e) => setMerchantInfo({ ...merchantInfo, storeName: e.target.value })}
                                    placeholder="Nhập tên cửa hàng của bạn"
                                    className="h-12 border-2 border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 font-medium transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="openTime" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Giờ Mở Cửa</Label>
                                    <Input
                                        id="openTime"
                                        type="time"
                                        value={merchantInfo.openTime}
                                        onChange={(e) => setMerchantInfo({ ...merchantInfo, openTime: e.target.value })}
                                        className="h-12 border-2 border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 font-medium transition-all"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="closeTime" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Giờ Đóng Cửa</Label>
                                    <Input
                                        id="closeTime"
                                        type="time"
                                        value={merchantInfo.closeTime}
                                        onChange={(e) => setMerchantInfo({ ...merchantInfo, closeTime: e.target.value })}
                                        className="h-12 border-2 border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 font-medium transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="shopType" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Loại Hình Kinh Doanh</Label>
                                <select
                                    id="shopType"
                                    className="flex h-12 w-full rounded-xl border-2 border-gray-100 bg-white px-4 font-medium text-gray-900 focus:border-[#ee4d2d] focus:outline-none focus:ring-0 transition-all cursor-pointer"
                                    value={merchantInfo.shopType}
                                    onChange={(e) => setMerchantInfo({ ...merchantInfo, shopType: e.target.value as "Food" | "Drink" })}
                                >
                                    <option value="Food">Đồ ăn</option>
                                    <option value="Drink">Thức uống</option>
                                </select>
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button
                                onClick={handleSaveSettings}
                                className="w-full h-12 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-black uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-100"
                            >
                                Lưu Thay Đổi
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}


