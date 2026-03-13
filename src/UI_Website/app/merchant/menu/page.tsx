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
import { getMockDishes } from "@/lib/apiClient";

// Types
export interface ToppingOption {
  ToppingId: string;
  ToppingName: string;
  Price: number;
}

export interface Category {
  CategoryId: string;
  CategoryName: string;
}

export interface Dish {
  FoodId: string;
  CategoryId: string;
  MerchantId: string;
  FoodName: string;
  OriginalPrice: number;
  SalePrice: number;
  FoodImage: string;
  Descriptions: string;
  FoodStatus: number; // 1: Available, 0: Unavailable
  storeName?: string;
  shopType?: string;
  rating?: number;
  toppingOptions?: ToppingOption[];
}

// Constants
const DEFAULT_DISH: Partial<Dish> = {
  FoodName: "",
  Descriptions: "",
  OriginalPrice: 0,
  SalePrice: 0,
  FoodImage: "",
  FoodStatus: 1,
  CategoryId: "3", // Default to "Đồ ăn"
  MerchantId: "M001",
  rating: 5,
  toppingOptions: [],
};

const STATIC_CATEGORIES: Category[] = [
  { CategoryId: "1", CategoryName: "Tất cả" },
  { CategoryId: "2", CategoryName: "Thức uống" },
  { CategoryId: "3", CategoryName: "Đồ ăn" },
  { CategoryId: "4", CategoryName: "Đồ chay" },
  { CategoryId: "5", CategoryName: "Bánh kem" },
  { CategoryId: "6", CategoryName: "Tráng miệng" },
  { CategoryId: "7", CategoryName: "Pizza/Burger" },
  { CategoryId: "8", CategoryName: "Món lẩu" },
  { CategoryId: "9", CategoryName: "Sushi" },
  { CategoryId: "10", CategoryName: "Mì" },
  { CategoryId: "11", CategoryName: "Phở" },
  { CategoryId: "12", CategoryName: "Bún" },
  { CategoryId: "13", CategoryName: "Cơm hộp" },
];

const CATEGORY_ICON_MAP: Record<string, any> = {
  "Tất cả": LayoutGrid,
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

/**
 * Component quản lý thực đơn của Merchant
 */
export default function MenuManagement() {
  // states
  const [dishList, setDishList] = useState<Dish[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Dish>>(DEFAULT_DISH);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSavingData, setIsSavingData] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [activeEditingId, setActiveEditingId] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 10;

  // Effects
  useEffect(() => {
    fetchDishesFromServer();
  }, []);

  // Derived states
  const totalPages = Math.ceil(dishList.length / ITEMS_PER_PAGE);
  const paginatedDishes = dishList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const fetchDishesFromServer = async () => {
    setIsPageLoading(true);
    try {
      const mockDishes = await getMockDishes();
      // Only keep dishes for this particular merchant (assuming M001 for now)
      setDishList(mockDishes.filter(d => d.MerchantId === "M001"));
    } catch (error) {
      console.error("Error fetching dishes:", error);
    } finally {
      setIsPageLoading(false);
    }
  };

  // Form Handlers
  const handleInputFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: (name === "OriginalPrice" || name === "SalePrice") ? Number(value) : value 
    }));
  };

  const handleImageFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImageFile(e.target.files[0]);
    }
  };

  const addNewToppingOption = () => {
    setFormData((prev) => ({
      ...prev,
      toppingOptions: [
        ...(prev.toppingOptions || []),
        { ToppingId: `T${Date.now()}`, ToppingName: "", Price: 0 },
      ],
    }));
  };

  const updateToppingOption = (
    index: number,
    fieldName: keyof ToppingOption,
    newValue: any,
  ) => {
    const currentToppings = [...(formData.toppingOptions || [])];
    currentToppings[index] = {
      ...currentToppings[index],
      [fieldName]: fieldName === "Price" ? Number(newValue) : newValue,
    };
    setFormData((prev) => ({ ...prev, toppingOptions: currentToppings }));
  };

  const removeToppingOption = (index: number) => {
    const currentToppings = [...(formData.toppingOptions || [])];
    currentToppings.splice(index, 1);
    setFormData((prev) => ({ ...prev, toppingOptions: currentToppings }));
  };

  const handleMenuFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingData(true);

    if (!formData.CategoryId) {
      alert("Vui lòng chọn danh mục cho món ăn!");
      setIsSavingData(false);
      return;
    }

    try {
      let finalImageUrl = formData.FoodImage || "";
      if (selectedImageFile) {
        finalImageUrl = URL.createObjectURL(selectedImageFile);
      }

      const preparedDishData = {
        ...formData,
        FoodId: activeEditingId || `d${Math.floor(Math.random() * 1000)}`,
        FoodImage: finalImageUrl,
      } as Dish;

      // Simulate API call Delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (activeEditingId) {
        // Update existing
        setDishList((prev) =>
          prev.map((d) => (d.FoodId === activeEditingId ? preparedDishData : d)),
        );
        alert("Cập nhật món ăn thành công!");
      } else {
        // Add new
        setDishList((prev) => [preparedDishData, ...prev]);
        alert("Thêm món ăn mới thành công!");
      }

      setIsModifyDialogOpen(false);
      setFormData(DEFAULT_DISH);
      setActiveEditingId(null);
      setSelectedImageFile(null);
    } catch (error: any) {
      console.error("Critical error saving dish:", error);
      alert(`Đã xảy ra lỗi: ${error.message || "Không thể kết nối"}`);
    } finally {
      setIsSavingData(false);
    }
  };

  const updateDishAvailabilityStatus = async (
    dishId: string,
    newStatusValue: number,
  ) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setDishList((prev) =>
        prev.map((dish) =>
          dish.FoodId === dishId
            ? { ...dish, FoodStatus: newStatusValue }
            : dish,
        ),
      );
    } catch (error) {
      console.error("Error updating dish status:", error);
      alert("Đã xảy ra lỗi khi kết nối với máy chủ");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            Quản lý Thực đơn
          </h1>
          <p className="text-gray-500 font-medium">
            Chỉnh sửa thực đơn và quản lý các món ăn trong cửa hàng của bạn
          </p>
        </div>

        <Dialog open={isModifyDialogOpen} onOpenChange={setIsModifyDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-orange-100 transition-all hover:scale-[1.02] active:scale-95"
              onClick={() => {
                setFormData(DEFAULT_DISH);
                setActiveEditingId(null);
                setSelectedImageFile(null);
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
                Điền thông tin chi tiết về món ăn để hiển thị trên ứng dụng.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleMenuFormSubmission}
              className="p-8 pt-6 space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Basic Info */}
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="FoodName"
                      className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1"
                    >
                      Tên món ăn
                    </Label>
                    <Input
                      id="FoodName"
                      name="FoodName"
                      value={formData.FoodName}
                      onChange={handleInputFieldChange}
                      placeholder="Ví dụ: Bún chả HN"
                      className="h-12 border-2 border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 font-medium transition-all"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="Descriptions"
                      className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1"
                    >
                      Mô tả
                    </Label>
                    <Textarea
                      id="Descriptions"
                      name="Descriptions"
                      value={formData.Descriptions}
                      onChange={handleInputFieldChange}
                      placeholder="Mô tả ngắn gọn về món ăn..."
                      className="min-h-[100px] border-2 border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 py-3 font-medium transition-all resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="OriginalPrice"
                        className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1"
                      >
                        Giá gốc
                      </Label>
                      <Input
                        id="OriginalPrice"
                        name="OriginalPrice"
                        type="number"
                        value={formData.OriginalPrice}
                        onChange={handleInputFieldChange}
                        placeholder="50000"
                        className="h-12 border-2 border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 font-medium transition-all"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="SalePrice"
                        className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1"
                      >
                        Giá KM
                      </Label>
                      <Input
                        id="SalePrice"
                        name="SalePrice"
                        type="number"
                        value={formData.SalePrice}
                        onChange={handleInputFieldChange}
                        placeholder="45000"
                        className="h-12 border-2 border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 font-medium transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Image & Category */}
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      Hình ảnh
                    </Label>
                    <div className="relative group cursor-pointer">
                      <div className="w-full aspect-video rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-[#ee4d2d]/30">
                        {selectedImageFile ||
                        (formData.FoodImage && formData.FoodImage !== "") ? (
                          <div className="relative w-full h-full">
                            <img
                              src={
                                selectedImageFile
                                  ? URL.createObjectURL(selectedImageFile)
                                  : formData.FoodImage
                              }
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="flex flex-col items-center gap-2">
                                <span className="bg-white text-[#ee4d2d] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                  Thay đổi ảnh (PC)
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-gray-300 mb-2" />
                            <div className="flex flex-col items-center gap-2">
                              <span className="bg-[#ee4d2d] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                                This PC
                              </span>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                Chọn ảnh từ máy tính
                              </span>
                            </div>
                          </div>
                        )}
                        <input
                          id="FoodImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileSelection}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-[100]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      Danh mục
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {STATIC_CATEGORIES.slice(1).map((category) => {
                        const isSelected =
                          formData.CategoryId === category.CategoryId;
                        const Icon =
                          CATEGORY_ICON_MAP[category.CategoryName] ||
                          CATEGORY_ICON_MAP["Default"];
                        return (
                          <div
                            key={category.CategoryId}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                CategoryId: category.CategoryId,
                              }))
                            }
                            className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                              isSelected
                                ? "bg-red-50 border-[#ee4d2d] text-[#ee4d2d]"
                                : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                            }`}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="text-[11px] font-bold truncate leading-none">
                              {category.CategoryName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Toppings Section */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                    Tùy chọn thêm (Toppings)
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addNewToppingOption}
                    className="h-8 border-2 border-orange-100 text-[#ee4d2d] hover:bg-orange-50 font-bold rounded-lg"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Thêm tùy chọn
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.toppingOptions?.map((topping, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-end p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:border-gray-200"
                    >
                      <div className="flex-1 space-y-1">
                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Tên tùy chọn
                        </Label>
                        <Input
                          value={topping.ToppingName}
                          onChange={(e) =>
                            updateToppingOption(
                              index,
                              "ToppingName",
                              e.target.value,
                            )
                          }
                          placeholder="Ví dụ: Thêm trứng"
                          className="h-10 bg-white border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 font-medium"
                        />
                      </div>
                      <div className="w-32 space-y-1">
                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Giá (đ)
                        </Label>
                        <Input
                          value={topping.Price}
                          onChange={(e) =>
                            updateToppingOption(index, "Price", e.target.value)
                          }
                          placeholder="5000"
                          className="h-10 bg-white border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 font-medium"
                          type="number"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeToppingOption(index)}
                        className="h-10 w-10 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {(!formData.toppingOptions ||
                    formData.toppingOptions.length === 0) && (
                    <div className="text-center py-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                      <p className="text-xs text-gray-400 font-bold">
                        Chưa có tùy chọn nào
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  disabled={isSavingData}
                  className="w-full bg-[#ee4d2d] hover:bg-[#d73211] text-white font-black uppercase tracking-widest h-12 rounded-xl shadow-lg shadow-orange-100 transition-all hover:scale-[1.01]"
                >
                  {isSavingData
                    ? "Đang lưu..."
                    : activeEditingId
                      ? "Cập nhật Món ăn"
                      : "Lưu Món ăn"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* List section */}
      <Card className="rounded-3xl border-none shadow-xl shadow-gray-100/50 overflow-hidden">
        <CardHeader className="p-8 pb-4">
          <CardTitle className="text-xl font-black text-gray-900">
            Danh sách Món ăn
          </CardTitle>
          <CardDescription className="text-gray-500 font-medium">
            Bạn có tổng cộng {dishList.length} món trong thực đơn
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {isPageLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
              <div className="h-12 w-12 border-4 border-[#ee4d2d]/10 border-t-[#ee4d2d] rounded-full animate-spin" />
              <p className="font-extrabold uppercase tracking-widest text-xs">
                Đang tải dữ liệu...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-y border-gray-100">
                    <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Món ăn
                    </th>
                    <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Loại
                    </th>
                    <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Giá bán
                    </th>
                    <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Trạng thái
                    </th>
                    <th className="p-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedDishes.map((dish) => (
                    <tr
                      key={dish.FoodId}
                      className="group hover:bg-gray-50/80 transition-all"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0 shadow-sm transition-transform group-hover:scale-105">
                            <img
                              src={dish.FoodImage}
                              alt={dish.FoodName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-black text-gray-900">
                              {dish.FoodName}
                            </p>
                            <p className="text-xs text-gray-500 font-medium line-clamp-1">
                              {dish.Descriptions}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <Badge
                          className={`rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-tight border-none ${
                            dish.shopType === "Food"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {dish.shopType === "Food" ? "Đồ ăn" : "Đồ uống"}
                        </Badge>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="font-black text-gray-900">
                            {(dish.SalePrice || dish.OriginalPrice).toLocaleString()}đ
                          </span>
                          {dish.SalePrice !== dish.OriginalPrice && (
                            <span className="text-[10px] text-gray-400 font-bold line-through">
                              {dish.OriginalPrice.toLocaleString()}đ
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="relative inline-block w-40">
                          <select
                            value={dish.FoodStatus}
                            onChange={(e) =>
                              updateDishAvailabilityStatus(
                                dish.FoodId,
                                Number(e.target.value),
                              )
                            }
                            className={`w-full appearance-none rounded-xl px-4 py-2 text-xs font-black uppercase tracking-tight border-2 cursor-pointer outline-none transition-all
                                                            ${
                                                              dish.FoodStatus === 1
                                                                ? "bg-green-50 border-green-100 text-green-600 focus:border-green-300"
                                                                : "bg-red-50 border-red-100 text-red-600 focus:border-red-300"
                                                            }`}
                          >
                            <option value={1}>Còn bán</option>
                            <option value={0}>Ngừng bán</option>
                          </select>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setFormData(dish);
                              setActiveEditingId(dish.FoodId);
                              setIsModifyDialogOpen(true);
                            }}
                            className="h-10 w-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {dishList.length === 0 && !isPageLoading && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-2 grayscale">
                          <Utensils className="h-12 w-12 text-gray-200" />
                          <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
                            Chưa có món ăn nào
                          </p>
                          <Button
                            variant="link"
                            className="text-[#ee4d2d] font-bold"
                            onClick={() => setIsModifyDialogOpen(true)}
                          >
                            Thêm món đầu tiên ngay
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>

        {/* Pagination section */}
        {totalPages > 1 && (
          <CardFooter className="p-8 pt-6 border-t border-gray-50 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
