"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";


export default function VerifyPassword() {
    
    const pageRouter = useRouter();

    
    const [securityCode, setSecurityCode] = useState("");

    
    function processOtpVerification(event: React.SyntheticEvent) {
        
        event.preventDefault();

        
        if (securityCode === "") {
            alert("Vui lòng nhập mã bảo mật để tiếp tục!");
            return;
        }

        
        pageRouter.push("/forgotPassword/verify/update");
    }

    
    function handleResendCode() {
        alert("Một mã xác nhận mới đã được gửi đến thiết bị của bạn.");
    }

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {}
            <header className="bg-white py-6 shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Link href="/">
                            <Image
                                src="/Logo.jpg"
                                alt="ShopeeFood Logo"
                                width={160}
                                height={45}
                                className="object-contain hover:opacity-80 transition-all"
                            />
                        </Link>
                        <h1 className="text-3xl font-black text-gray-800 border-l-4 border-[#ee4d2d] ml-6 pl-6 py-1 italic uppercase tracking-tighter">
                            Xác nhận mã
                        </h1>
                    </div>
                    <Link href="#" className="text-[#ee4d2d] text-sm font-bold hover:underline">Bạn cần giúp đỡ?</Link>
                </div>
            </header>

            {}
            <main className="flex-grow bg-[#ee4d2d] relative flex items-center justify-center py-12 md:py-20">
                <div className="container max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {}
                    <div className="hidden lg:flex justify-center items-center drop-shadow-2xl">
                        <div className="relative w-full max-w-2xl aspect-[1.1/1] hover:scale-[1.02] transition-transform duration-700">
                            <Image
                                src="/Background.png"
                                alt="ShopeeFood Verification Banner"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {}
                    <div className="flex justify-center lg:justify-end">
                        <div className="w-full max-w-[450px] bg-white rounded-3xl shadow-2xl p-10 relative z-10 border border-orange-50">
                            <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Nhập mã bảo mật</h2>
                            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                                Vui lòng kiểm tra mã xác nhận gồm <span className="font-bold text-gray-700">6-8 chữ số</span> đã được gửi đến phương thức liên hệ của bạn.
                            </p>

                            <form onSubmit={processOtpVerification} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mã xác nhận (OTP)</Label>
                                    <Input
                                        type="number"
                                        placeholder="Nhập mã xác nhận tại đây..."
                                        value={securityCode}
                                        onChange={function (e) { setSecurityCode(e.target.value); }}
                                        className="h-14 border-2 border-gray-50 focus:border-[#ee4d2d] rounded-2xl bg-gray-50/50 focus:bg-white px-5 shadow-none transition-all font-medium text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-[#ee4d2d] hover:bg-[#d73211] text-white text-lg font-black rounded-2xl uppercase tracking-widest shadow-xl shadow-orange-100 transition-all hover:scale-[1.02] active:scale-95 mt-4"
                                >
                                    Xác nhận ngay
                                </Button>
                            </form>

                            {}
                            <div className="mt-10 pt-8 border-t-2 border-dashed border-gray-100 text-center flex flex-col items-center gap-3">
                                <p className="text-sm text-gray-500 font-medium">Bạn vẫn chưa nhận được mã?</p>
                                <Button
                                    variant="outline"
                                    className="h-10 px-6 border-2 border-[#ee4d2d] text-[#ee4d2d] hover:bg-[#ee4d2d] hover:text-white rounded-xl font-bold transition-colors"
                                    onClick={handleResendCode}
                                >
                                    Gửi lại mã xác nhận
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}