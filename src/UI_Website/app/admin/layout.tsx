"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    UtensilsCrossed,
    ShoppingBag,
    BarChart3,
    Settings,
    LogOut,
    Bell,
    Star,
    Ticket
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

import Image from "next/image"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    
    const navigationRouter = useRouter();
    const currentPathname = usePathname();

    
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [merchantInformation, setMerchantInformation] = useState({
        storeName: "ShopeeFood Restaurant",
        openTime: "08:00",
        closeTime: "22:00",
        shopType: "Food" as "Food" | "Drink"
    });

    
    useEffect(function loadMerchantInfo() {
        const savedInfo = localStorage.getItem('merchantInfo');
        if (savedInfo) {
            setMerchantInformation(JSON.parse(savedInfo));
        }
    }, []);

    
    function handleSaveMerchantSettings() {
        localStorage.setItem('merchantInfo', JSON.stringify(merchantInformation));
        setIsSettingsModalOpen(false);
        alert("Cập nhật thông tin cửa hàng thành công!");
    }

    
    async function handleUserLogout(event: React.MouseEvent) {
        event.preventDefault();

        
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isAdmin');

        
        window.dispatchEvent(new Event("authChange"));
        navigationRouter.push('/login');
    }

    
    function checkIsPathActive(targetPath: string) {
        return currentPathname === targetPath;
    }

    return (
        <div className="flex min-h-screen bg-[#FDFDFD] font-sans">
            {}
            <aside className="fixed left-0 top-0 z-40 h-screen w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col">
                <div className="p-6">
                    {}
                    <Link href="/admin/menu" className="flex items-center gap-3 mb-10">
                        <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-100 transition-transform hover:scale-105">
                            <Image src="/Logo.jpg" alt="ShopeeFood Admin" width={140} height={35} className="object-contain" priority />
                        </div>
                    </Link>

                    {}
                    <nav className="space-y-1">
                        <Link
                            href="/admin/menu"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${checkIsPathActive('/admin/menu')
                                ? 'bg-[#ee4d2d] text-white shadow-lg shadow-red-100 font-bold'
                                : 'text-gray-600 hover:bg-gray-50 font-medium'
                                }`}
                        >
                            <UtensilsCrossed className="h-5 w-5" />
                            <span>Quản lý Menu</span>
                        </Link>

                        <Link
                            href="/admin/orders"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${checkIsPathActive('/admin/orders')
                                ? 'bg-[#ee4d2d] text-white shadow-lg shadow-red-100 font-bold'
                                : 'text-gray-600 hover:bg-gray-50 font-medium'
                                }`}
                        >
                            <ShoppingBag className="h-5 w-5" />
                            <span>Quản lý Đơn hàng</span>
                        </Link>

                        <Link
                            href="/admin/reports"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${checkIsPathActive('/admin/reports')
                                ? 'bg-[#ee4d2d] text-white shadow-lg shadow-red-100 font-bold'
                                : 'text-gray-600 hover:bg-gray-50 font-medium'
                                }`}
                        >
                            <BarChart3 className="h-5 w-5" />
                            <span>Báo cáo Doanh thu</span>
                        </Link>

                        <Link
                            href="/admin/reviews"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${checkIsPathActive('/admin/reviews')
                                ? 'bg-[#ee4d2d] text-white shadow-lg shadow-red-100 font-bold'
                                : 'text-gray-600 hover:bg-gray-50 font-medium'
                                }`}
                        >
                            <Star className="h-5 w-5" />
                            <span>Đánh giá Khách hàng</span>
                        </Link>

                        <Link
                            href="/admin/vouchers"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${checkIsPathActive('/admin/vouchers')
                                ? 'bg-[#ee4d2d] text-white shadow-lg shadow-red-100 font-bold'
                                : 'text-gray-600 hover:bg-gray-50 font-medium'
                                }`}
                        >
                            <Ticket className="h-5 w-5" />
                            <span>Quản lý Voucher</span>
                        </Link>
                    </nav>
                </div>

                {}
                <div className="mt-auto p-6 border-t border-gray-100">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-4 border border-gray-100">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarFallback className="bg-orange-100 text-[#ee4d2d] font-black tracking-tighter">AD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-gray-900 truncate">Chu Quán</p>
                            <p className="text-xs text-gray-500 font-medium truncate">Quản trị viên</p>
                        </div>
                    </div>
                    <button
                        onClick={handleUserLogout}
                        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#ee4d2d] transition-colors w-full px-2"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Đăng xuất khỏi hệ thống</span>
                    </button>
                </div>
            </aside>

            {}
            <div className="lg:ml-72 flex-1 flex flex-col min-h-screen">
                {}
                <header className="bg-white px-8 py-5 flex items-center justify-between border-b border-gray-50 sticky top-0 z-30">
                    <div className="flex-1"></div>

                    <div className="flex items-center gap-6">
                        {}
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-gray-500 hover:bg-gray-50 hover:text-[#ee4d2d] rounded-full transition-colors">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-[#ee4d2d] rounded-full border-2 border-white animate-pulse"></span>
                            </button>
                            <button
                                onClick={function openSettings() { setIsSettingsModalOpen(true); }}
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

                {}
                <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
                    <DialogContent className="sm:max-w-[500px] rounded-3xl p-8">
                        <DialogHeader className="mb-4">
                            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">Cài đặt Cửa hàng</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            {}
                            <div className="grid gap-2">
                                <Label htmlFor="storeName" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Tên Cửa Hàng</Label>
                                <Input
                                    id="storeName"
                                    value={merchantInformation.storeName}
                                    onChange={function updateStoreName(event) {
                                        setMerchantInformation({ ...merchantInformation, storeName: event.target.value });
                                    }}
                                    placeholder="Nhập tên cửa hàng của bạn"
                                    className="h-12 border-2 border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 font-medium"
                                />
                            </div>

                            {}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="openTime" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Giờ Mở Cửa</Label>
                                    <Input
                                        id="openTime"
                                        type="time"
                                        value={merchantInformation.openTime}
                                        onChange={function updateOpenTime(event) {
                                            setMerchantInformation({ ...merchantInformation, openTime: event.target.value });
                                        }}
                                        className="h-12 border-2 border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 font-medium"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="closeTime" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Giờ Đóng Cửa</Label>
                                    <Input
                                        id="closeTime"
                                        type="time"
                                        value={merchantInformation.closeTime}
                                        onChange={function updateCloseTime(event) {
                                            setMerchantInformation({ ...merchantInformation, closeTime: event.target.value });
                                        }}
                                        className="h-12 border-2 border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 font-medium"
                                    />
                                </div>
                            </div>

                            {}
                            <div className="grid gap-2">
                                <Label htmlFor="shopType" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Loại Hình Kinh Doanh</Label>
                                <select
                                    id="shopType"
                                    className="flex h-12 w-full rounded-xl border-2 border-gray-100 bg-white px-4 font-medium text-gray-900 focus:border-[#ee4d2d] focus:outline-none focus:ring-0 transition-colors"
                                    value={merchantInformation.shopType}
                                    onChange={function updateShopType(event) {
                                        setMerchantInformation({ ...merchantInformation, shopType: event.target.value as "Food" | "Drink" });
                                    }}
                                >
                                    <option value="Food">Đồ ăn</option>
                                    <option value="Drink">Thức uống</option>
                                </select>
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button
                                onClick={handleSaveMerchantSettings}
                                className="w-full h-12 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-black uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-95"
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

