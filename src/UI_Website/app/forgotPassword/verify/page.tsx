"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Label } from "@/components/ui/label";

export default function VerifyPassword() { // Nên viết hoa chữ cái đầu (VerifyPassword)
    const router = useRouter(); // 2. Khởi tạo router

    // 3. Hàm xử lý khi nhấn nút Xác nhận
    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        console.log("Mã xác nhận chính xác!");
        router.push("/forgotPassword/verify/update");
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-[#FFD6E5] px-4">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-2 text-[#FF5722]">
                    Nhập mã bảo mật
                </h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                    Vui lòng kiểm tra mã trong email của bạn. Mã này gồm 8 số.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="verify" className="text-gray-700">
                            Mã xác nhận
                        </Label>
                        <Input
                            id="verify"
                            type="number"
                            className="focus:border-[#FF5722] focus:ring-[#FF5722]"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full !rounded-full bg-[#FF5722] hover:bg-[#FF6F00] text-white"
                    >
                        Xác nhận
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        href="/login"
                        className="text-sm text-gray-500 hover:text-[#FF5722] hover:underline transition-colors"
                    >
                        Quay lại đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}