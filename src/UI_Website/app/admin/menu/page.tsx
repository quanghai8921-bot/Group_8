"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Utensils,
  Coffee,
  Pizza,
  IceCream,
  Soup,
  Box,
  LayoutGrid,
  Upload,
  Flame,
  Leaf,
  Fish,
  Store,
  Lock,
  Unlock,
  Search,
  ChevronRight,
  DollarSign,
} from "lucide-react";

interface ToppingOption {
  toppingName: string;
  price: string;
}

interface Category {
  categoryid: string;
  categoryname: string;
}

interface Dish {
  id: string;
  storeName: string;
  openTime: string;
  closeTime: string;
  shopType: "Food" | "Drink";
  categoryId: string;
  merchantId: string;
  foodName: string;
  originalPrice: string;
  salePrice: string;
  foodImage: string;
  descriptions: string;
  foodStatus: "Available" | "Out of Stock" | "Unavailable";
  rating?: number;
  toppingOptions?: ToppingOption[];
}

interface Shop {
  merchantId: string;
  storeName: string;
  ownerName: string;
  status: "Open" | "Locked";
  revenue: number;
  totalOrders: number;
}

const STATIC_CATEGORIES = [
  { categoryid: "1", categoryname: "Tất cả" },
  { categoryid: "2", categoryname: "Thức uống" },
  { categoryid: "3", categoryname: "Đồ ăn" },
  { categoryid: "4", categoryname: "Đồ chay" },
  { categoryid: "5", categoryname: "Bánh kem" },
  { categoryid: "6", categoryname: "Tráng miệng" },
  { categoryid: "7", categoryname: "Pizza/Burger" },
  { categoryid: "8", categoryname: "Món lẩu" },
  { categoryid: "9", categoryname: "Sushi" },
  { categoryid: "10", categoryname: "Mì" },
  { categoryid: "11", categoryname: "Phở" },
  { categoryid: "12", categoryname: "Bún" },
  { categoryid: "13", categoryname: "Cơm hộp" },
];

export default function MenuManagement() {
  const [dishList, setDishList] = useState<Dish[]>([]);
  const [shops, setShops] = useState<Shop[]>([
    {
      merchantId: "M001",
      storeName: "ShopeeFood Official",
      ownerName: "Trần Thị B",
      status: "Open",
      revenue: 12500000,
      totalOrders: 156,
    },
    {
      merchantId: "M002",
      storeName: "Bún Chả Hà Nội Q.1",
      ownerName: "Hoàng Anh E",
      status: "Open",
      revenue: 4200000,
      totalOrders: 52,
    },
    {
      merchantId: "M003",
      storeName: "Trà Sữa Koi Thé",
      ownerName: "Trương Văn F",
      status: "Locked",
      revenue: 8900000,
      totalOrders: 110,
    },
  ]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>("M001");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const searchParams = useSearchParams();

  useEffect(() => {
    const mId = searchParams.get("merchantId");
    if (mId) {
      setSelectedMerchantId(mId);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchDishesFromServer();
  }, []);

  const fetchDishesFromServer = async () => {
    setIsPageLoading(true);
    try {
      const mockDishes: Dish[] = [
        {
          id: "d1",
          storeName: "ShopeeFood Official",
          openTime: "08:00",
          closeTime: "22:00",
          shopType: "Food",
          categoryId: "3",
          merchantId: "M001",
          foodName: "Bún chả Hà Nội",
          originalPrice: "55000",
          salePrice: "45000",
          foodImage: "/images/bunchahanoi.jpg",
          descriptions: "Bún chả truyền thống",
          foodStatus: "Available",
          rating: 5,
          toppingOptions: [],
        },
        {
          id: "d2",
          storeName: "ShopeeFood Official",
          openTime: "08:00",
          closeTime: "22:00",
          shopType: "Drink",
          categoryId: "2",
          merchantId: "M001",
          foodName: "Trà sữa Trân trâu",
          originalPrice: "40000",
          salePrice: "35000",
          foodImage: "/images/bunchahanoi.jpg",
          descriptions: "Trà sữa đậm vị",
          foodStatus: "Available",
          rating: 4.5,
          toppingOptions: [],
        },
        {
          id: "d3",
          storeName: "Bún Chả Hà Nội Q.1",
          openTime: "07:00",
          closeTime: "21:00",
          shopType: "Food",
          categoryId: "12",
          merchantId: "M002",
          foodName: "Bún Chả Đặc Biệt",
          originalPrice: "75000",
          salePrice: "65000",
          foodImage: "/images/bunchahanoi.jpg",
          descriptions: "Nhiều chả hơn",
          foodStatus: "Available",
          rating: 4.8,
          toppingOptions: [],
        },
        {
          id: "d4",
          storeName: "Trà Sữa Koi Thé",
          openTime: "09:00",
          closeTime: "22:00",
          shopType: "Drink",
          categoryId: "2",
          merchantId: "M003",
          foodName: "Machiato Trà Xanh",
          originalPrice: "60000",
          salePrice: "55000",
          foodImage: "/images/bunchahanoi.jpg",
          descriptions: "Best seller",
          foodStatus: "Unavailable",
          rating: 5,
          toppingOptions: [],
        },
        {
          id: "d5",
          storeName: "Quán Chay Liên Hoa",
          openTime: "06:00",
          closeTime: "20:00",
          shopType: "Food",
          categoryId: "4",
          merchantId: "M004",
          foodName: "Cơm chay thập cẩm",
          originalPrice: "40000",
          salePrice: "35000",
          foodImage: "/images/bunchahanoi.jpg",
          descriptions: "Đầy đủ dinh dưỡng",
          foodStatus: "Available",
          rating: 4.7,
          toppingOptions: [],
        },
        {
          id: "d6",
          storeName: "Tiệm Bánh Ngọt Ngào",
          openTime: "08:00",
          closeTime: "22:00",
          shopType: "Food",
          categoryId: "5",
          merchantId: "M005",
          foodName: "Bánh kem dâu tây",
          originalPrice: "250000",
          salePrice: "200000",
          foodImage: "/images/bunchahanoi.jpg",
          descriptions: "Bánh sinh nhật trái cây tươi",
          foodStatus: "Available",
          rating: 4.9,
          toppingOptions: [],
        },
        {
          id: "d7",
          storeName: "Tiệm Bánh Ngọt Ngào",
          openTime: "08:00",
          closeTime: "22:00",
          shopType: "Food",
          categoryId: "6",
          merchantId: "M005",
          foodName: "Tiramisu nhỏ",
          originalPrice: "45000",
          salePrice: "40000",
          foodImage: "/images/bunchahanoi.jpg",
          descriptions: "Vị cà phê thơm lừng",
          foodStatus: "Available",
          rating: 4.6,
          toppingOptions: [],
        },
        {
          id: "d8",
          storeName: "FastFood 247",
          openTime: "00:00",
          closeTime: "23:59",
          shopType: "Food",
          categoryId: "7",
          merchantId: "M006",
          foodName: "Combo Burger Bò",
          originalPrice: "89000",
          salePrice: "79000",
          foodImage: "/images/bunchahanoi.jpg",
          descriptions: "Kèm khoai tây và nước ngọt",
          foodStatus: "Available",
          rating: 4.5,
          toppingOptions: [],
        },
        {
          id: "d9",
          storeName: "Lẩu Nấm Gia Bảo",
          openTime: "10:00",
          closeTime: "23:00",
          shopType: "Food",
          categoryId: "8",
          merchantId: "M007",
          foodName: "Set Lẩu Nấm 2 Người",
          originalPrice: "350000",
          salePrice: "299000",
          foodImage: "/images/bunchahanoi.jpg",
          descriptions: "Các loại nấm tươi sạch",
          foodStatus: "Available",
          rating: 4.8,
          toppingOptions: [],
        },
        {
          id: "d10",
          storeName: "Tokyo Shushi",
          openTime: "10:30",
          closeTime: "22:00",
          shopType: "Food",
          categoryId: "9",
          merchantId: "M008",
          foodName: "Sashimi Cá Hồi",
          originalPrice: "180000",
          salePrice: "150000",
          foodImage: "/images/bunchahanoi.jpg",
          descriptions: "Cá hồi tươi Na Uy",
          foodStatus: "Available",
          rating: 4.9,
          toppingOptions: [],
        },
        {
          id: "d11",
          storeName: "Mì Cay Sasin",
          openTime: "08:00",
          closeTime: "23:00",
          shopType: "Food",
          categoryId: "10",
          merchantId: "M009",
          foodName: "Mì Cay Hải Sản Cấp 7",
          originalPrice: "65000",
          salePrice: "55000",
          foodImage: "/images/bunchahanoi.jpg",
          descriptions: "Dành cho tín đồ ăn cay",
          foodStatus: "Out of Stock",
          rating: 4.4,
          toppingOptions: [],
        },
        {
          id: "d12",
          storeName: "Phở Thìn Lò Đúc",
          openTime: "05:00",
          closeTime: "13:00",
          shopType: "Food",
          categoryId: "11",
          merchantId: "M010",
          foodName: "Phở Tái Lăn",
          originalPrice: "70000",
          salePrice: "70000",
          foodImage: "/images/bunchahanoi.jpg",
          descriptions: "Hương vị phở chuẩn xưa",
          foodStatus: "Available",
          rating: 4.7,
          toppingOptions: [],
        },
        {
          id: "d13",
          storeName: "Cơm Văn Phòng Online",
          openTime: "10:00",
          closeTime: "14:00",
          shopType: "Food",
          categoryId: "13",
          merchantId: "M011",
          foodName: "Combo Cơm Sườn Bì Bí Đỏ",
          originalPrice: "40000",
          salePrice: "35000",
          foodImage: "/images/bunchahanoi.jpg",
          descriptions: "Đảm bảo no bụng",
          foodStatus: "Available",
          rating: 4.5,
          toppingOptions: [],
        },
      ];
      setDishList(mockDishes);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPageLoading(false);
    }
  };

  const toggleShopStatus = (merchantId: string) => {
    setShops(
      shops.map((shop) => {
        if (shop.merchantId === merchantId) {
          const newStatus = shop.status === "Open" ? "Locked" : "Open";
          // Update all dishes for this merchant
          setDishList(
            dishList.map((dish) => {
              if (dish.merchantId === merchantId) {
                return {
                  ...dish,
                  foodStatus:
                    newStatus === "Locked" ? "Unavailable" : "Available",
                };
              }
              return dish;
            }),
          );
          return { ...shop, status: newStatus };
        }
        return shop;
      }),
    );
  };

  const filteredDishes = dishList.filter((dish) => {
    const matchesSearch =
      dish.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.storeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMerchant =
      selectedMerchantId === "all" || dish.merchantId === selectedMerchantId;
    return matchesSearch && matchesMerchant;
  });

  const totalPages = Math.ceil(filteredDishes.length / ITEMS_PER_PAGE);
  const paginatedDishes = filteredDishes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const selectedShop = shops.find((s) => s.merchantId === selectedMerchantId);

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
              placeholder="Tìm món hoặc quán..."
              className="pl-10 h-11 w-64 rounded-xl border-gray-100 focus:border-[#ee4d2d]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Shops Sidebar */}
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
                key={shop.merchantId}
                className={`group relative p-4 rounded-3xl border transition-all ${selectedMerchantId === shop.merchantId ? "border-[#ee4d2d] bg-orange-50/50" : "border-gray-100 bg-white hover:border-orange-200"}`}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedMerchantId(shop.merchantId)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="space-y-0.5">
                      <p
                        className={`font-black text-sm truncate pr-8 ${selectedMerchantId === shop.merchantId ? "text-[#ee4d2d]" : "text-gray-900"}`}
                      >
                        {shop.storeName}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                          #{shop.merchantId}
                        </p>
                        <span className="text-[10px] text-gray-300">•</span>
                        <p className="text-[10px] text-gray-400 font-bold italic truncate max-w-[100px]">
                          {shop.ownerName}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1 shadow-sm ${shop.status === "Open" ? "bg-green-500 ring-4 ring-green-50" : "bg-red-500 ring-4 ring-red-50"}`}
                    ></span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1.5">
                      <DollarSign
                        className={`h-3 w-3 ${selectedMerchantId === shop.merchantId ? "text-[#ee4d2d]" : "text-gray-400"}`}
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
                    className={`h-8 w-8 rounded-xl ${shop.status === "Open" ? "hover:bg-red-100 text-red-500" : "hover:bg-green-100 text-green-500"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleShopStatus(shop.merchantId);
                    }}
                    title={
                      shop.status === "Open" ? "Khóa quán" : "Mở khóa quán"
                    }
                  >
                    {shop.status === "Open" ? (
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

        {/* Dishes Main View */}
        <div className="lg:col-span-3 space-y-6">
          {/* Shop Performance Summary (only when a specific shop is selected) */}
          <Suspense
            fallback={
              <div className="h-32 bg-gray-50 animate-pulse rounded-[32px]"></div>
            }
          >
            {selectedShop && (
              <div className="grid grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <Card className="rounded-[32px] border-none bg-orange-50 shadow-none p-6">
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">
                    Chủ quán
                  </p>
                  <h4 className="text-xl font-black text-gray-900">
                    {selectedShop.ownerName}
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
                  <h4
                    className={`text-xl font-black ${selectedShop.status === "Open" ? "text-green-600" : "text-red-600"}`}
                  >
                    {selectedShop.status === "Open" ? "Mở" : "Khóa"}
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
                      <tr
                        key={dish.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={dish.foodImage}
                              alt={dish.foodName}
                              className="h-10 w-10 rounded-xl object-cover border border-gray-100"
                            />
                            <div>
                              <p className="font-bold text-gray-900">
                                {dish.foodName}
                              </p>
                              <p className="text-[10px] text-gray-400 font-medium line-clamp-1">
                                {dish.descriptions}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                            <p className="font-black text-[#ee4d2d]">
                              {Number(
                                dish.salePrice || dish.originalPrice,
                              ).toLocaleString()}
                              đ
                            </p>
                            {dish.salePrice && (
                              <p className="text-[10px] text-gray-400 line-through">
                                {Number(dish.originalPrice).toLocaleString()}đ
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                              dish.foodStatus === "Available"
                                ? "bg-green-50 text-green-600"
                                : dish.foodStatus === "Out of Stock"
                                  ? "bg-yellow-50 text-yellow-600"
                                  : "bg-red-50 text-red-600"
                            }`}
                          >
                            {dish.foodStatus === "Available"
                              ? "Đang bán"
                              : dish.foodStatus === "Out of Stock"
                                ? "Tạm hết"
                                : "Ngừng bán"}
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
