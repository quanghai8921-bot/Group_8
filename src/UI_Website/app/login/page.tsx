"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { loginUser, handleApiError } from "@/lib/apiClient";
import { AxiosError } from "axios";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const authenticationContext = useAuth();

    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function performUserAuthentication(event: React.SyntheticEvent) {
        event.preventDefault();

        if (userEmail === "" || userPassword === "") {
            setError("Vui lòng điền đầy đủ email và mật khẩu!");
            return;
        }

        setError("");
        setLoading(true);

        try {
            let response;

            // Bypass login cho tài khoản demo (Bỏ qua API)
            if (userEmail === "admin@admin.com" && userPassword === "admin123") {
                response = {
                    userId: "dev-admin-id",
                    fullName: "Admin (Demo Account)",
                    role: "admin",
                    token: "dev-admin-token"
                };
                localStorage.setItem('authToken', response.token);
            } else if (userEmail === "user@user.com" && userPassword === "user123") {
                response = {
                    userId: "dev-user-id",
                    fullName: "User (Demo Account)",
                    role: "user",
                    token: "dev-user-token"
                };
                localStorage.setItem('authToken', response.token);
            } else {
                response = await loginUser({ email: userEmail, password: userPassword });
            }

            // Store user info in localStorage
            localStorage.setItem("userId", response.userId);
            localStorage.setItem("userFullName", response.fullName);
            localStorage.setItem("userRole", response.role);

            // Update auth context
            const isAdmin = response.role === "admin" || response.role === "merchant";
            authenticationContext.login(isAdmin ? "/admin" : "/", isAdmin);

            alert("Đăng nhập thành công!");
        } catch (err) {
            const axiosError = err as AxiosError;
            const errorData = handleApiError(axiosError);
            setError(errorData.message || "Đăng nhập thất bại. Vui lòng kiểm tra thông tin nhập.");
        } finally {
            setLoading(false);
        }
    }

    function handleSocialLogin(platformName: string) {
        alert("Tính năng đăng nhập qua " + platformName + " hiện đang được bảo trì. Vui lòng dùng tài khoản ShopeeFood.");
    }

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <header className="bg-white py-6 shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Link href="/">
                            <Image
                                src="/Logo.jpg"
                                alt="ShopeeFood Logo"
                                width={160}
                                height={45}
                                className="object-contain hover:opacity-80 transition-opacity"
                            />
                        </Link>
                        <h1 className="text-3xl font-black text-gray-800 border-l-4 border-[#ee4d2d] ml-6 pl-6 py-1 italic uppercase tracking-tighter">
                            Đăng nhập
                        </h1>
                    </div>
                    <Link href="#" className="text-[#ee4d2d] text-sm font-bold hover:underline">Bạn cần giúp đỡ?</Link>
                </div>
            </header>

            <main className="flex-grow bg-[#ee4d2d] relative flex items-center justify-center py-16">
                <div className="container max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Left Banner Section */}
                    <div className="hidden lg:flex justify-center items-center drop-shadow-2xl">
                        <div className="relative w-full max-w-2xl aspect-[1.1/1] transform hover:scale-[1.02] transition-transform duration-700">
                            <Image
                                src="/Background.png"
                                alt="ShopeeFood Promotional Banner"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right Login Form Section */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="w-full max-w-[450px] bg-white rounded-3xl shadow-2xl p-10 relative z-10 border border-orange-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-10 tracking-tight">Đăng nhập tài khoản</h2>

                            {error !== "" && (
                                <div className="bg-red-50 border-2 border-red-100 p-4 mb-8 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-pulse">
                                    <svg viewBox="0 0 16 16" className="w-5 h-5 fill-current shrink-0">
                                        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={performUserAuthentication} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email hoặc Số điện thoại</Label>
                                    <Input
                                        type="email"
                                        placeholder="example@gmail.com"
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        className="h-14 border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#ee4d2d] rounded-2xl shadow-none transition-all px-6 font-medium text-gray-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Mật khẩu</Label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={userPassword}
                                        onChange={(e) => setUserPassword(e.target.value)}
                                        className="h-14 border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#ee4d2d] rounded-2xl shadow-none transition-all px-6 font-medium text-gray-800"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-[#ee4d2d] hover:bg-[#d73211] text-white text-lg font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-orange-100 transition-all hover:scale-[1.02] active:scale-95 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
                                </Button>
                            </form>

                            <div className="mt-6 flex justify-between text-xs font-bold text-blue-600 px-1">
                                <Link href="/forgotPassword" title="Lấy lại mật khẩu qua email" className="hover:underline">Quên mật khẩu?</Link>
                            </div>

                            <div className="mt-10 flex items-center gap-4">
                                <div className="h-[2px] flex-1 bg-gray-50"></div>
                                <span className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em]">Hoặc login qua</span>
                                <div className="h-[2px] flex-1 bg-gray-50"></div>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    className="h-12 rounded-2xl border-2 border-gray-50 hover:bg-gray-50 gap-3 font-bold text-sm transition-all shadow-sm"
                                    onClick={() => handleSocialLogin("Facebook")}
                                >
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#1877f2]"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                    Facebook
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-12 rounded-2xl border-2 border-gray-50 hover:bg-gray-50 gap-3 font-bold text-sm transition-all shadow-sm"
                                    onClick={() => handleSocialLogin("Google")}
                                >
                                    <svg viewBox="0 0 48 48" className="w-6 h-6"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.652 32.657 29.194 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.047 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" /><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 19.01 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.047 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" /><path fill="#4CAF50" d="M24 44c5.094 0 9.791-1.945 13.313-5.118l-6.149-5.205C29.161 35.091 26.715 36 24 36c-5.167 0-9.607-3.318-11.266-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" /><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.06 12.06 0 0 1-4.139 5.677l.003-.002 6.149 5.205C36.931 39.235 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" /></svg>
                                    Google
                                </Button>
                            </div>

                            <p className="mt-12 text-center text-sm font-medium text-gray-400">
                                Bạn mới biết đến ShopeeFood?{" "}
                                <Link href="/register" className="text-[#ee4d2d] font-black hover:underline ml-1">Đăng ký ngay</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
