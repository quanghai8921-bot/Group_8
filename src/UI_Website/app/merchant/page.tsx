"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function MerchantDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.push("/merchant/menu");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#ee4d2d] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium italic">
          Đang chuyển hướng đến trang quản lý menu...
        </p>
      </div>
    </div>
  );
}
