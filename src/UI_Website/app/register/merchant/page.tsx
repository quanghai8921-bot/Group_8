"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Store,
  FileText,
  MapPin,
  Phone,
  Mail,
  Clock,
  Utensils,
  CheckCircle2,
  ChevronLeft,
  Camera,
  IdCard,
  Image as ImageIcon,
} from "lucide-react";

const FileUploadZone = ({
  label,
  icon: Icon,
  onChange,
  file,
}: {
  label: string;
  icon: any;
  onChange: (e: any) => void;
  file: File | null;
}) => (
  <div className="border-2 border-dashed border-gray-200 hover:border-[#ee4d2d] rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-colors bg-gray-50/50 cursor-pointer relative group overflow-hidden">
    <input
      type="file"
      accept="image/*"
      onChange={onChange}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-[100]"
    />
    <div className="w-14 h-14 bg-orange-100 text-[#ee4d2d] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
      {file ? (
        <CheckCircle2 className="w-7 h-7" />
      ) : (
        <Icon className="w-7 h-7" />
      )}
    </div>
    <div className="text-center z-0">
      <p className="text-sm font-bold text-gray-800">{label}</p>
      <div className="text-xs text-gray-500 mt-1 px-4">
        {file ? (
          <span className="text-green-600 font-medium line-clamp-1">
            {file.name}
          </span>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="bg-[#ee4d2d] text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md hover:bg-[#d73211] transition-colors">
              This PC
            </span>
            <span className="text-gray-400">hoặc kéo thả ảnh vào đây</span>
          </div>
        )}
      </div>
    </div>
    {file && (
      <div className="absolute inset-0 bg-green-50/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    )}
  </div>
);

export default function MerchantRegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    storeName: "",
    address: "",
    foodType: "",
    openingTime: "",
    closingTime: "",
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    idCard: null,
    businessLicense: null,
    storeImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [fieldName]: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call Delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white py-4 sm:py-6 shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/">
              <Image
                src="/Logo.jpg"
                alt="ShopeeFood Logo"
                width={140}
                height={40}
                className="object-contain hover:opacity-80 transition-all cursor-pointer"
              />
            </Link>
            <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
            <h1 className="text-xl sm:text-2xl font-black text-[#ee4d2d] uppercase tracking-tight">
              Đăng ký Mở Quán
            </h1>
          </div>
          <Link
            href="/register"
            className="flex items-center gap-2 text-gray-500 hover:text-[#ee4d2d] text-sm font-bold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Về trang đăng ký
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow relative py-12 px-4 flex justify-center">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-80 bg-[#ee4d2d] rounded-b-[40px] shadow-inner z-0" />

        <div className="w-full max-w-4xl relative z-10">
          {success ? (
            <div className="bg-white rounded-[32px] shadow-2xl p-10 sm:p-16 text-center transform transition-all animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">
                Đăng ký thành công!
              </h2>
              <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto">
                Cảm ơn bạn đã đăng ký mở quán trên ShopeeFood. Hồ sơ của bạn
                đang được duyệt và chúng tôi sẽ liên hệ trong thời gian sớm
                nhất.
              </p>
              <Link href="/">
                <Button className="h-14 px-8 bg-[#ee4d2d] hover:bg-[#d73211] text-white text-lg font-bold rounded-2xl w-full sm:w-auto">
                  Trở về trang chủ
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100">
              <div className="bg-orange-50/50 p-6 sm:p-10 border-b border-orange-100/50 text-center">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
                  Thông tin đăng ký mở quán
                </h2>
                <p className="text-gray-500 font-medium">
                  Vui lòng cung cấp đầy đủ thông tin để trở thành đối tác nhà
                  hàng của chúng tôi
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-12">
                {/* Section 1: Thông tin chủ quán */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-[#ee4d2d]">
                      <User className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      1. Thông tin chủ quán
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 sm:pl-12">
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Họ và tên
                      </Label>
                      <div className="relative">
                        <Input
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Nhập họ và tên chủ quán"
                          className="h-14 pl-12 rounded-xl border-gray-200 focus:border-[#ee4d2d] bg-gray-50/50 focus:bg-white text-base"
                        />
                        <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Số điện thoại
                      </Label>
                      <div className="relative">
                        <Input
                          name="phoneNumber"
                          type="tel"
                          required
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="Ví dụ: 09xx xxx xxx"
                          className="h-14 pl-12 rounded-xl border-gray-200 focus:border-[#ee4d2d] bg-gray-50/50 focus:bg-white text-base"
                        />
                        <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Email
                      </Label>
                      <div className="relative">
                        <Input
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="email@example.com"
                          className="h-14 pl-12 rounded-xl border-gray-200 focus:border-[#ee4d2d] bg-gray-50/50 focus:bg-white text-base"
                        />
                        <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-gray-100 w-full" />

                {/* Section 2: Thông tin cửa hàng */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-[#ee4d2d]">
                      <Store className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      2. Thông tin cửa hàng
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 sm:pl-12">
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Tên quán
                      </Label>
                      <div className="relative">
                        <Input
                          name="storeName"
                          required
                          value={formData.storeName}
                          onChange={handleInputChange}
                          placeholder="Tên quán hiển thị trên ứng dụng"
                          className="h-14 pl-12 rounded-xl border-gray-200 focus:border-[#ee4d2d] bg-gray-50/50 focus:bg-white text-base"
                        />
                        <Store className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Địa chỉ quán
                      </Label>
                      <div className="relative">
                        <Input
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Số nhà, Tên đường, Phường/Xã..."
                          className="h-14 pl-12 rounded-xl border-gray-200 focus:border-[#ee4d2d] bg-gray-50/50 focus:bg-white text-base"
                        />
                        <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Loại hình món ăn
                      </Label>
                      <div className="relative">
                        <select
                          name="foodType"
                          required
                          value={formData.foodType}
                          onChange={handleInputChange}
                          className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-gray-200 focus:border-[#ee4d2d] focus:ring-0 bg-gray-50/50 focus:bg-white text-base appearance-none outline-none transition-all"
                        >
                          <option value="" disabled>
                            -- Chọn loại hình --
                          </option>
                          <option value="Cơm">Cơm</option>
                          <option value="Bún/Phở">Bún/Phở</option>
                          <option value="Trà sữa/Đồ uống">
                            Trà sữa/Đồ uống
                          </option>
                          <option value="Đồ ăn vặt">Đồ ăn vặt</option>
                          <option value="Nhà hàng">Nhà hàng</option>
                          <option value="Khác">Khác</option>
                        </select>
                        <Utensils className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                          Giờ mở cửa
                        </Label>
                        <div className="relative">
                          <Input
                            name="openingTime"
                            type="time"
                            required
                            value={formData.openingTime}
                            onChange={handleInputChange}
                            className="h-14 pl-12 rounded-xl border-gray-200 focus:border-[#ee4d2d] bg-gray-50/50 focus:bg-white text-base"
                          />
                          <Clock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                          Giờ đóng cửa
                        </Label>
                        <div className="relative">
                          <Input
                            name="closingTime"
                            type="time"
                            required
                            value={formData.closingTime}
                            onChange={handleInputChange}
                            className="h-14 pl-12 rounded-xl border-gray-200 focus:border-[#ee4d2d] bg-gray-50/50 focus:bg-white text-base"
                          />
                          <Clock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-gray-100 w-full" />

                {/* Section 3: Giấy tờ & Hình ảnh */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-[#ee4d2d]">
                      <Camera className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      3. Giấy tờ & Hình ảnh
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pl-0 sm:pl-12">
                    <FileUploadZone
                      label="Ảnh CMND/CCCD (Chủ quán)"
                      icon={IdCard}
                      file={files.idCard}
                      onChange={(e) => handleFileChange(e, "idCard")}
                    />

                    <FileUploadZone
                      label="Giấy phép kinh doanh"
                      icon={FileText}
                      file={files.businessLicense}
                      onChange={(e) => handleFileChange(e, "businessLicense")}
                    />

                    <FileUploadZone
                      label="Hình ảnh quán"
                      icon={ImageIcon}
                      file={files.storeImage}
                      onChange={(e) => handleFileChange(e, "storeImage")}
                    />
                  </div>

                  <p className="text-xs text-gray-400 mt-4 pl-0 sm:pl-12">
                    * Đảm bảo hình ảnh rõ nét, không bị lóa sáng hay mất góc.
                    Định dạng hỗ trợ: JPG, PNG (tối đa 5MB).
                  </p>
                </section>

                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xl font-black rounded-2xl uppercase tracking-widest shadow-xl shadow-orange-200/50 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang xử lý...
                      </>
                    ) : (
                      "Gửi hồ sơ đăng ký"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
