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
            {}
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

            {}
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

            {}
            <div className="flex items-center gap-2 md:gap-4">
                {}
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

                {}
                <div className="hidden sm:flex gap-2">
                    {isLoggedIn ? (
                        <Button variant="outline" className="rounded-full px-6 border-red-500 text-red-500 hover:bg-red-50" onClick={handleLogout}>
                            Đăng xuất
                        </Button>
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