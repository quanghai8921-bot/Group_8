"use client";

import React, { useState, useEffect } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import {
  getFoodsByMerchant,
  createFood,
  updateFood,
  deleteFood,
  getAllCategories,
  Food,
  FoodCategory,
  Topping,
  handleApiError
} from "@/lib/apiClient";

import { useMerchant } from "@/hooks/useMerchant";

// Constants
const DEFAULT_DISH: Partial<Food> = {
  foodName: "",
  descriptions: "",
  originalPrice: 0,
  salePrice: 0,
  foodImage: "",
  foodStatus: 1,
  merchantId: "", 
};

const CATEGORY_ICON_MAP: Record<string, any> = {
  "Thức uống": Coffee,
  "Đồ ăn": Utensils,
  "Đồ chay": Leaf,
  "Bánh kem": IceCream,
  "Tráng miệng": IceCream,
  "Pizza/Burger": Pizza,
  "Món lẩu": Flame,
  Sushi: Fish,
  Mì: Soup,
  Phở: Soup,
  Bún: Soup,
  "Cơm hộp": Box,
  Default: Utensils,
};

export default function MenuManagement() {
  const { merchantId, isLoading: isMerchantLoading, error: merchantError } = useMerchant();
  const [dishList, setDishList] = useState<Food[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Food>>(DEFAULT_DISH);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSavingData, setIsSavingData] = useState(false);
  const [activeEditingId, setActiveEditingId] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchCategories();
    if (merchantId) {
      fetchFoods();
    }
  }, [merchantId]);

  const fetchCategories = async () => {
    try {
      const allCats = await getAllCategories();
      console.log("Categories from API:", allCats);

      if (!allCats || !Array.isArray(allCats) || allCats.length === 0) {
        console.warn("No categories found in API response, using local defaults.");
        const emergencyDefaults = [
          { categoryId: "CAT001", categoryName: "Đồ ăn" },
          { categoryId: "CAT002", categoryName: "Thức uống" },
          { categoryId: "CAT003", categoryName: "Tráng miệng" },
          { categoryId: "CAT004", categoryName: "Món chính" },
        ];
        setCategories(emergencyDefaults);
        return;
      }

      const normalizedCats = (allCats || []).map((c: any) => ({
        categoryId: c.categoryId || c.CategoryId || c.id || c.Id,
        categoryName: c.categoryName || c.CategoryName || c.name || c.Name
      }));
      setCategories(normalizedCats);
    } catch (e) {
      console.error("Error fetching categories, using local defaults:", e);
      setCategories([
        { categoryId: "CAT001", categoryName: "Đồ ăn" },
        { categoryId: "CAT002", categoryName: "Thức uống" },
        { categoryId: "CAT003", categoryName: "Tráng miệng" },
      ]);
    }
  };

  const fetchFoods = async () => {
    if (!merchantId) return;
    setIsPageLoading(true);
    try {
      const foods = await getFoodsByMerchant(merchantId, true);
      setDishList(foods || []);
    } catch (e) {
      console.error("Error fetching foods", e);
    } finally {
      setIsPageLoading(false);
    }
  };

  const totalPages = Math.ceil(dishList.length / ITEMS_PER_PAGE);
  const paginatedDishes = dishList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleInputFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    
    // Only allow digits for price fields
    if (name === "originalPrice" || name === "salePrice") {
      if (value !== "" && !/^\d+$/.test(value)) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: (name === "originalPrice" || name === "salePrice") ? (value === "" ? 0 : Number(value)) : value
    }));
  };

  const handleMenuFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingData(true);

    if (!formData.categoryId) {
      alert("Vui lòng chọn danh mục cho món ăn!");
      setIsSavingData(false);
      return;
    }

    try {
      if (activeEditingId) {
        const updated = await updateFood(activeEditingId, formData);
        setDishList(prev => prev.map(d => d.foodId === activeEditingId ? updated : d));
        alert("Cập nhật món ăn thành công!");
      } else {
        if (!merchantId) {
          alert("Không xác định được ID cửa hàng!");
          return;
        }
        const created = await createFood({ ...formData, merchantId });
        setDishList(prev => [created, ...prev]);
        alert("Thêm món ăn mới thành công!");
      }

      setIsModifyDialogOpen(false);
      setFormData(DEFAULT_DISH);
      setActiveEditingId(null);
    } catch (error: any) {
      const apiErr = handleApiError(error);
      alert(apiErr.message);
    } finally {
      setIsSavingData(false);
    }
  };

  const updateDishStatus = async (dishId: string, newStatus: number) => {
    try {
      const updated = await updateFood(dishId, { foodStatus: newStatus });
      setDishList(prev => prev.map(d => d.foodId === dishId ? updated : d));
    } catch (error: any) {
      const apiErr = handleApiError(error);
      alert(apiErr.message);
    }
  };



  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            Quản lý Thực đơn
          </h1>
          <p className="text-gray-500 font-medium">
            Quản lý thực đơn và các món ăn
          </p>
        </div>

        <Dialog open={isModifyDialogOpen} onOpenChange={setIsModifyDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold h-11 px-6 rounded-xl shadow-lg transition-all"
              onClick={() => {
                setFormData(DEFAULT_DISH);
                setActiveEditingId(null);
              }}
            >
              <Plus className="mr-2 h-5 w-5" /> Thêm món ăn mới
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[750px] overflow-y-auto max-h-[90vh] rounded-3xl p-0 border-none shadow-2xl">
            <DialogHeader className="p-8 pb-0">
              <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
                {activeEditingId ? "Cập nhật Món ăn" : "Thêm Món ăn Mới"}
              </DialogTitle>
              <DialogDescription className="text-gray-500 font-medium">
                Điền thông tin chi tiết món ăn
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleMenuFormSubmission} className="p-8 pt-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="foodName" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      Tên món ăn
                    </Label>
                    <Input
                      id="foodName"
                      name="foodName"
                      value={formData.foodName}
                      onChange={handleInputFieldChange}
                      placeholder="Ví dụ: Bún chả HN"
                      className="h-12 border-2 border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 font-medium"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="descriptions" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      Mô tả
                    </Label>
                    <Textarea
                      id="descriptions"
                      name="descriptions"
                      value={formData.descriptions}
                      onChange={handleInputFieldChange}
                      placeholder="Mô tả..."
                      className="min-h-[100px] border-2 border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 py-3 font-medium resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="originalPrice" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                        Giá gốc
                      </Label>
                      <Input
                        id="originalPrice"
                        name="originalPrice"
                        type="text"
                        inputMode="numeric"
                        value={formData.originalPrice === 0 ? "" : formData.originalPrice}
                        onChange={handleInputFieldChange}
                        placeholder="0"
                        className="h-12 border-2 border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 font-medium"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="salePrice" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                        Giá KM
                      </Label>
                      <Input
                        id="salePrice"
                        name="salePrice"
                        type="text"
                        inputMode="numeric"
                        value={formData.salePrice === 0 ? "" : formData.salePrice}
                        onChange={handleInputFieldChange}
                        placeholder="0"
                        className="h-12 border-2 border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="foodImage" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      URL Hình ảnh
                    </Label>
                    <Input
                      id="foodImage"
                      name="foodImage"
                      value={formData.foodImage}
                      onChange={handleInputFieldChange}
                      placeholder="https://..."
                      className="h-12 border-2 border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 font-medium"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      Danh mục
                    </Label>
                    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
                      {categories.length > 0 ? (
                        categories.map((cat) => {
                          const isSelected = formData.categoryId === cat.categoryId;
                          const Icon = CATEGORY_ICON_MAP[cat.categoryName] || CATEGORY_ICON_MAP["Default"];
                          return (
                            <div
                              key={cat.categoryId}
                              onClick={() => setFormData(prev => ({ ...prev, categoryId: cat.categoryId }))}
                              className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? "bg-red-50 border-[#ee4d2d] text-[#ee4d2d]" : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                                }`}
                            >
                              <Icon className="h-4 w-4 shrink-0" />
                              <span className="text-[11px] font-bold truncate leading-none">{cat.categoryName}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-2 py-8 text-center text-gray-400 text-sm italic">
                          Đang tải danh mục hoặc không có dữ liệu...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  disabled={isSavingData}
                  className="w-full bg-[#ee4d2d] hover:bg-[#d73211] text-white font-black uppercase tracking-widest h-12 rounded-xl shadow-lg transition-all"
                >
                  {isSavingData ? "Đang xử lý..." : (activeEditingId ? "Cập nhật dữ liệu" : "Lưu món ăn")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-3xl border-none shadow-xl shadow-gray-100/50 overflow-hidden">
        <CardHeader className="p-8 pb-4">
          <CardTitle className="text-xl font-black text-gray-900">Danh sách Món ăn</CardTitle>
          <CardDescription className="text-gray-500 font-medium">Hiện có {dishList.length} món ăn được tải từ Database</CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {isPageLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
              <div className="h-12 w-12 border-4 border-[#ee4d2d]/10 border-t-[#ee4d2d] rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-y border-gray-100">
                    <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Món ăn</th>
                    <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Danh mục</th>
                    <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Giá bán</th>
                    <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                    <th className="p-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedDishes.map((dish) => (
                    <tr key={dish.foodId} className={`group hover:bg-gray-50/80 transition-all ${dish.foodStatus === 0 ? "opacity-50" : ""}`}>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`h-16 w-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0 shadow-sm transition-transform group-hover:scale-105 relative ${dish.foodStatus === 0 ? "grayscale" : ""}`}>
                            <img src={dish.foodImage} alt={dish.foodName} className="h-full w-full object-cover" />
                            {dish.foodStatus === 0 && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="text-[8px] font-black text-white uppercase tracking-tighter text-center px-1">Hết hàng</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-black text-gray-900">{dish.foodName}</p>
                            <p className="text-xs text-gray-500 font-medium line-clamp-1">{dish.descriptions}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <Badge className="bg-orange-50 text-orange-600 rounded-lg px-2 py-1 text-[10px] font-black uppercase border-none">
                          {dish.categoryName || "Unknown"}
                        </Badge>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="font-black text-gray-900">{(dish.salePrice || dish.originalPrice).toLocaleString()}đ</span>
                          {dish.salePrice && dish.salePrice < dish.originalPrice && (
                            <span className="text-[10px] text-gray-400 font-bold line-through">{dish.originalPrice.toLocaleString()}đ</span>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                        <select
                          value={dish.foodStatus}
                          onChange={(e) => updateDishStatus(dish.foodId, Number(e.target.value))}
                          className={`appearance-none rounded-xl px-4 py-2 text-xs font-black uppercase tracking-tight border-2 cursor-pointer outline-none transition-all ${
                            dish.foodStatus === 1 ? "bg-green-50 border-green-100 text-green-600" : 
                            dish.foodStatus === 0 ? "bg-orange-50 border-orange-100 text-orange-600" : 
                            "bg-gray-50 border-gray-100 text-gray-400"
                          }`}
                        >
                          <option value={1}>Còn bán</option>
                          <option value={0}>Hết hàng</option>
                          <option value={-1}>Ngừng bán</option>
                        </select>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setFormData(dish); setActiveEditingId(dish.foodId); setIsModifyDialogOpen(true); }}
                            className="h-10 w-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        {totalPages > 1 && (
          <CardFooter className="p-8 pt-6 border-t border-gray-50 flex justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
