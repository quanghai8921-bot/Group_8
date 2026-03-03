"use client";

import React from "react";
import {
    LayoutGrid,
    CupSoda,
    Utensils,
    Leaf,
    Cake,
    IceCream,
    Pizza,
    Flame,
    Fish,
    Soup,
    Box,
    ChevronRight
} from "lucide-react";

const categories = [
    { id: 1, name: "Tất cả", icon: LayoutGrid, color: "bg-blue-100 text-blue-600" },
    { id: 2, name: "Thức uốn", icon: CupSoda, color: "bg-orange-100 text-orange-600" },
    { id: 3, name: "Đồ ăn", icon: Utensils, color: "bg-red-100 text-red-600" },
    { id: 4, name: "Đồ chay", icon: Leaf, color: "bg-green-100 text-green-600" },
    { id: 5, name: "Bánh kem", icon: Cake, color: "bg-pink-100 text-pink-600" },
    { id: 6, name: "Tráng miệng", icon: IceCream, color: "bg-purple-100 text-purple-600" },
    { id: 7, name: "Pizza/Burger", icon: Pizza, color: "bg-yellow-100 text-yellow-600" },
    { id: 8, name: "Món lẩu", icon: Flame, color: "bg-red-200 text-red-700" },
    { id: 9, name: "Sushi", icon: Fish, color: "bg-cyan-100 text-cyan-600" },
    { id: 10, name: "Mì", icon: Soup, color: "bg-amber-100 text-amber-600" },
    { id: 11, name: "Phở", icon: Soup, color: "bg-orange-200 text-orange-700" },
    { id: 12, name: "Bún", icon: Soup, color: "bg-yellow-200 text-yellow-700" },
    { id: 13, name: "Cơm hộp", icon: Box, color: "bg-slate-100 text-slate-600" },
];

export default function CategoryList() {
    return (
        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 mb-10 overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                <h3 className="text-gray-500 font-medium uppercase text-sm tracking-wider">
                    Danh Mục
                </h3>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-10 xl:grid-cols-13 divide-x divide-y divide-gray-50 border-b border-gray-50">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="flex flex-col items-center justify-center p-6 hover:bg-gray-50 transition-all cursor-pointer group border-r border-b last:border-r-0"
                    >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 shadow-sm ${cat.color}`}>
                            <cat.icon className="w-7 h-7" />
                        </div>
                        <span className="text-xs text-gray-700 font-medium text-center line-clamp-2">
                            {cat.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
