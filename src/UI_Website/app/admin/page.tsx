"use client"

import Link from "next/link"
import {
    TrendingUp,
    TrendingDown,
    MoreHorizontal
} from "lucide-react"

import { Button } from "@/components/ui/button"





export default function AdminDashboard() {
    return (
        <div className="space-y-8 font-sans">

            { }
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                { }
                <Link href="/admin/reports" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg hover:border-orange-100 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Tổng Doanh Thu</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-2 tracking-tight">3,284 Tr</h3>
                        </div>
                    </div>
                </Link>

                { }
                <Link href="/admin/orders" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg hover:border-orange-100 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Tổng Đơn Hàng</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-2 tracking-tight">15,204</h3>
                        </div>
                    </div>
                </Link>

                { }
                <Link href="#" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg hover:border-orange-100 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Khách Hàng</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-2 tracking-tight">8,942</h3>
                        </div>
                    </div>
                </Link>

                { }
                <Link href="/admin/reports" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg hover:border-orange-100 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Tỷ Lệ Chuyển Đổi</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-2 tracking-tight">24.5%</h3>
                        </div>
                    </div>
                </Link>
            </div>




        </div>
    )
}
