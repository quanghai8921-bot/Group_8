"use client";

import Link from "next/link";
import Image from "next/image";
import {
    Facebook,
    Instagram,
    X,
    Youtube,
    Mail,
    Phone,
    MapPin,
    ExternalLink,
    ChevronRight,
    Smartphone
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Footer() {
    
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {}
                    <div className="space-y-6">
                        <Link href="/">
                            <div className="bg-white p-2 inline-block rounded-lg shadow-lg">
                                <Image
                                    src="/Logo.jpg"
                                    alt="ShopeeFood Logo"
                                    width={140}
                                    height={35}
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400">
                            ShopeeFood - Trải nghiệm đặt món tuyệt vời nhất.
                            Chúng tôi cam kết mang đến những bữa ăn ngon, nóng hổi và giao hàng siêu tốc đến tận tay bạn.
                        </p>
                        <div className="flex gap-4">
                            <SocialIconLink href="#" platform="Facebook"><Facebook className="w-5 h-5" /></SocialIconLink>
                            <SocialIconLink href="#" platform="Instagram"><Instagram className="w-5 h-5" /></SocialIconLink>
                            <SocialIconLink href="#" platform="X"><X className="w-5 h-5" /></SocialIconLink>
                            <SocialIconLink href="#" platform="Youtube"><Youtube className="w-5 h-5" /></SocialIconLink>
                        </div>
                    </div>

                    {}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Khám Phá</h4>
                        <ul className="space-y-3">
                            <FooterLink label="Trang chủ" href="/" />
                            <FooterLink label="Danh mục món ăn" href="#" />
                            <FooterLink label="Khuyến mãi" href="#" />
                            <FooterLink label="Quán ngon gần bạn" href="#" />
                            <FooterLink label="Đăng ký đối tác" href="#" />
                        </ul>
                    </div>

                    {}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Hỗ Trợ</h4>
                        <ul className="space-y-3">
                            <FooterLink label="Trung tâm trợ giúp" href="#" />
                            <FooterLink label="Chính sách bảo mật" href="#" />
                            <FooterLink label="Điều khoản dịch vụ" href="#" />
                            <FooterLink label="Chính sách giao hàng" href="#" />
                            <FooterLink label="Phí dịch vụ & Thuế" href="#" />
                        </ul>
                    </div>

                    {}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Liên Hệ</h4>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 text-sm">
                                <MapPin className="w-5 h-5 text-[#ee4d2d] shrink-0" />
                                <span>Khu đô thị mới An Phú Thịnh, Phường Quy Nhơn Đông, Tỉnh Bình Định</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-5 h-5 text-green-500 shrink-0" />
                                <span>+84 123 456 789</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>support@shopeefood.vn</span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <p className="text-sm font-bold text-white mb-3">Tải Ứng Dụng</p>
                            <div className="flex gap-2">
                                <AppDownloadButton icon={<ExternalLink className="w-3 h-3 mr-1" />} label="App Store" />
                                <AppDownloadButton icon={<Smartphone className="w-3 h-3 mr-1" />} label="Google Play" />
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500">
                        © {currentYear} ShopeeFood Group. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <Link href="#" className="hover:text-white transition-colors">Về chúng tôi</Link>
                        <Link href="#" className="hover:text-white transition-colors">Tuyển dụng</Link>
                        <Link href="#" className="hover:text-white transition-colors">Blog</Link>
                        <Link href="#" className="hover:text-white transition-colors">Liên hệ</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}



function SocialIconLink({ href, children, platform }: { href: string; children: React.ReactNode; platform: string }) {
    const hoverColors: Record<string, string> = {
        Facebook: "hover:bg-blue-600",
        Instagram: "hover:bg-pink-600",
        X: "hover:bg-black",
        Youtube: "hover:bg-[#ee4d2d]"
    };

    return (
        <a
            href={href}
            className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:text-white transition-all ${hoverColors[platform] || "hover:bg-[#ee4d2d]"}`}
        >
            {children}
        </a>
    );
}

function FooterLink({ label, href }: { label: string; href: string }) {
    return (
        <li>
            <Link href={href} className="text-slate-400 hover:text-[#ee4d2d] hover:translate-x-1 flex items-center transition-all">
                <ChevronRight className="w-4 h-4 mr-2" />
                {label}
            </Link>
        </li>
    );
}

function AppDownloadButton({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-xs text-slate-300">
            {icon}
            {label}
        </Button>
    );
}
