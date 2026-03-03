"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { loginUser, handleApiError } from "@/lib/apiClient";
import { AxiosError } from "axios";

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303C33.652 32.657 29.194 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.047 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 16.108 19.01 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.047 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
            />
            <path
                fill="#4CAF50"
                d="M24 44c5.094 0 9.791-1.945 13.313-5.118l-6.149-5.205C29.161 35.091 26.715 36 24 36c-5.167 0-9.607-3.318-11.266-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.06 12.06 0 0 1-4.139 5.677l.003-.002 6.149 5.205C36.931 39.235 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="#1877F2"
                d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.104 4.388 23.108 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.014 1.792-4.683 4.533-4.683 1.312 0 2.686.236 2.686.236v2.96h-1.513c-1.49 0-1.953.93-1.953 1.887v2.26h3.328l-.532 3.49h-2.796V24C19.612 23.108 24 18.104 24 12.073z"
            />
        </svg>
    );
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleLogin(e: React.SyntheticEvent) {
        e.preventDefault();

        if (email === "" || password === "") {
            setError("Vui lòng điền đầy đủ email và mật khẩu!");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const response = await loginUser({ email, password });
            
            // Store user info in context or localStorage
            localStorage.setItem("userId", response.userId);
            localStorage.setItem("userFullName", response.fullName);
            localStorage.setItem("userRole", response.role);
            
            // Redirect to home page
            router.push("/");
        } catch (err) {
            const axiosError = err as AxiosError;
            const errorData = handleApiError(axiosError);
            setError(errorData.message || "Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.");
        } finally {
            setLoading(false);
        }
    }

    function handleGoogleLogin() {
        alert("Login Google (demo UI)");
    }

    function handleFacebookLogin() {
        alert("Login Facebook (demo UI)");
    }

    let errorMessageElement = null;
    if (error !== "") {
        errorMessageElement = (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#FFD6E5] px-4">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-[#FF5722]">
                    Đăng Nhập
                </h2>

                {errorMessageElement}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <Label htmlFor="email" className="text-gray-700">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={function (e) {
                                setEmail(e.target.value);
                            }}
                            className="focus:border-[#FF5722] focus:ring-[#FF5722]"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password" className="text-gray-700">
                            Mật khẩu
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={function (e) {
                                setPassword(e.target.value);
                            }}
                            className="focus:border-[#FF5722] focus:ring-[#FF5722]"
                        />
                    </div>



                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full !rounded-full bg-[#FF5722] hover:bg-[#FF6F00] text-white disabled:opacity-50"
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
                    </Button>
                </form>

                <div className="mt-4 text-right">
                    <Link
                        href="/forgotPassword"
                        className="text-sm text-gray-600 hover:text-[#FF5722] hover:underline transition-colors"
                    >
                        Quên mật khẩu ?
                    </Link>
                </div>

                <div className="my-6 flex items-center gap-3">
                    <div className="h-px w-full bg-gray-200" />
                    <span className="text-xs text-gray-500">HOẶC</span>
                    <div className="h-px w-full bg-gray-200" />
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full !rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                        onClick={handleGoogleLogin}
                    >
                        <GoogleIcon />
                        Tiếp tục với Google
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full !rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                        onClick={handleFacebookLogin}
                    >
                        <FacebookIcon />
                        Tiếp tục với Facebook
                    </Button>
                </div>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Chưa có tài khoản?{" "}
                    <Link href="/register" className="text-[#FF5722] hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}