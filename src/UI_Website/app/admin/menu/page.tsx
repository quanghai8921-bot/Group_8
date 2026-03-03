"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
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
} from "lucide-react"


interface ToppingOption {
    toppingName: string
    price: string
}

interface Category {
    categoryid: string
    categoryname: string
}

interface Dish {
    id: string

    storeName: string
    openTime: string
    closeTime: string
    shopType: "Food" | "Drink"


    categoryId: string
    merchantId: string
    foodName: string
    originalPrice: string
    salePrice: string
    foodImage: string
    descriptions: string
    foodStatus: "Available" | "Out of Stock" | "Unavailable"


    rating?: number
    toppingOptions?: ToppingOption[]
}

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
]

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
}


export default function MenuManagement() {



    const [dishList, setDishList] = useState<Dish[]>([]);


    const [isPageLoading, setIsPageLoading] = useState(true);


    const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false);


    const [formData, setFormData] = useState<Partial<Dish>>(DEFAULT_DISH);


    const [categoryList, setCategoryList] = useState<Category[]>([]);


    const [isSavingData, setIsSavingData] = useState(false);


    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);


    const [formErrorMessage, setFormErrorMessage] = useState("");


    const [activeEditingId, setActiveEditingId] = useState<string | null>(null);




    useEffect(function onInitialization() {
        async function loadInitialData() {
            setIsPageLoading(true);

            await Promise.all([
                fetchDishesFromServer(),
                initializeCategories()
            ]);
            setIsPageLoading(false);
        };

        loadInitialData();
    }, []);




    async function initializeCategories() {
        setCategoryList(STATIC_CATEGORIES);


        if (!formData.categoryId) {
            setFormData(function (previousData) {
                return {
                    ...previousData,
                    categoryId: STATIC_CATEGORIES[0].categoryid
                };
            });
        }
    }


    async function fetchDishesFromServer() {
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
    }




    function handleInputFieldChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setFormData(function (previousData) {
            return { ...previousData, [name]: value };
        });
    }


    function handleImageFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files[0]) {
            setSelectedImageFile(event.target.files[0]);
            setFormErrorMessage("");
        }
    }


    function addNewToppingOption() {
        setFormData(function (previousData) {
            const currentToppings = previousData.toppingOptions || [];
            return {
                ...previousData,
                toppingOptions: [...currentToppings, { toppingName: "", price: "" }]
            };
        });
    }


    function updateToppingOption(index: number, fieldName: keyof ToppingOption, newValue: string) {
        const currentToppings = [...(formData.toppingOptions || [])];
        currentToppings[index] = { ...currentToppings[index], [fieldName]: newValue };

        setFormData(function (previousData) {
            return { ...previousData, toppingOptions: currentToppings };
        });
    }


    function removeToppingOption(index: number) {
        const currentToppings = [...(formData.toppingOptions || [])];
        currentToppings.splice(index, 1);

        setFormData(function (previousData) {
            return { ...previousData, toppingOptions: currentToppings };
        });
    }


    async function handleMenuFormSubmission(event: React.FormEvent) {
        event.preventDefault();
        setIsSavingData(true);
        setFormErrorMessage("");


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


            const preparedDishData = {
                ...formData,
                foodImage: finalImageUrl
            };


            const apiEndpoint = activeEditingId ? `/api/dishes/${activeEditingId}` : "/api/dishes";
            const apiMethod = activeEditingId ? "PUT" : "POST";

            const response = await fetch(apiEndpoint, {
                method: apiMethod,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(preparedDishData)
            });

            if (response.ok) {
                const successMessage = activeEditingId ? "Cập nhật món ăn thành công!" : "Lưu món ăn thành công!";
                alert(successMessage);


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
    }


    async function updateDishAvailabilityStatus(dishId: string, newStatusValue: string) {
        try {
            const response = await fetch(`/api/dishes/${dishId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ foodStatus: newStatusValue })
            });

            if (response.ok) {

                setDishList(function (previousList) {
                    return previousList.map(function (dish) {
                        if (dish.id === dishId) {
                            return { ...dish, foodStatus: newStatusValue as any };
                        } else {
                            return dish;
                        }
                    });
                });
            } else {
                const errorResponse = await response.json();
                alert(`Lỗi: ${errorResponse.error || "Không thể cập nhật trạng thái"}`);
            }
        } catch (error) {
            console.error("Error updating dish status:", error);
            alert("Đã xảy ra lỗi khi kết nối với máy chủ");
        }
    }


    async function softDeleteDish(dishId: string) {
        await updateDishAvailabilityStatus(dishId, 'Unavailable');
    }

    return (
        <div className="space-y-6">
            { }
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Menu Management</h1>
                    <p className="text-gray-500">Manage your restaurant menu items</p>
                </div>

                { }
                <Dialog open={isModifyDialogOpen} onOpenChange={setIsModifyDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-[#ee4d2d] hover:bg-[#d73211] text-white shadow-md shadow-red-100"
                            onClick={function () {
                                setFormData(DEFAULT_DISH);
                                setActiveEditingId(null);
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add New Dish
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[700px] overflow-y-auto max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>{activeEditingId ? "Edit Dish" : "Add New Dish"}</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleMenuFormSubmission} className="grid gap-6 py-4">
                            <div className="grid gap-4">
                                { }
                                <div className="grid gap-2">
                                    <Label htmlFor="foodName">Dish Name</Label>
                                    <Input
                                        id="foodName"
                                        name="foodName"
                                        value={formData.foodName}
                                        onChange={handleInputFieldChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="descriptions">Description</Label>
                                    <Input
                                        id="descriptions"
                                        name="descriptions"
                                        value={formData.descriptions}
                                        onChange={handleInputFieldChange}
                                        required
                                    />
                                </div>

                                { }
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="originalPrice">Original Price</Label>
                                        <Input
                                            id="originalPrice"
                                            name="originalPrice"
                                            type="number"
                                            value={formData.originalPrice}
                                            onChange={handleInputFieldChange}
                                            placeholder="50000"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="salePrice">Sale Price (Optional)</Label>
                                        <Input
                                            id="salePrice"
                                            name="salePrice"
                                            type="number"
                                            value={formData.salePrice}
                                            onChange={handleInputFieldChange}
                                            placeholder="45000"
                                        />
                                    </div>
                                </div>

                                { }
                                <div className="grid gap-2">
                                    <Label htmlFor="foodImage">Dish Image</Label>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="foodImage"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageFileSelection}
                                                className="cursor-pointer file:cursor-pointer file:bg-orange-50 file:text-orange-700 file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-2 hover:file:bg-orange-100"
                                            />
                                            {selectedImageFile && (
                                                <span className="text-xs text-green-600 block shrink-0 flex items-center gap-1">
                                                    <Upload className="w-3 h-3" /> Selected
                                                </span>
                                            )}
                                        </div>
                                        {formErrorMessage && <p className="text-xs text-red-500">{formErrorMessage}</p>}
                                        {!selectedImageFile && formData.foodImage && (
                                            <p className="text-xs text-gray-400 mt-1 truncate">Current: {formData.foodImage}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            { }
                            <div className="space-y-3">
                                <Label className="text-base font-semibold text-gray-700 uppercase tracking-wider">Danh Mục</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {STATIC_CATEGORIES.map(function (category) {
                                        const isSelected = formData.categoryId === category.categoryid;
                                        const Icon = CATEGORY_ICON_MAP[category.categoryname] || CATEGORY_ICON_MAP["Default"];

                                        return (
                                            <div
                                                key={category.categoryid}
                                                onClick={function () {
                                                    setFormData(function (previousData) {
                                                        return { ...previousData, categoryId: category.categoryid };
                                                    });
                                                }}
                                                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${isSelected
                                                    ? 'bg-red-50 border-red-500 text-red-700'
                                                    : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className={`p-1.5 rounded-full ${isSelected ? 'bg-red-100' : 'bg-gray-100'}`}>
                                                    <Icon className={`h-4 w-4 ${isSelected ? 'text-red-500' : 'text-gray-500'}`} />
                                                </div>
                                                <span className="text-xs font-semibold truncate">{category.categoryname}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            { }
                            <div className="grid gap-4">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Plus className="h-4 w-4" /> Topping Options
                                    </h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addNewToppingOption}
                                        className="text-orange-600 border-orange-200 hover:bg-orange-50"
                                    >
                                        <Plus className="h-3 w-3 mr-1" /> Add Topping
                                    </Button>
                                </div>

                                {formData.toppingOptions?.map(function (topping, index) {
                                    return (
                                        <div key={index} className="flex gap-3 items-end p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-[2] space-y-1">
                                                <Label className="text-xs">Topping Name</Label>
                                                <Input
                                                    value={topping.toppingName}
                                                    onChange={function (e) { updateToppingOption(index, 'toppingName', e.target.value); }}
                                                    placeholder="Extra Cheese"
                                                    className="h-9 bg-white"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <Label className="text-xs">Price</Label>
                                                <Input
                                                    value={topping.price}
                                                    onChange={function (e) { updateToppingOption(index, 'price', e.target.value); }}
                                                    placeholder="5000"
                                                    className="h-9 bg-white"
                                                    type="number"
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={function () { removeToppingOption(index); }}
                                                className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>

                            <DialogFooter className="mt-6 sticky bottom-0 bg-white pt-2 border-t">
                                <Button
                                    type="submit"
                                    disabled={isSavingData}
                                    className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
                                >
                                    {isSavingData ? "Saving..." : (activeEditingId ? "Update Dish" : "Save Dish")}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            { }
            <Card className="border-gray-100 shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Dishes List</CardTitle>
                        { }
                    </div>
                </CardHeader>

                <CardContent>
                    {isPageLoading ? (
                        <div className="text-center py-8 text-gray-500 animate-pulse">
                            Loading your menu items...
                        </div>
                    ) : (
                        <div className="rounded-lg border border-gray-100 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                    <tr>
                                        <th className="p-4">Image</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Category</th>
                                        <th className="p-4">Price</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {dishList.map(function (dish) {
                                        return (
                                            <tr key={dish.id} className="hover:bg-gray-50/50 transition-colors">
                                                { }
                                                <td className="p-4">
                                                    <img
                                                        src={dish.foodImage}
                                                        alt={dish.foodName}
                                                        className="w-12 h-12 rounded-lg object-cover bg-gray-100 shadow-sm"
                                                    />
                                                </td>

                                                { }
                                                <td className="p-4">
                                                    <div className="font-semibold text-gray-900">{dish.foodName}</div>
                                                </td>

                                                { }
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold 
                                                        ${dish.shopType === "Food" ? "bg-orange-50 text-[#ee4d2d]" : "bg-blue-50 text-blue-700"}`}>
                                                        {dish.shopType || "Food"}
                                                    </span>
                                                </td>

                                                { }
                                                <td className="p-4 text-gray-600 font-medium">
                                                    {dish.salePrice ? (
                                                        <div className="flex flex-col">
                                                            <span className="text-[#ee4d2d]">
                                                                {Number(dish.salePrice).toLocaleString()}đ
                                                            </span>
                                                            <span className="text-xs line-through text-gray-400">
                                                                {Number(dish.originalPrice).toLocaleString()}đ
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span>{Number(dish.originalPrice).toLocaleString()}đ</span>
                                                    )}
                                                </td>

                                                { }
                                                <td className="p-4">
                                                    <select
                                                        value={dish.foodStatus}
                                                        onChange={function (e) { updateDishAvailabilityStatus(dish.id, e.target.value); }}
                                                        className={`text-xs font-semibold rounded-full px-3 py-1.5 border border-gray-200 focus:ring-2 focus:ring-orange-200 cursor-pointer outline-none transition-all
                                                            ${dish.foodStatus === "Available" ? "bg-green-50 text-green-700 border-green-100" :
                                                                dish.foodStatus === "Out of Stock" ? "bg-yellow-50 text-yellow-700 border-yellow-100" : "bg-red-50 text-red-700 border-red-100"}`}
                                                    >
                                                        <option value="Available">Còn bán</option>
                                                        <option value="Out of Stock">Hết hàng</option>
                                                        <option value="Unavailable">Ngừng bán</option>
                                                    </select>
                                                </td>

                                                { }
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            onClick={function () {
                                                                setFormData(dish);
                                                                setActiveEditingId(dish.id);
                                                                setIsModifyDialogOpen(true);
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={function () {
                                                                if (confirm(`Bạn có chắc muốn ngừng bán món "${dish.foodName}"?`)) {
                                                                    softDeleteDish(dish.id);
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    { }
                                    {dishList.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Utensils className="h-8 w-8 text-gray-200" />
                                                    <p>No dishes found in your menu.</p>
                                                    <p className="text-xs">Add your first dish to get started!</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
