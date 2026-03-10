"use client";

import { useState } from "react";
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

interface Voucher {
  id: string;
  code: string;
  type: "food" | "drink" | "shipping";
  value: number;
  minSpend: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "scheduled";
}

const INITIAL_VOUCHERS: Voucher[] = [
  {
    id: "1",
    code: "WELCOME50",
    type: "food",
    value: 50000,
    minSpend: 200000,
    usageLimit: 100,
    usedCount: 45,
    startDate: "2024-03-01",
    endDate: "2024-04-01",
    status: "active",
  },
  {
    id: "2",
    code: "FREESHIP",
    type: "shipping",
    value: 15000,
    minSpend: 100000,
    usageLimit: 500,
    usedCount: 120,
    startDate: "2024-03-01",
    endDate: "2024-05-01",
    status: "active",
  },
];

export default function VoucherManagement() {
  const [voucherList, setVoucherList] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [isAddVoucherDialogOpen, setIsAddVoucherDialogOpen] = useState(false);
  const [activeEditingId, setActiveEditingId] = useState<string | null>(null);

  const [newVoucherData, setNewVoucherData] = useState<Partial<Voucher>>({
    type: "food",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  function handleCreateNewVoucher() {
    const processedVoucher: Voucher = {
      id: activeEditingId || Math.random().toString(36).substring(2, 11),
      code: newVoucherData.code || "VOUCHER",
      type: (newVoucherData.type as any) || "food",
      value: Number(newVoucherData.value) || 0,
      minSpend: Number(newVoucherData.minSpend) || 0,
      usageLimit: Number(newVoucherData.usageLimit) || 0,
      usedCount: newVoucherData.usedCount || 0,
      startDate: newVoucherData.startDate || "",
      endDate: newVoucherData.endDate || "",
      status: (newVoucherData.status as any) || "active",
    };

    if (activeEditingId) {
      setVoucherList(function (previousList) {
        return previousList.map((v) =>
          v.id === activeEditingId ? processedVoucher : v,
        );
      });
    } else {
      setVoucherList(function (previousList) {
        return [processedVoucher, ...previousList];
      });
    }

    setIsAddVoucherDialogOpen(false);
    setActiveEditingId(null);
    setNewVoucherData({
      type: "food",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    });
  }

  function handleUpdateVoucherStatus(id: string, newStatus: string) {
    setVoucherList(function (previousList) {
      return previousList.map(function (voucher) {
        if (voucher.id === id) {
          return { ...voucher, status: newStatus as any };
        }
        return voucher;
      });
    });
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

  const totalPages = Math.ceil(voucherList.length / ITEMS_PER_PAGE);
  const paginatedVouchers = voucherList.slice(
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
                  type: "food",
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
                    value={newVoucherData.code}
                    onChange={function (event) {
                      setNewVoucherData({
                        ...newVoucherData,
                        code: event.target.value.toUpperCase(),
                      });
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="voucherType">Loại Voucher</Label>
                  <Select
                    value={newVoucherData.type}
                    onValueChange={function (selectedValue) {
                      setNewVoucherData({
                        ...newVoucherData,
                        type: selectedValue as any,
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
                    type="number"
                    placeholder="50000"
                    value={newVoucherData.value}
                    onChange={function (event) {
                      setNewVoucherData({
                        ...newVoucherData,
                        value: Number(event.target.value),
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
                    type="number"
                    placeholder="100000"
                    value={newVoucherData.minSpend}
                    onChange={function (event) {
                      setNewVoucherData({
                        ...newVoucherData,
                        minSpend: Number(event.target.value),
                      });
                    }}
                  />
                </div>
              </div>

              {/* Usage Limit */}
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="usageLimit">Tổng số lần sử dụng</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  placeholder="500"
                  value={newVoucherData.usageLimit}
                  onChange={function (event) {
                    setNewVoucherData({
                      ...newVoucherData,
                      usageLimit: Number(event.target.value),
                    });
                  }}
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Ngày bắt đầu</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newVoucherData.startDate}
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
                    value={newVoucherData.endDate}
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
                Tạo Voucher
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedVouchers.map(function (voucher) {
          return (
            <div
              key={voucher.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:border-orange-200 transition-all duration-300"
            >
              <div className="p-6">
                {/* Voucher Type Icon & Status */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#ee4d2d]">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      voucher.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {voucher.status.toUpperCase()}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Voucher Code & Details */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                      {voucher.code}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium mb-1">
                      {getVoucherTypeDisplayName(voucher.type)}
                    </p>
                    <p className="text-sm text-[#ee4d2d] font-bold">
                      {formatPriceToVND(voucher.value)} OFF
                    </p>
                  </div>

                  {/* Min Spend & Usage */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span>Min. {formatPriceToVND(voucher.minSpend)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>
                        {voucher.usedCount}/{voucher.usageLimit} Used
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
                          setActiveEditingId(voucher.id);
                          setNewVoucherData(voucher);
                          setIsAddVoucherDialogOpen(true);
                        }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">Sửa</span>
                      </Button>

                      <Select
                        value={voucher.status}
                        onValueChange={(val) =>
                          handleUpdateVoucherStatus(voucher.id, val)
                        }
                      >
                        <SelectTrigger className="h-8 w-[130px] rounded-lg border-gray-200 text-xs font-semibold focus:ring-0">
                          <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="active"
                            className="text-xs font-semibold text-green-700"
                          >
                            Hoạt động
                          </SelectItem>
                          <SelectItem
                            value="expired"
                            className="text-xs font-semibold text-gray-500"
                          >
                            Ngừng HĐ
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
