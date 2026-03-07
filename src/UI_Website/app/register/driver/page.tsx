"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    User,
    Bike,
    FileText,
    MapPin,
    Phone,
    Mail,
    Calendar,
    CreditCard,
    CheckCircle2,
    ChevronLeft,
    Camera,
    IdCard,
    Image as ImageIcon
} from "lucide-react";

const FileUploadZone = ({ label, icon: Icon, onChange, file }: { label: string, icon: any, onChange: (e: any) => void, file: File | null }) => (
    <div className="border-2 border-dashed border-gray-200 hover:border-[#ee4d2d] rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-colors bg-gray-50/50 cursor-pointer relative group overflow-hidden">
        <input
            type="file"
            accept="image/*"
            onChange={onChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="w-14 h-14 bg-orange-100 text-[#ee4d2d] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {file ? <CheckCircle2 className="w-7 h-7" /> : <Icon className="w-7 h-7" />}
        </div>
        <div className="text-center z-0">
            <p className="text-sm font-bold text-gray-800">{label}</p>
            <p className="text-xs text-gray-500 mt-1 px-4">
                {file ? (
                    <span className="text-green-600 font-medium line-clamp-1">{file.name}</span>
                ) : (
                    "Nhấn để chọn hoặc kéo thả ảnh"
                )}
            </p>
        </div>
        {file && (
            <div className="absolute inset-0 bg-green-50/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        )}
    </div>
);

export default function DriverRegisterPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        birthDate: "",
        phoneNumber: "",
        email: "",
        address: "",
        vehicleType: "",
        licensePlate: "",
        driverLicense: "",
    });

    const [files, setFiles] = useState<{ [key: string]: File | null }>({
        idCard: null,
        licenseImage: null,
        vehicleImage: null,
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
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
                            Đăng ký Đối tác Tài xế
                        </h1>
                    </div>
                    <Link href="/register" className="flex items-center gap-2 text-gray-500 hover:text-[#ee4d2d] text-sm font-bold transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        Về trang đăng ký người dùng
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
                            <h2 className="text-3xl font-black text-gray-900 mb-4">Đăng ký thành công!</h2>
                            <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto">
                                Cảm ơn bạn đã đăng ký trở thành đối tác tài xế của ShopeeFood. Hồ sơ của bạn đang được xét duyệt và chúng tôi sẽ liên hệ trong thời gian sớm nhất.
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
                                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">Hoàn thiện hồ sơ của bạn</h2>
                                <p className="text-gray-500 font-medium">
                                    Vui lòng cung cấp đầy đủ thông tin để tham gia đội ngũ tài xế ShopeeFood
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-12">

                                {/* Section 1: Thông tin cá nhân */}
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-[#ee4d2d]">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">1. Thông tin cá nhân</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 sm:pl-12">
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Họ và tên</Label>
                                            <div className="relative">
                                                <Input
                                                    name="fullName"
                                                    required
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    placeholder="Nhập họ và tên trên CMND/CCCD"
                                                    className="h-14 pl-12 rounded-xl border-gray-200 focus:border-[#ee4d2d] bg-gray-50/50 focus:bg-white text-base"
                                                />
                                                <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Ngày sinh</Label>
                                            <div className="relative">
                                                <Input
                                                    name="birthDate"
                                                    type="date"
                                                    required
                                                    value={formData.birthDate}
                                                    onChange={handleInputChange}
                                                    className="h-14 pl-12 rounded-xl border-gray-200 focus:border-[#ee4d2d] bg-gray-50/50 focus:bg-white text-base"
                                                />
                                                <Calendar className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Số điện thoại</Label>
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
                                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email</Label>
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

                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Địa chỉ thường trú</Label>
                                            <div className="relative">
                                                <Input
                                                    name="address"
                                                    required
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    placeholder="Số nhà, Đường, Phường/Xã..."
                                                    className="h-14 pl-12 rounded-xl border-gray-200 focus:border-[#ee4d2d] bg-gray-50/50 focus:bg-white text-base"
                                                />
                                                <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="h-px bg-gray-100 w-full" />

                                {/* Section 2: Thông tin phương tiện */}
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-[#ee4d2d]">
                                            <Bike className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">2. Thông tin phương tiện</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 sm:pl-12">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Loại xe</Label>
                                            <div className="relative">
                                                <select
                                                    name="vehicleType"
                                                    required
                                                    value={formData.vehicleType}
                                                    onChange={handleInputChange}
                                                    className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-gray-200 focus:border-[#ee4d2d] focus:ring-0 bg-gray-50/50 focus:bg-white text-base appearance-none outline-none transition-all"
                                                >
                                                    <option value="" disabled>-- Chọn loại xe --</option>
                                                    <option value="Honda">Honda (Wave, Vision, Winner...)</option>
                                                    <option value="Yamaha">Yamaha (Sirius, Exciter...)</option>
                                                    <option value="Suzuki">Suzuki</option>
                                                    <option value="Khac">Khác</option>
                                                </select>
                                                <Bike className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Biển số xe</Label>
                                            <div className="relative">
                                                <Input
                                                    name="licensePlate"
                                                    required
                                                    value={formData.licensePlate}
                                                    onChange={handleInputChange}
                                                    placeholder="Ví dụ: 59-X1 123.45"
                                                    className="h-14 pl-12 rounded-xl border-gray-200 focus:border-[#ee4d2d] bg-gray-50/50 focus:bg-white text-base uppercase"
                                                />
                                                <CreditCard className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                            </div>
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Số Giấy phép lái xe</Label>
                                            <div className="relative">
                                                <Input
                                                    name="driverLicense"
                                                    required
                                                    value={formData.driverLicense}
                                                    onChange={handleInputChange}
                                                    placeholder="Nhập mã số trên GPLX của bạn"
                                                    className="h-14 pl-12 rounded-xl border-gray-200 focus:border-[#ee4d2d] bg-gray-50/50 focus:bg-white text-base"
                                                />
                                                <FileText className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
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
                                        <h3 className="text-xl font-bold text-gray-800">3. Giấy tờ & Hình ảnh</h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pl-0 sm:pl-12">
                                        <FileUploadZone
                                            label="Ảnh CMND/CCCD (Mặt trước)"
                                            icon={IdCard}
                                            file={files.idCard}
                                            onChange={(e) => handleFileChange(e, "idCard")}
                                        />

                                        <FileUploadZone
                                            label="Ảnh Giấy phép lái xe"
                                            icon={CreditCard}
                                            file={files.licenseImage}
                                            onChange={(e) => handleFileChange(e, "licenseImage")}
                                        />

                                        <FileUploadZone
                                            label="Ảnh Phương tiện (Xe)"
                                            icon={ImageIcon}
                                            file={files.vehicleImage}
                                            onChange={(e) => handleFileChange(e, "vehicleImage")}
                                        />
                                    </div>

                                    <p className="text-xs text-gray-400 mt-4 pl-0 sm:pl-12">
                                        * Đảm bảo hình ảnh rõ nét, không bị lóa sáng hay mất góc. Định dạng hỗ trợ: JPG, PNG (tối đa 5MB).
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
