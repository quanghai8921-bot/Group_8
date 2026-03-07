"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
    const { totalItems } = useCart();
    const router = useRouter();
    const auth = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    const isLoggedIn = auth.isAuthenticated;

    const handleLogout = () => {
        auth.logout();
    };

    const handleCartClick = function (e: React.MouseEvent) {
        if (!auth.isAuthenticated) {
            e.preventDefault();
            router.push("/login");
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim()) {
            router.push(`/?search=${encodeURIComponent(query)}`);
        } else {
            router.push("/");
        }
    };



    return (
        <nav className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-50 gap-4">
            { }
            <Link href="/" className="flex-shrink-0">
                <Image
                    src="/Logo.jpg"
                    alt="Logo ShopeeFood"
                    width={150}
                    height={40}
                    priority
                    className="object-contain"
                />
            </Link>

            { }
            <div className="hidden md:flex flex-1 max-w-xl relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Tìm kiếm món ăn, nhà hàng..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            { }
            <div className="flex items-center gap-2 md:gap-4">
                { }
                <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                    <Search className="w-6 h-6" />
                </Button>

                <Link href="/cart" className="relative" onClick={handleCartClick}>
                    <Button variant="ghost" size="icon" className="rounded-full relative">
                        <ShoppingCart className="w-6 h-6" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
                                {totalItems}
                            </span>
                        )}
                    </Button>
                </Link>

                { }
                <div className="hidden sm:flex gap-2">
                    {isLoggedIn ? (
                        <div className="relative group">
                            <Button variant="outline" className="rounded-full px-6 border-[#ee4d2d] text-[#ee4d2d] hover:bg-orange-50">
                                Tài khoản
                            </Button>
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform origin-top-right group-hover:scale-100 scale-95">
                                <Link href="/register/driver" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#ee4d2d] transition-colors border-b border-gray-50">
                                    Đăng ký làm tài xế
                                </Link>
                                <Link href="/register/merchant" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#ee4d2d] transition-colors border-b border-gray-50">
                                    Đăng ký làm chủ quán
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="outline" className="rounded-full px-6">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="rounded-full px-6 bg-blue-600 hover:bg-blue-700">
                                    Register
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}