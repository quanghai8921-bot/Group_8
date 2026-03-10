"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const pageRouter = useRouter();

  const [recoveryContact, setRecoveryContact] = useState("");

  function submitRecoveryRequest(event: React.SyntheticEvent) {
    event.preventDefault();

    if (recoveryContact === "") {
      alert("Vui lòng nhập Địa chỉ Email hoặc Số điện thoại để tiếp tục!");
      return;
    }

    pageRouter.push("/forgotPassword/verify");
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
              Quên mật khẩu
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

      {}
      <main className="flex-grow bg-[#ee4d2d] relative flex items-center justify-center py-12 md:py-20">
        <div className="container max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {}
          <div className="hidden lg:flex justify-center items-center drop-shadow-2xl">
            <div className="relative w-full max-w-2xl aspect-[1.1/1] hover:scale-[1.02] transition-transform duration-700">
              <Image
                src="/Background.png"
                alt="ShopeeFood Connect Banner"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[450px] bg-white rounded-3xl shadow-2xl p-10 relative z-10 border border-orange-50">
              <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                Tìm tài khoản của bạn
              </h2>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                Hãy nhập{" "}
                <span className="font-bold text-gray-700">số di động</span> hoặc{" "}
                <span className="font-bold text-gray-700">email</span> của bạn
                để bắt đầu khôi phục mật khẩu.
              </p>

              <form onSubmit={submitRecoveryRequest} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Email hoặc Số điện thoại
                  </Label>
                  <Input
                    type="text"
                    placeholder="Ví dụ: 09xx xxx xxx"
                    value={recoveryContact}
                    onChange={function (e) {
                      setRecoveryContact(e.target.value);
                    }}
                    className="h-14 border-2 border-gray-50 focus:border-[#ee4d2d] rounded-2xl bg-gray-50/50 focus:bg-white px-5 shadow-none transition-all font-medium text-gray-800"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 bg-[#ee4d2d] hover:bg-[#d73211] text-white text-lg font-black rounded-2xl uppercase tracking-widest shadow-xl shadow-orange-100 transition-all hover:scale-[1.02] active:scale-95 mt-4"
                >
                  Tiếp theo
                </Button>
              </form>

              {}
              <div className="mt-10 pt-8 border-t-2 border-dashed border-gray-100 text-center">
                <Link
                  href="/login"
                  className="text-sm text-gray-500 font-bold hover:text-[#ee4d2d] hover:underline flex items-center justify-center gap-2 group transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 fill-current text-gray-300 group-hover:text-[#ee4d2d] transition-colors"
                  >
                    <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                  </svg>
                  Quay lại màn hình Đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
