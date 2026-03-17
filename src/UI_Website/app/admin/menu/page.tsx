"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import {
  Utensils,
  Lock,
  Unlock,
  Search,
  DollarSign,
} from "lucide-react";
import { getAllFoods, getAllMerchants, Food, Merchant, toggleMerchantStatus, handleApiError } from "@/lib/apiClient";

export default function MenuManagement() {
  const [dishList, setDishList] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const searchParams = useSearchParams();

  useEffect(() => {
    const mId = searchParams.get("merchantId");
    if (mId) {
      setSelectedMerchantId(mId);
    } else {
      setSelectedMerchantId("all");
    }
  }, [searchParams]);

  useEffect(() => {
    fetchDishesFromServer();
  }, []);

  const fetchDishesFromServer = async () => {
    setIsPageLoading(true);
    try {
      const [fetchedShops, fetchedFoods] = await Promise.all([
        getAllMerchants(),
        getAllFoods()
      ]);
      
      const mappedShops = fetchedShops.map(s => ({
        MerchantId: s.merchantId,
        UserId: s.userId,
        StoreName: s.storeName,
        StoreAddress: s.storeAddress,
        OpenTime: s.openTime,
        CloseTime: s.closeTime,
        ActiveStatus: s.activeStatus ? 1 : 0,
        ShopType: s.shopType,
        revenue: 0, // Mock revenue as backend doesn't provide it yet
        totalOrders: 0
      }));

      const mappedFoods = fetchedFoods.map(f => ({
        FoodId: f.foodId,
        CategoryId: f.categoryId,
        MerchantId: f.merchantId,
        FoodName: f.foodName,
        OriginalPrice: f.originalPrice,
        SalePrice: f.salePrice,
        FoodImage: f.foodImage,
        Descriptions: f.descriptions,
        FoodStatus: f.foodStatus ? 1 : 0,
        storeName: f.storeName
      }));

      setShops(mappedShops);
      setDishList(mappedFoods);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPageLoading(false);
    }
  };

  const toggleShopStatus = async (merchantId: string) => {
    const shop = shops.find(s => s.MerchantId === merchantId);
    if (!shop) return;
    
    const newStatus = shop.ActiveStatus === 1 ? false : true;
    try {
      await toggleMerchantStatus(merchantId, newStatus);
      
      setShops(shops.map(s => {
        if (s.MerchantId === merchantId) {
          return { ...s, ActiveStatus: newStatus ? 1 : 0 };
        }
        return s;
      }));

      setDishList(dishList.map(d => {
        if (d.MerchantId === merchantId) {
          return { ...d, FoodStatus: newStatus ? 1 : 0 };
        }
        return d;
      }));

      alert("Cập nhật trạng thái thành công!");
    } catch (error: any) {
      const apiErr = handleApiError(error);
      alert(apiErr.message);
    }
  };

  const filteredDishes = dishList.filter((dish) => {
    const matchesSearch =
      (dish.FoodName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dish.storeName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMerchant =
      selectedMerchantId === "all" || dish.MerchantId === selectedMerchantId;
    return matchesSearch && matchesMerchant;
  });

  const totalPages = Math.ceil(filteredDishes.length / ITEMS_PER_PAGE);
  const paginatedDishes = filteredDishes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const selectedShop = shops.find((s) => s.MerchantId === selectedMerchantId);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
            Quản lý Cửa hàng
          </h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Giám sát món ăn, trạng thái quán và doanh thu
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm món..."
              className="pl-10 h-11 w-64 rounded-xl border-gray-100 focus:border-[#ee4d2d]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Danh sách Quán
            </h4>
            <span className="text-[10px] font-bold text-gray-400">
              {shops.length} đối tác
            </span>
          </div>
          <div className="space-y-2">
            {shops.map((shop) => (
              <div
                key={shop.MerchantId}
                className={`group relative p-4 rounded-3xl border transition-all ${selectedMerchantId === shop.MerchantId ? "border-[#ee4d2d] bg-orange-50/50" : "border-gray-100 bg-white hover:border-orange-200"}`}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedMerchantId(shop.MerchantId)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="space-y-0.5">
                      <p
                        className={`font-black text-sm truncate pr-8 ${selectedMerchantId === shop.MerchantId ? "text-[#ee4d2d]" : "text-gray-900"}`}
                      >
                        {shop.StoreName}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                          #{shop.MerchantId}
                        </p>
                        <span className="text-[10px] text-gray-300">•</span>
                        <p className="text-[10px] text-gray-400 font-bold italic truncate max-w-[100px]">
                          {shop.ownerName || "Merchant"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1 shadow-sm ${shop.ActiveStatus === 1 ? "bg-green-500 ring-4 ring-green-50" : "bg-red-500 ring-4 ring-red-50"}`}
                    ></span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1.5">
                      <DollarSign
                        className={`h-3 w-3 ${selectedMerchantId === shop.MerchantId ? "text-[#ee4d2d]" : "text-gray-400"}`}
                      />
                      <p className="text-xs font-black text-gray-700">
                        {shop.revenue.toLocaleString()}₫
                      </p>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400">
                      {shop.totalOrders} đơn
                    </p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-xl ${shop.ActiveStatus === 1 ? "hover:bg-red-100 text-red-500" : "hover:bg-green-100 text-green-500"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleShopStatus(shop.MerchantId);
                    }}
                    title={
                      shop.ActiveStatus === 1 ? "Khóa quán" : "Mở khóa quán"
                    }
                  >
                    {shop.ActiveStatus === 1 ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Unlock className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Suspense fallback={<div className="h-32 bg-gray-50 animate-pulse rounded-[32px]"></div>}>
            {selectedShop && (
              <div className="grid grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <Card className="rounded-[32px] border-none bg-orange-50 shadow-none p-6">
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">
                    Chủ quán
                  </p>
                  <h4 className="text-xl font-black text-gray-900">
                    {selectedShop.ownerName || "Merchant"}
                  </h4>
                </Card>
                <Card className="rounded-[32px] border-none bg-gray-50 shadow-none p-6 text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Doanh thu
                  </p>
                  <h4 className="text-xl font-black text-[#ee4d2d]">
                    {selectedShop.revenue.toLocaleString()}₫
                  </h4>
                </Card>
                <Card className="rounded-[32px] border-none bg-blue-50 shadow-none p-6 text-center">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                    Đơn hàng
                  </p>
                  <h4 className="text-xl font-black text-blue-600">
                    {selectedShop.totalOrders}
                  </h4>
                </Card>
                <Card className="rounded-[32px] border-none bg-green-50 shadow-none p-6 text-center">
                  <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">
                    Trạng thái
                  </p>
                  <h4 className={`text-xl font-black ${selectedShop.ActiveStatus === 1 ? "text-green-600" : "text-red-600"}`}>
                    {selectedShop.ActiveStatus === 1 ? "Mở" : "Khóa"}
                  </h4>
                </Card>
              </div>
            )}
          </Suspense>

          <Card className="rounded-[40px] border-gray-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Danh sách món ăn
                </CardTitle>
                <span className="text-xs font-bold text-[#ee4d2d] bg-orange-100 px-2 py-1 rounded-lg">
                  {filteredDishes.length} món
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/30 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 font-black text-gray-400 text-[10px] uppercase tracking-widest w-1/2">
                        Món ăn
                      </th>
                      <th className="px-6 py-4 font-black text-gray-400 text-[10px] uppercase tracking-widest w-1/4">
                        Giá
                      </th>
                      <th className="px-6 py-4 font-black text-gray-400 text-[10px] uppercase tracking-widest w-1/4">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedDishes.map((dish) => (
                      <tr key={dish.FoodId} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={dish.FoodImage}
                              alt={dish.FoodName}
                              className="h-10 w-10 rounded-xl object-cover border border-gray-100"
                            />
                            <div>
                              <p className="font-bold text-gray-900">{dish.FoodName}</p>
                              <p className="text-[10px] text-gray-400 font-medium line-clamp-1">{dish.Descriptions}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                            <p className="font-black text-[#ee4d2d]">
                              {(dish.SalePrice || dish.OriginalPrice || 0).toLocaleString()}đ
                            </p>
                            {dish.SalePrice !== dish.OriginalPrice && (
                              <p className="text-[10px] text-gray-400 line-through">
                                {(dish.OriginalPrice || 0).toLocaleString()}đ
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${dish.FoodStatus === 1 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                            {dish.FoodStatus === 1 ? "Đang bán" : "Ngừng bán"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredDishes.length === 0 && (
                  <div className="py-12 text-center text-gray-400 italic text-sm">
                    Không tìm thấy món ăn nào phù hợp
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
