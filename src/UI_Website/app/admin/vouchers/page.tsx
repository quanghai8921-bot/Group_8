"use client"

import { useState } from "react"
import { Plus, Ticket, Filter, MoreVertical, Edit2, Trash2, Calendar, DollarSign, Percent, Tag, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Voucher {
    id: string
    code: string
    type: 'food' | 'drink' | 'shipping'
    value: number
    minSpend: number
    usageLimit: number
    usedCount: number
    startDate: string
    endDate: string
    status: 'active' | 'expired' | 'scheduled'
}

const INITIAL_VOUCHERS: Voucher[] = [
    {
        id: "1",
        code: "WELCOME50",
        type: 'food',
        value: 50000,
        minSpend: 200000,
        usageLimit: 100,
        usedCount: 45,
        startDate: "2024-03-01",
        endDate: "2024-04-01",
        status: 'active'
    },
    {
        id: "2",
        code: "FREESHIP",
        type: 'shipping',
        value: 15000,
        minSpend: 100000,
        usageLimit: 500,
        usedCount: 120,
        startDate: "2024-03-01",
        endDate: "2024-05-01",
        status: 'active'
    }
]


export default function VoucherManagement() {
    
    const [voucherList, setVoucherList] = useState<Voucher[]>(INITIAL_VOUCHERS);

    
    const [isAddVoucherDialogOpen, setIsAddVoucherDialogOpen] = useState(false);

    
    const [newVoucherData, setNewVoucherData] = useState<Partial<Voucher>>({
        type: 'food',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    
    function handleCreateNewVoucher() {
        
        const processedVoucher: Voucher = {
            id: Math.random().toString(36).substring(2, 11),
            code: newVoucherData.code || "VOUCHER",
            type: (newVoucherData.type as any) || 'food',
            value: Number(newVoucherData.value) || 0,
            minSpend: Number(newVoucherData.minSpend) || 0,
            usageLimit: Number(newVoucherData.usageLimit) || 0,
            usedCount: 0,
            startDate: newVoucherData.startDate || "",
            endDate: newVoucherData.endDate || "",
            status: 'active'
        };

        
        setVoucherList(function (previousList) {
            return [processedVoucher, ...previousList];
        });

        setIsAddVoucherDialogOpen(false);

        
        setNewVoucherData({
            type: 'food',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
    }

    
    function formatPriceToVND(amount: number) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    
    function getVoucherTypeDisplayName(type: string) {
        if (type === 'food') {
            return 'Đồ ăn';
        } else if (type === 'drink') {
            return 'Thức uống';
        } else if (type === 'shipping') {
            return 'Vận chuyển';
        } else {
            return type;
        }
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Voucher Management</h1>
                    <p className="text-gray-500 mt-1">Create and manage discount codes for your customers</p>
                </div>

                {}
                <Dialog open={isAddVoucherDialogOpen} onOpenChange={setIsAddVoucherDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#ee4d2d] hover:bg-[#d73211] text-white flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Create New Voucher
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Create New Voucher</DialogTitle>
                            <DialogDescription>
                                Set up a new discount code for your store.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            {}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="voucherCode">Voucher Code</Label>
                                    <Input
                                        id="voucherCode"
                                        placeholder="SUMMER2024"
                                        value={newVoucherData.code}
                                        onChange={function (event) {
                                            setNewVoucherData({ ...newVoucherData, code: event.target.value.toUpperCase() });
                                        }}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="voucherType">Voucher Type</Label>
                                    <Select
                                        value={newVoucherData.type}
                                        onValueChange={function (selectedValue) {
                                            setNewVoucherData({ ...newVoucherData, type: selectedValue as any });
                                        }}
                                    >
                                        <SelectTrigger id="voucherType">
                                            <SelectValue placeholder="Chọn loại voucher" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="food">Đồ ăn</SelectItem>
                                            <SelectItem value="drink">Thức uống</SelectItem>
                                            <SelectItem value="shipping">Vận chuyển</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="discountValue">Discount Value (VND)</Label>
                                    <Input
                                        id="discountValue"
                                        type="number"
                                        placeholder="50000"
                                        value={newVoucherData.value}
                                        onChange={function (event) {
                                            setNewVoucherData({ ...newVoucherData, value: Number(event.target.value) });
                                        }}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="minimumSpend">Minimum Spend (VND)</Label>
                                    <Input
                                        id="minimumSpend"
                                        type="number"
                                        placeholder="100000"
                                        value={newVoucherData.minSpend}
                                        onChange={function (event) {
                                            setNewVoucherData({ ...newVoucherData, minSpend: Number(event.target.value) });
                                        }}
                                    />
                                </div>
                            </div>

                            {}
                            <div className="grid grid-cols-1 gap-2">
                                <Label htmlFor="usageLimit">Total Usage Limit</Label>
                                <Input
                                    id="usageLimit"
                                    type="number"
                                    placeholder="500"
                                    value={newVoucherData.usageLimit}
                                    onChange={function (event) {
                                        setNewVoucherData({ ...newVoucherData, usageLimit: Number(event.target.value) });
                                    }}
                                />
                            </div>

                            {}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={newVoucherData.startDate}
                                        onChange={function (event) {
                                            setNewVoucherData({ ...newVoucherData, startDate: event.target.value });
                                        }}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={newVoucherData.endDate}
                                        onChange={function (event) {
                                            setNewVoucherData({ ...newVoucherData, endDate: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                onClick={handleCreateNewVoucher}
                                className="bg-[#ee4d2d] hover:bg-[#d73211] text-white w-full"
                            >
                                Create Voucher
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {voucherList.map(function (voucher) {
                    return (
                        <div key={voucher.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:border-orange-200 transition-all duration-300">
                            <div className="p-6">
                                {}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#ee4d2d]">
                                        <Ticket className="w-6 h-6" />
                                    </div>
                                    <div className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${voucher.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {voucher.status.toUpperCase()}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">{voucher.code}</h3>
                                        <p className="text-sm text-gray-400 font-medium mb-1">{getVoucherTypeDisplayName(voucher.type)}</p>
                                        <p className="text-sm text-[#ee4d2d] font-bold">
                                            {formatPriceToVND(voucher.value)} OFF
                                        </p>
                                    </div>

                                    {}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Tag className="w-4 h-4 text-gray-400" />
                                            <span>Min. {formatPriceToVND(voucher.minSpend)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span>{voucher.usedCount}/{voucher.usageLimit} Used</span>
                                        </div>
                                    </div>

                                    {}
                                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>
                                                {new Date(voucher.startDate).toLocaleDateString()} - {new Date(voucher.endDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-500 rounded-lg">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 rounded-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {}
                {voucherList.length === 0 && (
                    <div className="col-span-full py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-500">
                        <Ticket className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium">No vouchers created yet</p>
                        <p className="text-sm">Click the button above to create your first discount code.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
