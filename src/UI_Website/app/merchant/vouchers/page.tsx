"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Ticket,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  Percent,
  Tag,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createVoucher, deleteVoucher, SimpleVoucher, handleApiError, getVouchersByMerchant, updateVoucher } from "@/lib/apiClient";
import { useMerchant } from "@/hooks/useMerchant";

export default function VoucherManagement() {
  const { merchantId, isLoading: isMerchantLoading, error: merchantError } = useMerchant();
  const [voucherList, setVoucherList] = useState<SimpleVoucher[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [isAddVoucherDialogOpen, setIsAddVoucherDialogOpen] = useState(false);
  const [activeEditingId, setActiveEditingId] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [newVoucherData, setNewVoucherData] = useState<Partial<SimpleVoucher>>({
    voucherType: "food",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  useEffect(() => {
    if (merchantId) {
      fetchVouchers();
    }
  }, [merchantId]);
  
  async function fetchVouchers() {
    if (!merchantId) return;
    setIsPageLoading(true);
    try {
      const data = await getVouchersByMerchant(merchantId);
      setVoucherList(data || []);
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
      setVoucherList([]);
    } finally {
      setIsPageLoading(false);
    }
  }

  async function handleCreateNewVoucher() {
    try {
      if (!merchantId) {
        alert("Lỗi: Không tìm thấy ID cửa hàng.");
        return;
      }

      const formattedVoucherData = {
        ...newVoucherData,
        // Only append T00:00:00/T23:59:59 if not already present
        startDate: newVoucherData.startDate && !newVoucherData.startDate.includes("T") 
          ? `${newVoucherData.startDate}T00:00:00` 
          : newVoucherData.startDate,
        endDate: newVoucherData.endDate && !newVoucherData.endDate.includes("T") 
          ? `${newVoucherData.endDate}T23:59:59` 
          : newVoucherData.endDate,
      };

      if (activeEditingId) {
        // preserve existing isActive status from newVoucherData (which should have it if editing)
        const updated = await updateVoucher(activeEditingId, formattedVoucherData);
        setVoucherList(prev => prev.map(v => v.voucherId === activeEditingId ? updated : v));
        alert("Cập nhật voucher thành công!");
      } else {
        const created = await createVoucher({
          ...formattedVoucherData,
          isActive: true, // Default to true on creation
          merchant: { merchantId }
        } as any);
        setVoucherList(prev => [created, ...(prev || [])]);
        alert("Thêm voucher thành công!");
      }
      setIsAddVoucherDialogOpen(false);
      setActiveEditingId(null);
      setNewVoucherData({
        voucherType: "food",
        isActive: true,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      });
    } catch (error: any) {
      console.error("Voucher error:", error);
      const apiErr = await handleApiError(error);
      alert("Lỗi khi lưu voucher: " + apiErr.message);
    }
  }

  async function handleDeleteVoucher(id: string) {
    if (!confirm("Bạn có chắc chắn muốn xóa voucher này?")) return;
    try {
      await deleteVoucher(id);
      setVoucherList(prev => (prev || []).filter(v => v.voucherId !== id));
      alert("Đã xóa voucher!");
    } catch (error) {
      alert("Lỗi khi xóa voucher");
    }
  }

  async function handleUpdateVoucherStatus(id: string, currentIsActive: boolean) {
    try {
      const updated = await updateVoucher(id, { isActive: !currentIsActive });
      setVoucherList(prev => prev.map(v => v.voucherId === id ? updated : v));
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Lỗi khi cập nhật trạng thái");
    }
  }

  function formatPriceToVND(amount: number) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  function getVoucherTypeDisplayName(type: string) {
    if (type === "food") {
      return "Đồ ăn";
    } else if (type === "drink") {
      return "Thức uống";
    } else if (type === "shipping") {
      return "Vận chuyển";
    } else {
      return type;
    }
  }

  const effectiveVoucherList = voucherList || [];
  const totalPages = Math.ceil(effectiveVoucherList.length / ITEMS_PER_PAGE);
  const paginatedVouchers = effectiveVoucherList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Voucher</h1>
          <p className="text-gray-500 mt-1">
            Tạo và quản lý mã giảm giá cho khách hàng của bạn
          </p>
        </div>

        {/* Add Voucher Button & Dialog */}
        <Dialog
          open={isAddVoucherDialogOpen}
          onOpenChange={setIsAddVoucherDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              className="bg-[#ee4d2d] hover:bg-[#d73211] text-white flex items-center gap-2"
              onClick={() => {
                setActiveEditingId(null);
                setNewVoucherData({
                  voucherType: "food",
                  startDate: new Date().toISOString().split("T")[0],
                  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0],
                });
              }}
            >
              <Plus className="w-4 h-4" />
              Tạo Voucher Mới
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {activeEditingId ? "Cập nhật Voucher" : "Tạo Voucher Mới"}
              </DialogTitle>
              <DialogDescription>
                {activeEditingId
                  ? "Cập nhật thông tin mã giảm giá"
                  : "Thiết lập mã giảm giá mới cho cửa hàng của bạn."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* Code & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="voucherCode">Mã Voucher</Label>
                  <Input
                    id="voucherCode"
                    placeholder="SUMMER2024"
                    value={newVoucherData.voucherCode || ""}
                    onChange={function (event) {
                      setNewVoucherData({
                        ...newVoucherData,
                        voucherCode: event.target.value.toUpperCase(),
                      });
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="voucherType">Loại Voucher</Label>
                  <Select
                    value={newVoucherData.voucherType}
                    onValueChange={function (selectedValue) {
                      setNewVoucherData({
                        ...newVoucherData,
                        voucherType: selectedValue as any,
                      });
                    }}
                  >
                    <SelectTrigger id="voucherType">
                      <SelectValue placeholder="Chọn loại voucher" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Đồ ăn</SelectItem>
                      <SelectItem value="drink">Thức uống</SelectItem>
                      <SelectItem value="shipping">Vận chuyển</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Value & Min Spend */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="discountValue">Giá trị giảm giá (VND)</Label>
                  <Input
                    id="discountValue"
                    type="text"
                    inputMode="numeric"
                    placeholder="50000"
                    value={newVoucherData.discountValue || ""}
                    onChange={function (event) {
                      const value = event.target.value;
                      if (value !== "" && !/^\d+$/.test(value)) return;
                      setNewVoucherData({
                        ...newVoucherData,
                        discountValue: value === "" ? 0 : Number(value),
                      });
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="minimumSpend">
                    Giá trị đơn hàng tối thiểu (VND)
                  </Label>
                  <Input
                    id="minimumSpend"
                    type="text"
                    inputMode="numeric"
                    placeholder="100000"
                    value={newVoucherData.minOrderValue || ""}
                    onChange={function (event) {
                      const value = event.target.value;
                      if (value !== "" && !/^\d+$/.test(value)) return;
                      setNewVoucherData({
                        ...newVoucherData,
                        minOrderValue: value === "" ? 0 : Number(value),
                      });
                    }}
                  />
                </div>
              </div>

              {/* Usage Limit */}
              <div className="grid grid-cols-1 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="usageLimit">Tổng số lần sử dụng</Label>
                  <Input
                    id="usageLimit"
                    type="text"
                    inputMode="numeric"
                    placeholder="500"
                    value={newVoucherData.maxUsage || ""}
                    onChange={function (event) {
                      const value = event.target.value;
                      if (value !== "" && !/^\d+$/.test(value)) return;
                      setNewVoucherData({
                        ...newVoucherData,
                        maxUsage: value === "" ? 0 : Number(value),
                      });
                    }}
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Ngày bắt đầu</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newVoucherData.startDate || ""}
                    onChange={function (event) {
                      setNewVoucherData({
                        ...newVoucherData,
                        startDate: event.target.value,
                      });
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">Ngày kết thúc</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newVoucherData.endDate || ""}
                    onChange={function (event) {
                      setNewVoucherData({
                        ...newVoucherData,
                        endDate: event.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleCreateNewVoucher}
                className="bg-[#ee4d2d] hover:bg-[#d73211] text-white w-full"
              >
                {activeEditingId ? "Cập Nhật Voucher" : "Tạo Voucher"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isPageLoading ? (
          <div className="col-span-full py-20 text-center">Đang tải voucher...</div>
        ) : paginatedVouchers.map(function (voucher) {
          return (
            <div
              key={voucher.voucherId}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:border-orange-200 transition-all duration-300"
            >
              <div className="p-6">
                {/* Voucher Type Icon & Status */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#ee4d2d]">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                      voucher.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                    onClick={() => handleUpdateVoucherStatus(voucher.voucherId!, !!voucher.isActive)}
                  >
                    {voucher.isActive ? "ĐANG HOẠT ĐỘNG" : "NGƯNG HOẠT ĐỘNG"}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Voucher Code & Details */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                      {voucher.voucherCode}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium mb-1">
                      {getVoucherTypeDisplayName(voucher.voucherType)}
                    </p>
                    <p className="text-sm text-[#ee4d2d] font-bold">
                      {formatPriceToVND(voucher.discountValue)} OFF
                    </p>
                  </div>

                  {/* Min Spend & Usage */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span>Min. {formatPriceToVND(voucher.minOrderValue)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>
                        0/{voucher.maxUsage} Used
                      </span>
                    </div>
                  </div>

                  {/* Footer Details & Actions */}
                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(voucher.startDate).toLocaleDateString()} -{" "}
                        {new Date(voucher.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-blue-500 border-blue-200 hover:bg-blue-50 hover:text-blue-600 rounded-lg flex items-center gap-1.5"
                        onClick={() => {
                          setActiveEditingId(voucher.voucherId!);
                          setNewVoucherData(voucher);
                          setIsAddVoucherDialogOpen(true);
                        }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">Sửa</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {voucherList.length === 0 && (
          <div className="col-span-full py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-500">
            <Ticket className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium">Chưa có voucher nào</p>
            <p className="text-sm">
              Nhấn nút trên để tạo mã giảm giá đầu tiên.
            </p>
          </div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
