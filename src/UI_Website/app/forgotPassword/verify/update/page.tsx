"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";


export default function UpdatePassword() {
    
    const pageRouter = useRouter();

    
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [updateErrorMessage, setUpdateErrorMessage] = useState("");

    
    function processPasswordChange(event: React.SyntheticEvent) {
        
        event.preventDefault();

        
        if (newPassword !== confirmNewPassword) {
            setUpdateErrorMessage("Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại!");
            return;
        }

        
        if (newPassword.length < 6) {
            setUpdateErrorMessage("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }

        
        setUpdateErrorMessage("");
        alert("Thành công! Mật khẩu của bạn đã được thay đổi. Vui lòng đăng nhập lại.");

        
        pageRouter.push("/login");
    }

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {}
            <header className="bg-white py-6 shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mxauto px-4 flex justify-between items-center">
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
                            Thiết lập mật khẩu
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
                                alt="ShopeeFood Security Banner"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {}
                    <div className="flex justify-center lg:justify-end">
                        <div className="w-full max-w-[450px] bg-white rounded-3xl shadow-2xl p-10 relative z-10 border border-orange-50">
                            <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Đặt lại mật khẩu</h2>
                            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                                Vui lòng tạo một mật khẩu mới mạnh mẽ để bảo vệ tài khoản của bạn.
                            </p>

                            {}
                            {updateErrorMessage !== "" && (
                                <div className="bg-red-50 border-2 border-red-100 p-4 mb-8 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in zoom-in duration-300">
                                    <svg viewBox="0 0 16 16" className="w-5 h-5 fill-current shrink-0">
                                        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
                                    </svg>
                                    {updateErrorMessage}
                                </div>
                            )}

                            <form onSubmit={processPasswordChange} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mật khẩu mới</Label>
                                    <Input
                                        type="password"
                                        placeholder="Tối thiểu 6 ký tự"
                                        value={newPassword}
                                        onChange={function (e) { setNewPassword(e.target.value); }}
                                        className="h-14 border-2 border-gray-50 focus:border-[#ee4d2d] rounded-2xl bg-gray-50/50 focus:bg-white px-5 shadow-none transition-all font-medium text-gray-800"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu</Label>
                                    <Input
                                        type="password"
                                        placeholder="Nhập lại mật khẩu mới"
                                        value={confirmNewPassword}
                                        onChange={function (e) { setConfirmNewPassword(e.target.value); }}
                                        className="h-14 border-2 border-gray-50 focus:border-[#ee4d2d] rounded-2xl bg-gray-50/50 focus:bg-white px-5 shadow-none transition-all font-medium text-gray-800"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-[#ee4d2d] hover:bg-[#d73211] text-white text-lg font-black rounded-2xl uppercase tracking-widest shadow-xl shadow-orange-100 transition-all hover:scale-[1.02] active:scale-95 mt-6"
                                >
                                    Cập nhật mật khẩu
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}