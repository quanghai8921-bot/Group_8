"use client";

import { useRouter } from 'next/navigation';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [emailOrPhone, setEmailOrPhone] = useState("");

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();

        if (emailOrPhone === "") {
            alert("Vui lòng nhập email/Phone number!");
            return;
        }

        alert(`Đã gửi yêu cầu khôi phục mật khẩu đến: ${emailOrPhone}`);
    }

    const handleVerify = () => {
        console.log("Đang gửi mã OTP...");
        router.push('/forgotPassword/verify');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#FFD6E5] px-4">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-2 text-[#FF5722]">
                    Tìm tài khoản của bạn
                </h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                    Hãy nhập số di động hoặc email của bạn.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="emailOrPhone" className="text-gray-700">
                            Email/Phone number
                        </Label>
                        <Input
                            id="emailOrPhone"
                            type="text"
                            value={emailOrPhone}
                            onChange={function (e) {
                                setEmailOrPhone(e.target.value);
                            }}
                            className="focus:border-[#FF5722] focus:ring-[#FF5722]"
                        />
                    </div>

                    <Button onClick={handleVerify}
                        type="submit"
                        className="w-full !rounded-full bg-[#FF5722] hover:bg-[#FF6F00] text-white"
                    >
                        Gửi yêu cầu
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