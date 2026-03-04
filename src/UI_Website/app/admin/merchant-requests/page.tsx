"use client"

import { useState } from "react"
import { Search, Check, X, Eye, Clock, Store, MapPin, Phone, User, Lock, Unlock } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface MerchantRequest {
    id: string
    storeName: string
    ownerName: string
    phoneNumber: string
    address: string
    category: string
    requestDate: string
    status: 'Pending' | 'Approved' | 'Rejected'
    shopLocked?: boolean
}

const INITIAL_REQUESTS: MerchantRequest[] = [
    { id: "REQ001", storeName: "Quán Ăn Ngon 1", ownerName: "Nguyễn Văn A", phoneNumber: "0901234501", address: "123 Đường ABC, Hà Nội", category: "Ẩm thực Việt Nam", requestDate: "03/03/2026", status: 'Pending', shopLocked: false },
    { id: "REQ002", storeName: "Phở Gia Truyền", ownerName: "Trần Thị B", phoneNumber: "0901234502", address: "456 Đường XYZ, Đà Nẵng", category: "Món nước", requestDate: "02/03/2026", status: 'Pending', shopLocked: false },
    { id: "REQ003", storeName: "The Coffee House", ownerName: "Lê Văn C", phoneNumber: "0901234503", address: "789 Đường LMN, HCM", category: "Thức uống", requestDate: "01/03/2026", status: 'Approved', shopLocked: false },
]

export default function MerchantRequests() {
    const [requests, setRequests] = useState<MerchantRequest[]>(INITIAL_REQUESTS)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 10

    const filteredRequests = requests.filter(req =>
        req.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)
    const paginatedRequests = filteredRequests.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const handleAction = (id: string, newStatus: MerchantRequest['status']) => {
        const actionText = newStatus === 'Approved' ? 'duyệt' : 'từ chối'
        if (confirm(`Bạn có chắc chắn muốn ${actionText} hồ sơ này?`)) {
            setRequests(requests.map(req => {
                if (req.id === id) {
                    return { ...req, status: newStatus }
                }
                return req
            }))
        }
    }

    const toggleLock = (id: string) => {
        setRequests(requests.map(req => {
            if (req.id === id) {
                return { ...req, shopLocked: !req.shopLocked }
            }
            return req
        }))
    }

    return (
        <div className="space-y-8 font-sans">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Đăng ký & Quản lý Merchant</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Duyệt hồ sơ và quản lý trạng thái hoạt động đối tác</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Tìm hồ sơ hoặc tên quán..."
                        className="pl-10 h-11 w-80 rounded-xl border-gray-100 focus:border-[#ee4d2d]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên Cửa Hàng</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Chủ Sở Hữu</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày Đăng Ký</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng Thái</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {paginatedRequests.map((req) => (
                            <tr key={req.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold ${req.shopLocked ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-[#ee4d2d]'}`}>
                                            <Store className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{req.storeName}</p>
                                            <p className="text-[11px] text-gray-400 font-bold uppercase">{req.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div>
                                        <p className="font-bold text-gray-900">{req.ownerName}</p>
                                        <p className="text-xs text-gray-500 font-medium">{req.phoneNumber}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-gray-600 font-medium">
                                    {req.requestDate}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col gap-1">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider w-fit ${req.status === 'Pending' ? 'bg-blue-50 text-blue-600' :
                                            req.status === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {req.status === 'Pending' ? <Clock className="h-3 w-3" /> :
                                                req.status === 'Approved' ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                            {req.status === 'Pending' ? 'Chờ duyệt' : req.status === 'Approved' ? 'Đã duyệt' : 'Từ chối'}
                                        </span>
                                        {req.status === 'Approved' && (
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md w-fit ${req.shopLocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                {req.shopLocked ? 'Đã khóa quán' : 'Đang hoạt động'}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center justify-end gap-2">
                                        {req.status === 'Pending' ? (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-9 px-4 rounded-xl border-green-100 text-green-600 hover:bg-green-50 hover:border-green-200 font-bold text-xs gap-2"
                                                    onClick={() => handleAction(req.id, 'Approved')}
                                                >
                                                    <Check className="h-3.5 w-3.5" />
                                                    Duyệt
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-9 px-4 rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 font-bold text-xs gap-2"
                                                    onClick={() => handleAction(req.id, 'Rejected')}
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                    Từ chối
                                                </Button>
                                            </>
                                        ) : req.status === 'Approved' ? (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className={`h-9 px-4 rounded-xl font-bold text-xs gap-2 ${req.shopLocked ? 'border-green-100 text-green-600 hover:bg-green-50' : 'border-red-100 text-red-600 hover:bg-red-50'}`}
                                                    onClick={() => toggleLock(req.id)}
                                                >
                                                    {req.shopLocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                                                    {req.shopLocked ? 'Mở khóa' : 'Khóa quán'}
                                                </Button>
                                                <Link href="/admin/menu">
                                                    <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-gray-400 hover:text-[#ee4d2d] font-bold text-xs gap-2">
                                                        <Store className="h-3.5 w-3.5" />
                                                        Thực đơn
                                                    </Button>
                                                </Link>
                                            </>
                                        ) : null}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-gray-100 rounded-xl" title="Xem chi tiết">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[500px]">
                                                <DialogHeader>
                                                    <DialogTitle>Chi tiết hồ sơ đối tác</DialogTitle>
                                                    <DialogDescription>
                                                        Thông tin chi tiết và hồ sơ pháp lý của đối tác.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="py-6 space-y-6">
                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Tên cửa hàng</p>
                                                            <p className="font-black text-gray-900">{req.storeName}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Loại hình</p>
                                                            <p className="font-bold text-gray-900">{req.category}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Chủ sở hữu</p>
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-3.5 w-3.5 text-gray-400" />
                                                                <p className="font-bold text-gray-900">{req.ownerName}</p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Số điện thoại</p>
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="h-3.5 w-3.5 text-gray-400" />
                                                                <p className="font-bold text-gray-900">{req.phoneNumber}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Địa chỉ kinh doanh</p>
                                                        <div className="flex items-start gap-2">
                                                            <MapPin className="h-3.5 w-3.5 text-gray-400 mt-1 shrink-0" />
                                                            <p className="font-bold text-gray-900 leading-relaxed">{req.address}</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                                        <p className="text-[10px] uppercase font-black text-[#ee4d2d] tracking-widest mb-3">Hình ảnh hồ sơ pháp lý</p>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="aspect-video bg-white rounded-xl flex items-center justify-center text-[10px] text-gray-400 font-bold border border-orange-100 shadow-sm">GPKD.jpg</div>
                                                            <div className="aspect-video bg-white rounded-xl flex items-center justify-center text-[10px] text-gray-400 font-bold border border-orange-100 shadow-sm">STORE.jpg</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredRequests.length === 0 && (
                    <div className="py-12 text-center text-gray-400 font-medium">
                        Không tìm thấy hồ sơ đăng ký nào
                    </div>
                )}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}
