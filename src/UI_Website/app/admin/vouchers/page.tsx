"use client";

import { useState } from "react";
import {
  Plus,
  Ticket,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Tag,
  Users,
  Percent,
  Gift,
  Clock,
  CheckCircle2,
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
  discountType: "Percentage" | "Fixed";
  value: number;
  minSpend: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: "Active" | "Expired" | "Scheduled";
}

const INITIAL_VOUCHERS: Voucher[] = [
  {
    id: "1",
    code: "WELCOME50",
    type: "food",
    discountType: "Fixed",
    value: 50000,
    minSpend: 200000,
    usageLimit: 100,
    usedCount: 45,
    startDate: "2026-03-01",
    endDate: "2026-04-01",
    status: "Active",
  },
  {
    id: "2",
    code: "FREESHIP",
    type: "shipping",
    discountType: "Fixed",
    value: 15000,
    minSpend: 100000,
    usageLimit: 500,
    usedCount: 120,
    startDate: "2026-03-01",
    endDate: "2026-05-01",
    status: "Active",
  },
  {
    id: "3",
    code: "FOODLOVER20",
    type: "food",
    discountType: "Percentage",
    value: 20,
    minSpend: 150000,
    usageLimit: 200,
    usedCount: 12,
    startDate: "2026-03-01",
    endDate: "2026-06-01",
    status: "Active",
  },
];

export default function VoucherManagement() {
  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newVoucher, setNewVoucher] = useState<Partial<Voucher>>({
    type: "food",
    discountType: "Fixed",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredVouchers = vouchers.filter((v) =>
    v.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredVouchers.length / ITEMS_PER_PAGE);
  const paginatedVouchers = filteredVouchers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleCreate = () => {
    const voucher: Voucher = {
      id: Math.random().toString(36).substring(7),
      code: newVoucher.code?.toUpperCase() || "",
      type: (newVoucher.type as any) || "food",
      discountType: (newVoucher.discountType as any) || "Fixed",
      value: Number(newVoucher.value) || 0,
      minSpend: Number(newVoucher.minSpend) || 0,
      usageLimit: Number(newVoucher.usageLimit) || 0,
      usedCount: 0,
      startDate: newVoucher.startDate || "",
      endDate: newVoucher.endDate || "",
      status: "Active",
    };
    setVouchers([voucher, ...vouchers]);
    setIsAddDialogOpen(false);
  };

  const deleteVoucher = (id: string) => {
    if (confirm("Xóa voucher này?")) {
      setVouchers(vouchers.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
            Quản lý Voucher
          </h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Tạo và quản lý các chương trình ưu đãi
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm mã voucher..."
              className="pl-10 h-11 w-64 rounded-xl border-gray-100 focus:border-[#ee4d2d]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 px-6 rounded-xl bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold gap-2 shadow-lg shadow-red-100">
                <Plus className="h-4 w-4" />
                Thêm Voucher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Tạo Voucher mới</DialogTitle>
                <DialogDescription>
                  Thiết lập mã giảm giá mới cho hệ thống.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-gray-400">
                      Mã Voucher
                    </Label>
                    <Input
                      placeholder="VD: GIAM20K"
                      className="rounded-xl border-gray-100 focus:border-[#ee4d2d] uppercase"
                      value={newVoucher.code}
                      onChange={(e) =>
                        setNewVoucher({ ...newVoucher, code: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-gray-400">
                      Loại Voucher
                    </Label>
                    <Select
                      value={newVoucher.type}
                      onValueChange={(v) =>
                        setNewVoucher({ ...newVoucher, type: v as any })
                      }
                    >
                      <SelectTrigger className="rounded-xl border-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="food">Đồ ăn</SelectItem>
                        <SelectItem value="drink">Đồ uống</SelectItem>
                        <SelectItem value="shipping">Vận chuyển</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-gray-400">
                      Kiểu giảm giá
                    </Label>
                    <Select
                      value={newVoucher.discountType}
                      onValueChange={(v) =>
                        setNewVoucher({ ...newVoucher, discountType: v as any })
                      }
                    >
                      <SelectTrigger className="rounded-xl border-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fixed">Số tiền cố định</SelectItem>
                        <SelectItem value="Percentage">
                          Phần trăm (%)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-gray-400">
                      Giá trị giảm
                    </Label>
                    <Input
                      type="number"
                      placeholder={
                        newVoucher.discountType === "Fixed" ? "50000" : "20"
                      }
                      className="rounded-xl border-gray-100 focus:border-[#ee4d2d]"
                      value={newVoucher.value}
                      onChange={(e) =>
                        setNewVoucher({
                          ...newVoucher,
                          value: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-gray-400">
                      Đơn tối thiểu (đ)
                    </Label>
                    <Input
                      type="number"
                      placeholder="100000"
                      className="rounded-xl border-gray-100 focus:border-[#ee4d2d]"
                      value={newVoucher.minSpend}
                      onChange={(e) =>
                        setNewVoucher({
                          ...newVoucher,
                          minSpend: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-gray-400">
                      Số lượng mã
                    </Label>
                    <Input
                      type="number"
                      placeholder="100"
                      className="rounded-xl border-gray-100 focus:border-[#ee4d2d]"
                      value={newVoucher.usageLimit}
                      onChange={(e) =>
                        setNewVoucher({
                          ...newVoucher,
                          usageLimit: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-gray-400">
                      Ngày bắt đầu
                    </Label>
                    <Input
                      type="date"
                      className="rounded-xl border-gray-100 focus:border-[#ee4d2d]"
                      value={newVoucher.startDate}
                      onChange={(e) =>
                        setNewVoucher({
                          ...newVoucher,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-gray-400">
                      Ngày kết thúc
                    </Label>
                    <Input
                      type="date"
                      className="rounded-xl border-gray-100 focus:border-[#ee4d2d]"
                      value={newVoucher.endDate}
                      onChange={(e) =>
                        setNewVoucher({
                          ...newVoucher,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="w-full h-12 rounded-xl bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold"
                  onClick={handleCreate}
                >
                  Tạo và Kích hoạt
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedVouchers.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden group hover:border-[#ee4d2d]/20 transition-all duration-300"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`h-14 w-14 rounded-2xl flex items-center justify-center ${v.type === "shipping" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-[#ee4d2d]"}`}
                >
                  {v.type === "shipping" ? (
                    <Gift className="h-7 w-7" />
                  ) : (
                    <Ticket className="h-7 w-7" />
                  )}
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${v.status === "Active" ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"}`}
                >
                  {v.status === "Active" ? (
                    <CheckCircle2 className="inline h-3 w-3 mr-1" />
                  ) : (
                    <Clock className="inline h-3 w-3 mr-1" />
                  )}
                  {v.status === "Active" ? "Đang chạy" : "Hết hạn"}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
                    {v.code}
                  </h4>
                  <p className="text-sm font-bold text-[#ee4d2d]">
                    Giảm{" "}
                    {v.discountType === "Percentage"
                      ? `${v.value}%`
                      : `${v.value.toLocaleString()}₫`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-50">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Đơn tối thiểu
                    </p>
                    <p className="text-sm font-bold text-gray-700">
                      {v.minSpend.toLocaleString()}₫
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Đã sử dụng
                    </p>
                    <p className="text-sm font-bold text-gray-700">
                      {v.usedCount}/{v.usageLimit}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(v.startDate).toLocaleDateString("vi-VN")} -{" "}
                      {new Date(v.endDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-gray-100 text-gray-400 hover:text-blue-500 rounded-xl"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl"
                      onClick={() => deleteVoucher(v.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVouchers.length === 0 && (
        <div className="py-20 text-center space-y-4 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
          <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <Tag className="h-10 w-10 text-gray-200" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-gray-900">Không tìm thấy voucher</p>
            <p className="text-xs text-gray-400">
              Hãy thử tìm kiếm với từ khóa khác hoặc tạo voucher mới
            </p>
          </div>
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
