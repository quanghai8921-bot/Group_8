"use client";

import { useState } from "react";
import {
  Search,
  MoreVertical,
  Mail,
  Phone,
  Ban,
  CheckCircle2,
  Trash2,
  Shield,
  ShoppingBag,
  X,
  Store,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

interface User {
  id: string;
  name: string;
  email: string;
  role: ("Merchant" | "User")[];
  status: "Active" | "Locked";
  joinDate: string;
  avatar?: string;
  phone?: string;
  merchantId?: string;
  orderCount: number;
}

const INITIAL_USERS: User[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "vana@gmail.com",
    role: ["User"],
    status: "Active",
    joinDate: "2024-01-15",
    phone: "0912345678",
    orderCount: 5,
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "thib@merchant.com",
    role: ["User", "Merchant"],
    status: "Active",
    joinDate: "2024-02-01",
    phone: "0987654321",
    merchantId: "M001",
    orderCount: 0,
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "vanc@driver.com",
    role: ["User"],
    status: "Active",
    joinDate: "2024-02-10",
    phone: "0901234567",
    orderCount: 0,
  },
  {
    id: "4",
    name: "Phạm Minh D",
    email: "minhd@gmail.com",
    role: ["User"],
    status: "Locked",
    joinDate: "2024-03-01",
    phone: "0933445566",
    orderCount: 12,
  },
  {
    id: "5",
    name: "Hoàng Anh E",
    email: "anhe@merchant.com",
    role: ["User", "Merchant"],
    status: "Active",
    joinDate: "2024-03-05",
    phone: "0944556677",
    merchantId: "M002",
    orderCount: 3,
  },
];

export default function CustomersManagement() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm)),
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const toggleUserStatus = (id: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === id) {
          return {
            ...user,
            status: user.status === "Active" ? "Locked" : "Active",
          };
        }
        return user;
      }),
    );
  };

  const deleteUser = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
            Quản lý Khách hàng
          </h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Quản lý tài khoản và phân quyền người dùng
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm khách hàng..."
              className="pl-10 h-11 w-80 rounded-xl border-gray-100 focus:border-[#ee4d2d]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                Khách hàng
              </th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                Liên hệ
              </th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                Vai trò
              </th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                Tác vụ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-400 font-medium italic">
                        #{user.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                      <Mail className="h-3 w-3" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                      <Phone className="h-3 w-3" />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 align-top">
                  <div className="flex flex-col items-start gap-1.5 max-w-[180px]">
                    {user.role.map((roleName) => (
                      <span
                        key={roleName}
                        className={`px-3 py-1 border text-[10px] font-bold rounded-md uppercase tracking-wider text-left ${
                          roleName === "User"
                            ? "bg-gray-50 text-gray-500 border-gray-200"
                            : roleName === "Merchant"
                              ? "bg-orange-50 text-orange-600 border-orange-200"
                              : "bg-blue-50 text-blue-600 border-blue-200"
                        }`}
                      >
                        {roleName}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      user.status === "Active"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {user.status === "Active" ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <Ban className="h-3 w-3" />
                    )}
                    {user.status === "Active" ? "Hoạt động" : "Đã khóa"}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-blue-50 hover:text-blue-500 rounded-lg"
                          title="Xem đơn hàng"
                        >
                          <ShoppingBag className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Đơn hàng của {user.name}</DialogTitle>
                          <DialogDescription>
                            Danh sách các đơn hàng gần đây của khách hàng này.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-3">
                          {user.orderCount > 0 ? (
                            [...Array(Math.min(3, user.orderCount))].map(
                              (_, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 border border-gray-100 rounded-xl space-y-1"
                                >
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold">
                                      Đơn hàng #ORD{2024 + idx}
                                    </span>
                                    <span className="text-green-500 font-bold">
                                      45.000₫
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center text-xs text-gray-400">
                                    <span>20/02/2026</span>
                                    <div className="flex items-center gap-1.5 text-blue-500 font-bold">
                                      <CreditCard className="h-3 w-3" />
                                      <span>
                                        {idx % 2 === 0
                                          ? "Ví SmartBite"
                                          : "Tiền mặt"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex justify-end pt-1">
                                    <span className="px-2 py-0.5 bg-gray-100 rounded-full text-[10px] text-gray-400 font-bold uppercase">
                                      Hoàn thành
                                    </span>
                                  </div>
                                </div>
                              ),
                            )
                          ) : (
                            <div className="py-8 text-center text-gray-400 text-sm italic">
                              Chưa có đơn hàng nào
                            </div>
                          )}
                          {user.orderCount > 3 && (
                            <p className="text-center text-xs text-gray-400">
                              Và {user.orderCount - 3} đơn hàng khác...
                            </p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-4 rounded-xl text-gray-400 hover:text-blue-500 font-bold text-xs gap-2"
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      <Shield className="h-3.5 w-3.5" />
                      Khóa
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="py-12 text-center text-gray-400 font-medium">
            Không tìm thấy người dùng phù hợp
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
