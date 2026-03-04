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
    CardFooter
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
import { Checkbox } from "@/components/ui/checkbox";
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
    Fish
} from "lucide-react";

// Types
export interface ToppingOption {
    toppingName: string;
    price: string;
}

export interface Category {
    categoryid: string;
    categoryname: string;
}

export interface Dish {
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

// Constants
const DEFAULT_DISH: Partial<Dish> = {
    foodName: "",
    descriptions: "",
    originalPrice: "",
    salePrice: "",
    foodImage: "/images/bunchahanoi.jpg",
    foodStatus: "Available",
    categoryId: "",
    merchantId: "M001",
    rating: 5,
    toppingOptions: []
};

const STATIC_CATEGORIES: Category[] = [
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

const CATEGORY_ICON_MAP: Record<string, any> = {
    "Tất cả": LayoutGrid,
    "Thức uống": Coffee,
    "Đồ ăn": Utensils,
    "Đồ chay": Leaf,
    "Bánh kem": IceCream,
    "Tráng miệng": IceCream,
    "Pizza/Burger": Pizza,
    "Món lẩu": Flame,
    "Sushi": Fish,
    "Mì": Soup,
    "Phở": Soup,
    "Bún": Soup,
    "Cơm hộp": Box,
    "Default": Utensils
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
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSavingData, setIsSavingData] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [activeEditingId, setActiveEditingId] = useState<string | null>(null);

    const ITEMS_PER_PAGE = 10;

    // Effects
    useEffect(() => {
        const loadInitialData = async () => {
            setIsPageLoading(true);
            await Promise.all([
                fetchDishesFromServer(),
                initializeCategories()
            ]);
            setIsPageLoading(false);
        };

        loadInitialData();
    }, []);

    // Derived states
    const totalPages = Math.ceil(dishList.length / ITEMS_PER_PAGE);
    const paginatedDishes = dishList.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Initialization methods
    const initializeCategories = async () => {
        setCategoryList(STATIC_CATEGORIES);
        if (!formData.categoryId) {
            setFormData(prev => ({
                ...prev,
                categoryId: STATIC_CATEGORIES[0].categoryid
            }));
        }
    };

    const fetchDishesFromServer = async () => {
        try {
            // Mock data - In real app, this would be an API call
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
                    toppingOptions: []
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
                    toppingOptions: []
                }
            ];
            setDishList(mockDishes);
        } catch (error) {
            console.error("Error fetching dishes:", error);
        } finally {
            setIsPageLoading(false);
        }
    };

    // Form Handlers
    const handleInputFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImageFile(e.target.files[0]);
        }
    };

    const addNewToppingOption = () => {
        setFormData(prev => ({
            ...prev,
            toppingOptions: [...(prev.toppingOptions || []), { toppingName: "", price: "" }]
        }));
    };

    const updateToppingOption = (index: number, fieldName: keyof ToppingOption, newValue: string) => {
        const currentToppings = [...(formData.toppingOptions || [])];
        currentToppings[index] = { ...currentToppings[index], [fieldName]: newValue };
        setFormData(prev => ({ ...prev, toppingOptions: currentToppings }));
    };

    const removeToppingOption = (index: number) => {
        const currentToppings = [...(formData.toppingOptions || [])];
        currentToppings.splice(index, 1);
        setFormData(prev => ({ ...prev, toppingOptions: currentToppings }));
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
            let finalImageUrl = formData.foodImage;
            if (selectedImageFile) {
                finalImageUrl = URL.createObjectURL(selectedImageFile);
            }

            const preparedDishData = { ...formData, foodImage: finalImageUrl };
            const apiEndpoint = activeEditingId ? `/api/dishes/${activeEditingId}` : "/api/dishes";
            const apiMethod = activeEditingId ? "PUT" : "POST";

            const response = await fetch(apiEndpoint, {
                method: apiMethod,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(preparedDishData)
            });

            if (response.ok) {
                alert(activeEditingId ? "Cập nhật món ăn thành công!" : "Lưu món ăn thành công!");
                await fetchDishesFromServer();
                setIsModifyDialogOpen(false);
                setFormData(DEFAULT_DISH);
                setActiveEditingId(null);
                setSelectedImageFile(null);
            } else {
                const errorResponse = await response.json();
                alert(`Lỗi khi lưu món ăn: ${errorResponse.error || "Không xác định"}`);
            }
        } catch (error: any) {
            console.error("Critical error saving dish:", error);
            alert(`Đã xảy ra lỗi: ${error.message || "Không thể kết nối với máy chủ"}`);
        } finally {
            setIsSavingData(false);
        }
    };

    const updateDishAvailabilityStatus = async (dishId: string, newStatusValue: string) => {
        try {
            const response = await fetch(`/api/dishes/${dishId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ foodStatus: newStatusValue })
            });

            if (response.ok) {
                setDishList(prev => prev.map(dish =>
                    dish.id === dishId ? { ...dish, foodStatus: newStatusValue as any } : dish
                ));
            } else {
                const errorResponse = await response.json();
                alert(`Lỗi: ${errorResponse.error || "Không thể cập nhật trạng thái"}`);
            }
        } catch (error) {
            console.error("Error updating dish status:", error);
            alert("Đã xảy ra lỗi khi kết nối với máy chủ");
        }
    };

    const softDeleteDish = async (dishId: string) => {
        await updateDishAvailabilityStatus(dishId, 'Unavailable');
    };


    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Quản lý Thực đơn</h1>
                    <p className="text-gray-500 font-medium">Chỉnh sửa thực đơn và quản lý các món ăn trong cửa hàng của bạn</p>
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

                        <form onSubmit={handleMenuFormSubmission} className="p-8 pt-6 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: Basic Info */}
                                <div className="space-y-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="foodName" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Tên món ăn</Label>
                                        <Input
                                            id="foodName"
                                            name="foodName"
                                            value={formData.foodName}
                                            onChange={handleInputFieldChange}
                                            placeholder="Ví dụ: Bún chả HN"
                                            className="h-12 border-2 border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 font-medium transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="descriptions" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Mô tả</Label>
                                        <Textarea
                                            id="descriptions"
                                            name="descriptions"
                                            value={formData.descriptions}
                                            onChange={handleInputFieldChange}
                                            placeholder="Mô tả ngắn gọn về món ăn..."
                                            className="min-h-[100px] border-2 border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 py-3 font-medium transition-all resize-none"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="originalPrice" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Giá gốc</Label>
                                            <Input
                                                id="originalPrice"
                                                name="originalPrice"
                                                type="number"
                                                value={formData.originalPrice}
                                                onChange={handleInputFieldChange}
                                                placeholder="50000"
                                                className="h-12 border-2 border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 font-medium transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="salePrice" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Giá KM</Label>
                                            <Input
                                                id="salePrice"
                                                name="salePrice"
                                                type="number"
                                                value={formData.salePrice}
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
                                        <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Hình ảnh</Label>
                                        <div className="relative group cursor-pointer">
                                            <div className="w-full aspect-video rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-[#ee4d2d]/30">
                                                {selectedImageFile || formData.foodImage ? (
                                                    <img
                                                        src={selectedImageFile ? URL.createObjectURL(selectedImageFile) : formData.foodImage}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <>
                                                        <Upload className="h-8 w-8 text-gray-300 mb-2" />
                                                        <span className="text-xs text-gray-400 font-bold">Chọn ảnh từ máy tính</span>
                                                    </>
                                                )}
                                                <Input
                                                    id="foodImage"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageFileSelection}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Danh mục</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {STATIC_CATEGORIES.slice(1).map((category) => {
                                                const isSelected = formData.categoryId === category.categoryid;
                                                const Icon = CATEGORY_ICON_MAP[category.categoryname] || CATEGORY_ICON_MAP["Default"];
                                                return (
                                                    <div
                                                        key={category.categoryid}
                                                        onClick={() => setFormData(prev => ({ ...prev, categoryId: category.categoryid }))}
                                                        className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                                            ? 'bg-red-50 border-[#ee4d2d] text-[#ee4d2d]'
                                                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                                            }`}
                                                    >
                                                        <Icon className="h-4 w-4 shrink-0" />
                                                        <span className="text-[11px] font-bold truncate leading-none">{category.categoryname}</span>
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
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Tùy chọn thêm (Toppings)</h3>
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
                                        <div key={index} className="flex gap-3 items-end p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:border-gray-200">
                                            <div className="flex-1 space-y-1">
                                                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên tùy chọn</Label>
                                                <Input
                                                    value={topping.toppingName}
                                                    onChange={(e) => updateToppingOption(index, 'toppingName', e.target.value)}
                                                    placeholder="Ví dụ: Thêm trứng"
                                                    className="h-10 bg-white border-gray-100 focus:border-[#ee4d2d] rounded-xl px-4 font-medium"
                                                />
                                            </div>
                                            <div className="w-32 space-y-1">
                                                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Giá (đ)</Label>
                                                <Input
                                                    value={topping.price}
                                                    onChange={(e) => updateToppingOption(index, 'price', e.target.value)}
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
                                    {(!formData.toppingOptions || formData.toppingOptions.length === 0) && (
                                        <div className="text-center py-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                            <p className="text-xs text-gray-400 font-bold">Chưa có tùy chọn nào</p>
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
                                    {isSavingData ? "Đang lưu..." : (activeEditingId ? "Cập nhật Món ăn" : "Lưu Món ăn")}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* List section */}
            <Card className="rounded-3xl border-none shadow-xl shadow-gray-100/50 overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-xl font-black text-gray-900">Danh sách Món ăn</CardTitle>
                    <CardDescription className="text-gray-500 font-medium">Bạn có tổng cộng {dishList.length} món trong thực đơn</CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                    {isPageLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                            <div className="h-12 w-12 border-4 border-[#ee4d2d]/10 border-t-[#ee4d2d] rounded-full animate-spin" />
                            <p className="font-extrabold uppercase tracking-widest text-xs">Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-y border-gray-100">
                                        <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Món ăn</th>
                                        <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Loại</th>
                                        <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Giá bán</th>
                                        <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                                        <th className="p-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {paginatedDishes.map((dish) => (
                                        <tr key={dish.id} className="group hover:bg-gray-50/80 transition-all">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-16 w-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0 shadow-sm transition-transform group-hover:scale-105">
                                                        <img src={dish.foodImage} alt={dish.foodName} className="h-full w-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900">{dish.foodName}</p>
                                                        <p className="text-xs text-gray-500 font-medium line-clamp-1">{dish.descriptions}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <Badge className={`rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-tight border-none ${dish.shopType === "Food"
                                                    ? "bg-orange-50 text-orange-600"
                                                    : "bg-blue-50 text-blue-600"
                                                    }`}>
                                                    {dish.shopType === "Food" ? "Đồ ăn" : "Đồ uống"}
                                                </Badge>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-gray-900">{Number(dish.salePrice || dish.originalPrice).toLocaleString()}đ</span>
                                                    {dish.salePrice && (
                                                        <span className="text-[10px] text-gray-400 font-bold line-through">{Number(dish.originalPrice).toLocaleString()}đ</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="relative inline-block w-40">
                                                    <select
                                                        value={dish.foodStatus}
                                                        onChange={(e) => updateDishAvailabilityStatus(dish.id, e.target.value)}
                                                        className={`w-full appearance-none rounded-xl px-4 py-2 text-xs font-black uppercase tracking-tight border-2 cursor-pointer outline-none transition-all
                                                            ${dish.foodStatus === "Available"
                                                                ? "bg-green-50 border-green-100 text-green-600 focus:border-green-300"
                                                                : dish.foodStatus === "Out of Stock"
                                                                    ? "bg-yellow-50 border-yellow-100 text-yellow-600 focus:border-yellow-300"
                                                                    : "bg-red-50 border-red-100 text-red-600 focus:border-red-300"
                                                            }`}
                                                    >
                                                        <option value="Available">Còn bán</option>
                                                        <option value="Out of Stock">Hết hàng</option>
                                                        <option value="Unavailable">Ngừng bán</option>
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
                                                            setActiveEditingId(dish.id);
                                                            setIsModifyDialogOpen(true);
                                                        }}
                                                        className="h-10 w-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            if (confirm(`Bạn có chắc muốn ngừng bán món "${dish.foodName}"?`)) {
                                                                softDeleteDish(dish.id);
                                                            }
                                                        }}
                                                        className="h-10 w-10 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
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
                                                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Chưa có món ăn nào</p>
                                                    <Button variant="link" className="text-[#ee4d2d] font-bold" onClick={() => setIsModifyDialogOpen(true)}>
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

