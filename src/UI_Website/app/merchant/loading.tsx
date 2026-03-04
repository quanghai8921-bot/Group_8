"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex min-h-[400px] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-[#ee4d2d]" />
                    <div className="absolute inset-0 h-12 w-12 animate-pulse rounded-full bg-[#ee4d2d]/10"></div>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-lg font-black text-gray-900 tracking-tight">Đang tải nội dung...</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Vui lòng chờ trong giây lát</p>
                </div>
            </div>
        </div>
    );
}
