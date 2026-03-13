"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { registerUser, handleApiError } from "@/lib/apiClient";
import { AxiosError } from "axios";

type RegisterForm = {
  fullName: string;
  birthDate: string;
  phoneNumber: string;
  email: string;
  addressDelivery: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const [registrationFormData, setRegistrationFormData] =
    useState<RegisterForm>({
      fullName: "",
      birthDate: "",
      phoneNumber: "",
      email: "",
      addressDelivery: "",
      password: "",
      confirmPassword: "",
    });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function updateFormField(fieldName: keyof RegisterForm, newValue: string) {
    setRegistrationFormData(function (previousState) {
      return {
        ...previousState,
        [fieldName]: newValue,
      };
    });
  }

  const processUserRegistration = async (event: React.FormEvent) => {
    event.preventDefault();

    const isAnyFieldEmpty =
      !registrationFormData.fullName ||
      !registrationFormData.birthDate ||
      !registrationFormData.phoneNumber ||
      !registrationFormData.email ||
      !registrationFormData.addressDelivery ||
      !registrationFormData.password ||
      !registrationFormData.confirmPassword;

    if (isAnyFieldEmpty) {
      setError("Vui lòng điền tất cả các trường thông tin để đăng ký!");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(registrationFormData.phoneNumber)) {
      setError("Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 chữ số!");
      return;
    }

    if (
      registrationFormData.password !== registrationFormData.confirmPassword
    ) {
      setError("Mật khẩu nhập lại không khớp với mật khẩu đã chọn!");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await registerUser({
        fullName: registrationFormData.fullName,
        email: registrationFormData.email,
        password: registrationFormData.password,
        phoneNumber: registrationFormData.phoneNumber,
        birthDate: registrationFormData.birthDate,
        addressDelivery: registrationFormData.addressDelivery,
      });

      // Redirect to login page after successful registration
      router.push("/login");
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorData = handleApiError(axiosError);
      setError(errorData.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  function handleSocialConnect(serviceName: string) {
    alert(
      "Kết nối với " +
        serviceName +
        " đang được phát triển. Vui lòng đăng ký thủ công.",
    );
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
                className="object-contain hover:opacity-80 transition-all"
              />
            </Link>
            <h1 className="text-3xl font-black text-gray-800 border-l-4 border-[#ee4d2d] ml-6 pl-6 py-1 italic uppercase tracking-tighter">
              Đăng ký
            </h1>
          </div>
          <Link
            href="#"
            className="text-[#ee4d2d] text-sm font-bold hover:underline"
          >
            Bạn cần giúp đỡ?
          </Link>
        </div>
      </header>

      <main className="flex-grow bg-[#ee4d2d] relative flex items-center justify-center py-12 md:py-20">
        <div className="container max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-full max-w-2xl aspect-[1.1/1] hover:scale-105 transition-transform duration-1000">
              <Image
                src="/Background.png"
                alt="ShopeeFood Marketing"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[550px] bg-white rounded-[40px] shadow-2xl p-10 relative z-10 border border-orange-50">
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                Tạo tài khoản mới
              </h2>

              {error !== "" && (
                <div className="bg-red-50 border-2 border-red-100 p-4 mb-8 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in slide-in-from-top duration-300">
                  <svg
                    viewBox="0 0 16 16"
                    className="w-5 h-5 fill-current shrink-0"
                  >
                    <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={processUserRegistration} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Họ và tên đầy đủ
                  </Label>
                  <Input
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={registrationFormData.fullName}
                    onChange={function (e) {
                      updateFormField("fullName", e.target.value);
                    }}
                    className="h-12 border-2 border-gray-50 focus:border-[#ee4d2d] rounded-xl bg-gray-50/30 px-5 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Ngày sinh
                    </Label>
                    <Input
                      type="date"
                      value={registrationFormData.birthDate}
                      onChange={function (e) {
                        updateFormField("birthDate", e.target.value);
                      }}
                      className="h-12 border-2 border-gray-50 focus:border-[#ee4d2d] rounded-xl bg-gray-50/30 px-5 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Số điện thoại
                    </Label>
                    <Input
                      placeholder="09xx xxx xxx"
                      value={registrationFormData.phoneNumber}
                      onChange={function (e) {
                        updateFormField(
                          "phoneNumber",
                          e.target.value.replace(/\D/g, ""),
                        );
                      }}
                      className="h-12 border-2 border-gray-50 focus:border-[#ee4d2d] rounded-xl bg-gray-50/30 px-5 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Địa chỉ Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={registrationFormData.email}
                    onChange={function (e) {
                      updateFormField("email", e.target.value);
                    }}
                    className="h-12 border-2 border-gray-50 focus:border-[#ee4d2d] rounded-xl bg-gray-50/30 px-5 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Địa chỉ giao hàng mặc định
                  </Label>
                  <Input
                    placeholder="Số nhà, Tên đường, Quận/Huyện..."
                    value={registrationFormData.addressDelivery}
                    onChange={function (e) {
                      updateFormField("addressDelivery", e.target.value);
                    }}
                    className="h-12 border-2 border-gray-50 focus:border-[#ee4d2d] rounded-xl bg-gray-50/30 px-5 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Mật khẩu
                    </Label>
                    <Input
                      type="password"
                      placeholder="Tối thiểu 6 ký tự"
                      value={registrationFormData.password}
                      onChange={function (e) {
                        updateFormField("password", e.target.value);
                      }}
                      className="h-12 border-2 border-gray-50 focus:border-[#ee4d2d] rounded-xl bg-gray-50/30 px-5 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Nhập lại mật khẩu
                    </Label>
                    <Input
                      type="password"
                      placeholder="Xác nhận mật khẩu"
                      value={registrationFormData.confirmPassword}
                      onChange={function (e) {
                        updateFormField("confirmPassword", e.target.value);
                      }}
                      className="h-12 border-2 border-gray-50 focus:border-[#ee4d2d] rounded-xl bg-gray-50/30 px-5 font-medium"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-[#ee4d2d] hover:bg-[#d73211] text-white text-lg font-black rounded-2xl uppercase tracking-widest shadow-xl shadow-orange-100 transition-all hover:scale-[1.01] active:scale-95 mt-6 disabled:opacity-50"
                >
                  {loading ? "Đang đăng ký..." : "Đăng ký ngay"}
                </Button>
              </form>

              <div className="mt-10 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-100"></div>
                <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">
                  Hoặc kết nối qua
                </span>
                <div className="h-px flex-1 bg-gray-100"></div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="h-12 rounded-2xl border-2 border-gray-50 hover:bg-gray-50 gap-3 font-bold transition-all"
                  onClick={function () {
                    handleSocialConnect("Facebook");
                  }}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#1877f2]">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="h-12 rounded-2xl border-2 border-gray-50 hover:bg-gray-50 gap-3 font-bold transition-all"
                  onClick={function () {
                    handleSocialConnect("Google");
                  }}
                >
                  <svg viewBox="0 0 48 48" className="w-6 h-6">
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
                  Google
                </Button>
              </div>

              <p className="mt-12 text-center text-sm font-medium text-gray-400">
                Bạn đã có tài khoản ShopeeFood?{" "}
                <Link
                  href="/login"
                  className="text-[#ee4d2d] font-black hover:underline ml-1"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
