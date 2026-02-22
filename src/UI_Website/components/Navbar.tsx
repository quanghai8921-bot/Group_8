"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { totalItems } = useCart();
    const router = useRouter();

    const handleCartClick = function (e: React.MouseEvent) {
        const token = localStorage.getItem("auth-token");

        if (token === null) {
            e.preventDefault();
            router.push("/login");
        }
    };

    let cartBadge = null;
    if (totalItems > 0) {
        cartBadge = (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {totalItems}
            </span>
        );
    }

    return (
        <nav className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-50 gap-4">
            {/* Logo */}
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

            {/* Thanh Tìm Kiếm (Search Bar) - Chỉ hiện trên màn hình máy tính */}
            <div className="hidden md:flex flex-1 max-w-xl relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Tìm kiếm món ăn, nhà hàng..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                />
            </div>

            {/* Cụm chức năng bên phải */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Nút Tìm kiếm cho Mobile */}
                <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                    <Search className="w-6 h-6" />
                </Button>

                {/* Nút Giỏ Hàng */}
                <Link href="/cart" className="relative" onClick={handleCartClick}>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ShoppingCart className="w-6 h-6" />
                        {cartBadge}
                    </Button>
                </Link>

                {/* Nút Đăng nhập / Đăng ký */}
                <div className="hidden sm:flex gap-2">
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
                </div>
            </div>
        </nav>
    );
}