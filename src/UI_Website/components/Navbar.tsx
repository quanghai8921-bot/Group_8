"use client"; // Cần thiết vì có tương tác chọn tỉnh thành

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Đảm bảo bạn đã cài: npx shadcn@latest add select

export default function Navbar() {
  const [province, setProvince] = useState("binhdinh");

  return (
    <nav className="flex items-center justify-between px-6 py-2 bg-white shadow-sm border-b">
      <div className="flex items-center gap-8">
        {/* Logo ShopeeFood */}
        <Link href="/">
          <img 
            src="https://shopeefood.vn/app/assets/img/shopeefoodvn.png" 
            alt="ShopeeFood Logo" 
            className="h-10 w-auto"
          />
        </Link>

        {/* Mục chọn Tỉnh thành */}
        <div className="hidden md:block">
          <Select defaultValue={province} onValueChange={setProvince}>
            <SelectTrigger className="w-[140px] bg-gray-100 border-none h-9 focus:ring-0">
              <SelectValue placeholder="Chọn tỉnh" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="binhdinh">Bình Định</SelectItem>
              <SelectItem value="hanoi">Hà Nội</SelectItem>
              <SelectItem value="tphcm">TP. HCM</SelectItem>
              <SelectItem value="danang">Đà Nẵng</SelectItem>
              <SelectItem value="cantho">Cần Thơ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Menu Đồ ăn */}
        <div className="hidden lg:block border-b-2 border-[#ee4d2d] pb-1 cursor-pointer transition-all">
          <span className="font-bold text-[#ee4d2d]">Đồ ăn</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition">
          <Search size={22} className="text-gray-600" />
        </div>

        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="outline" className="border-[#ee4d2d] text-[#ee4d2d] hover:bg-orange-50 font-medium px-6">
              Đăng nhập
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-[#ee4d2d] hover:bg-[#d73211] text-white font-medium px-6">
              Đăng ký
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}