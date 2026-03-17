"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import {
  Search,
  Mail,
  Phone,
  CheckCircle2,
  Shield,
  ShoppingBag,
} from "lucide-react";
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

interface User {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  addressDelivery: string;
  shopeeCoins: number;
  roles: string[];
}

export default function CustomersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('/users');
        if (response.data && response.data.success) {
          setUsers(response.data.data);
        } else if (Array.isArray(response.data)) {
           // Fallback if the map isn't returned
           setUsers(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      (user.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phoneNumber || "").includes(searchTerm),
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const toggleUserStatus = (id: string) => {
    // Backend functionality for locking users might need to be implemented later
    alert("Chức năng khóa tài khoản đang được phát triển trên backend.");
  };

  if (isLoading) return (
    <div className="p-8 text-center bg-white rounded-3xl animate-pulse italic text-gray-400">
      Đang tải danh sách người dùng...
    </div>
  );

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
            Quản lý Khách hàng
          </h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Quản lý tài khoản và thông tin người dùng
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
                key={user.userId}
                className="hover:bg-gray-50 transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 uppercase">
                      {(user.fullName || "U").charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {user.fullName || "N/A"}
                      </p>
                      <p className="text-xs text-gray-400 font-medium italic">
                        #{user.userId}
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
                      <span>{user.phoneNumber}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 align-top">
                  <div className="flex flex-col items-start gap-1.5 max-w-[180px]">
                    {(user.roles && user.roles.length > 0 ? user.roles : ["USER"]).map((role) => (
                      <span key={role} className="px-3 py-1 border text-[10px] font-bold rounded-md uppercase tracking-wider text-left bg-gray-50 text-gray-500 border-gray-200">
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Hoạt động
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
                          title="Xem thông tin"
                        >
                          <ShoppingBag className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Thông tin của {user.fullName}</DialogTitle>
                          <DialogDescription>
                            Chi tiết tài khoản khách hàng.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-3">
                           <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                              <div className="space-y-1">
                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Địa chỉ giao hàng</p>
                                <p className="text-sm font-bold text-gray-700">{user.addressDelivery || "Chưa cập nhật"}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Shopee Coins</p>
                                <p className="text-sm font-black text-orange-500">{user.shopeeCoins?.toLocaleString() || 0} xu</p>
                              </div>
                           </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-4 rounded-xl text-gray-400 hover:text-red-500 font-bold text-xs gap-2"
                      onClick={() => toggleUserStatus(user.userId)}
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
