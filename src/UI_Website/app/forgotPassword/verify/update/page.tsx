"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UpdatePassword() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        // Kiểm tra logic cơ bản
        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        console.log("Cập nhật password thành công!");
        alert("Mật khẩu của bạn đã được thay đổi.");
        router.push("/login");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#FFD6E5] px-4">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-2 text-[#FF5722]">
                    Thiết lập mật khẩu mới
                </h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                    Vui lòng nhập mật khẩu mới và xác nhận lại bên dưới.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="new-password">Mật khẩu mới</Label>
                            <Input
                                id="new-password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="focus:border-[#FF5722] focus:ring-[#FF5722]"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="focus:border-[#FF5722] focus:ring-[#FF5722]"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full !rounded-full bg-[#FF5722] hover:bg-[#FF6F00] text-white mt-4"
                    >
                        Cập nhật mật khẩu
                    </Button>
                </form>
            </div>
        </div>
    );
}