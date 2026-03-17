"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { submitMerchantApplication, getMyApplications, MerchantApplication, handleApiError } from "@/lib/apiClient";
import { Store, Clock, MapPin, Utensils, ArrowRight, CheckCircle2, Clock3 } from "lucide-react";

export default function MerchantRegisterPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    storeName: "",
    storeAddress: "",
    shopType: "Đồ ăn",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applications, setApplications] = useState<MerchantApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchApplications(storedUserId);
    } else {
      router.push("/login");
    }
  }, []);

  const fetchApplications = async (uid: string) => {
    try {
      const data = await getMyApplications(uid);
      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsSubmitting(true);
    try {
      await submitMerchantApplication({
        user: { userId: userId },
        storeName: formData.storeName,
        storeAddress: formData.storeAddress,
        shopType: formData.shopType,
      });
      alert("Đơn đăng ký của bạn đã được gửi thành công!");
      fetchApplications(userId);
      setFormData({ storeName: "", storeAddress: "", shopType: "Đồ ăn" });
    } catch (error: any) {
      const apiErr = handleApiError(error);
      alert(apiErr.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;
  }

  const hasPending = applications.some(app => app.applicationStatus === "Pending");
  const hasApproved = applications.some(app => app.applicationStatus === "Approved");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
            <h1 className="text-4xl font-black text-gray-900 mb-2">Trở thành Đối tác ShopeeFood</h1>
            <p className="text-gray-500 font-medium">Bắt đầu kinh doanh và tiếp cận hàng triệu khách hàng</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Card */}
          <Card className="shadow-xl border-t-4 border-t-[#ee4d2d]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Store className="text-[#ee4d2d]" />
                Đăng ký ngay
              </CardTitle>
              <CardDescription>Điền thông tin cửa hàng của bạn bên dưới</CardDescription>
            </CardHeader>
            <CardContent>
              {hasApproved ? (
                  <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-100 flex flex-col items-center text-center gap-4">
                      <CheckCircle2 className="h-12 w-12 text-green-500" />
                      <div>
                          <p className="font-bold text-green-800 text-lg">Bạn đã là Chủ quán!</p>
                          <p className="text-green-600">Đơn đăng ký của bạn đã được duyệt. Bạn có thể bắt đầu quản lý ngay.</p>
                      </div>
                      <Button 
                        onClick={() => router.push("/merchant")}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl"
                      >
                        Vào trang Quản lý
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                  </div>
              ) : hasPending ? (
                  <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-100 flex flex-col items-center text-center gap-4">
                      <Clock3 className="h-12 w-12 text-orange-500" />
                      <div>
                          <p className="font-bold text-orange-800 text-lg">Đang chờ xử lý</p>
                          <p className="text-orange-600">Admin đang xem xét đơn đăng ký của bạn. Vui lòng quay lại sau.</p>
                      </div>
                  </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="storeName" className="font-bold text-gray-700">Tên cửa hàng</Label>
                    <div className="relative">
                      <Store className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="storeName"
                        name="storeName"
                        placeholder="Ví dụ: Bún đậu Mắm tôm Cô Ba"
                        className="pl-10 h-12 rounded-xl"
                        value={formData.storeName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeAddress" className="font-bold text-gray-700">Địa chỉ cửa hàng</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="storeAddress"
                        name="storeAddress"
                        placeholder="Số nhà, Tên đường, Quận/Huyện"
                        className="pl-10 h-12 rounded-xl"
                        value={formData.storeAddress}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shopType" className="font-bold text-gray-700">Loại hình kinh doanh</Label>
                    <select
                      id="shopType"
                      name="shopType"
                      className="w-full h-12 rounded-xl border border-gray-200 px-4 font-medium focus:ring-2 focus:ring-[#ee4d2d] focus:outline-none transition-all"
                      value={formData.shopType}
                      onChange={handleInputChange}
                    >
                      <option value="Đồ ăn">Đồ ăn</option>
                      <option value="Thức uống">Thức uống</option>
                      <option value="Tráng miệng">Tráng miệng</option>
                      <option value="Ăn vặt">Ăn vặt</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#ee4d2d] hover:bg-[#d73211] text-white font-black h-14 text-lg rounded-2xl shadow-lg transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi đơn đăng ký"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* History Card */}
          <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-[#ee4d2d] pl-4">Lịch sử đăng ký</h2>
              {applications.length === 0 ? (
                  <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-gray-200 text-center">
                      <p className="text-gray-400 font-medium">Bạn chưa có đơn đăng ký nào.</p>
                  </div>
              ) : (
                  <div className="space-y-4">
                      {applications.map((app) => (
                          <div key={app.applicationId} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center transition-hover hover:border-[#ee4d2d]">
                              <div>
                                  <p className="font-bold text-gray-800">{app.storeName}</p>
                                  <p className="text-sm text-gray-500">{new Date(app.createdAt || "").toLocaleDateString('vi-VN')}</p>
                              </div>
                              <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                  app.applicationStatus === 'Approved' ? 'bg-green-100 text-green-700' :
                                  app.applicationStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
                                  'bg-orange-100 text-orange-700'
                              }`}>
                                  {app.applicationStatus === 'Approved' ? 'Đã duyệt' :
                                   app.applicationStatus === 'Rejected' ? 'Từ chối' : 'Chờ xử lý'}
                              </span>
                          </div>
                      ))}
                  </div>
              )}
              
              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-2">Lưu ý:</h3>
                  <ul className="text-sm text-blue-700 space-y-2 list-disc pl-4">
                      <li>Đơn hàng của bạn sẽ được duyệt trong vòng 24-48 giờ làm việc.</li>
                      <li>Vui lòng cung cấp địa chỉ chính xác để quá trình xác minh diễn ra nhanh chóng.</li>
                      <li>Mọi thắc mắc vui lòng liên hệ hotline 1900-xxxx.</li>
                  </ul>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
