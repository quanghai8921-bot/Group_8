"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getPendingApplications, approveApplication, rejectApplication, MerchantApplication, handleApiError } from "@/lib/apiClient";
import { ShieldCheck, User, Store, MapPin, Check, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<MerchantApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const data = await getPendingApplications();
      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm("Duyệt đơn đăng ký này? Người dùng sẽ chính thức trở thành Chủ quán.")) return;
    try {
      await approveApplication(id);
      alert("Đã duyệt đơn đăng ký!");
      fetchApplications();
    } catch (error: any) {
      const apiErr = handleApiError(error);
      alert(apiErr.message);
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("Từ chối đơn đăng ký này?")) return;
    try {
      await rejectApplication(id);
      alert("Đã từ chối đơn đăng ký.");
      fetchApplications();
    } catch (error: any) {
      const apiErr = handleApiError(error);
      alert(apiErr.message);
    }
  };

  const filteredApps = applications.filter(app => 
    app.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.storeAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Duyệt đơn Chủ quán</h1>
          <p className="text-gray-500 font-medium">Danh sách các yêu cầu tham gia đối tác ShopeeFood đang chờ</p>
        </div>
        <div className="bg-orange-100 text-orange-700 px-6 py-2 rounded-full font-black text-sm uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          Quyền Admin
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input 
          placeholder="Tìm kiếm theo tên quán hoặc địa chỉ..."
          className="pl-10 h-12 rounded-2xl shadow-sm border-gray-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">Đang tải danh sách...</div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white p-20 rounded-[40px] border-2 border-dashed border-gray-100 text-center">
            <Store className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-xl font-bold">Hiện không có đơn đăng ký nào đang chờ.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <Card key={app.applicationId} className="shadow-lg border-gray-50 hover:shadow-xl transition-all rounded-3xl overflow-hidden group">
              <CardHeader className="bg-gray-50/50">
                <div className="flex justify-between items-start">
                  <div className="h-12 w-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm group-hover:bg-[#ee4d2d] group-hover:text-white transition-all">
                    <Store className="h-6 w-6" />
                  </div>
                  <div className="text-xs font-black text-gray-400">#{app.applicationId}</div>
                </div>
                <CardTitle className="mt-4 text-xl font-bold text-gray-800">{app.storeName}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-gray-500 font-medium">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-black uppercase">{app.shopType}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Người đăng ký</p>
                      <p className="font-bold text-gray-700">ID: {app.user.userId}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Địa chỉ</p>
                      <p className="font-medium text-gray-600 leading-tight">{app.storeAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Button 
                    variant="outline"
                    className="h-12 rounded-xl border-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100 font-bold gap-2"
                    onClick={() => app.applicationId && handleReject(app.applicationId)}
                  >
                    <X className="h-4 w-4" />
                    Từ chối
                  </Button>
                  <Button 
                    className="h-12 rounded-xl bg-green-600 hover:bg-green-700 font-bold gap-2"
                    onClick={() => app.applicationId && handleApprove(app.applicationId)}
                  >
                    <Check className="h-4 w-4" />
                    Duyệt
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
