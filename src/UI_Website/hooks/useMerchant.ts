"use client";

import { useState, useEffect } from "react";
import { getMerchantByUserId } from "@/lib/apiClient";

export function useMerchant() {
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMerchant() {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const merchant = await getMerchantByUserId(userId);
          if (merchant) {
            setMerchantId(merchant.merchantId);
          } else {
            setError("Bạn chưa đăng ký cửa hàng hoặc đơn đăng ký chưa được duyệt.");
          }
        } else {
          setError("Vui lòng đăng nhập.");
        }
      } catch (err) {
        console.error("useMerchant error:", err);
        setError("Có lỗi xảy ra khi tải thông tin cửa hàng.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMerchant();
  }, []);

  return { merchantId, isLoading, error };
}
