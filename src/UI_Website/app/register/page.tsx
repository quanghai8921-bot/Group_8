"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

type RegisterForm = {
  fullName: string;
  birthDate: string;
  phoneNumber: string;
  email: string;
  addressDelivery: string; // ✅ địa chỉ trước mật khẩu
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterForm>({
    fullName: "",
    birthDate: "",
    phoneNumber: "",
    email: "",
    addressDelivery: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.birthDate ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.addressDelivery ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Vui lòng điền tất cả các trường!");
      return;
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setError("Số điện thoại phải đúng 10 chữ số!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }

    setError("");
    console.log("REGISTER_FORM:", formData);
    alert("Đăng ký thành công! (demo)");
  };

  const inputCls = "focus:border-[#FF5722] focus:ring-[#FF5722]";

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFD6E5] px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#FF5722]">
          Đăng Ký
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-gray-700">
              Họ và tên
            </Label>
            <Input
              id="fullName"
              placeholder="Nguyễn Văn A"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className={inputCls}
            />
          </div>

          <div>
            <Label htmlFor="birthDate" className="text-gray-700">
              Ngày sinh
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) =>
                setFormData({ ...formData, birthDate: e.target.value })
              }
              className={inputCls}
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber" className="text-gray-700">
              Số điện thoại
            </Label>
            <Input
              id="phoneNumber"
              placeholder="VD: 0987654321"
              value={formData.phoneNumber}
              inputMode="numeric"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phoneNumber: e.target.value.replace(/\D/g, ""),
                })
              }
              className={inputCls}
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              placeholder="example@gmail.com"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={inputCls}
            />
          </div>

          {/* ✅ Địa chỉ lên trước mật khẩu */}
          <div>
            <Label htmlFor="addressDelivery" className="text-gray-700">
              Địa chỉ giao hàng
            </Label>
            <Input
              id="addressDelivery"
              placeholder="Số nhà, đường, phường/xã, quận/huyện..."
              value={formData.addressDelivery}
              onChange={(e) =>
                setFormData({ ...formData, addressDelivery: e.target.value })
              }
              className={inputCls}
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className={inputCls}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-gray-700">
              Nhập lại mật khẩu
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className={inputCls}
            />
          </div>

          <Button
            type="submit"
            className="w-full !rounded-full bg-[#FF5722] hover:bg-[#FF6F00] text-white"
          >
            Đăng Ký
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-[#FF5722] hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
