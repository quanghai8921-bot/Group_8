"use client";

import Navbar from "@/components/Navbar";
import { useCart, parsePrice } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Phone,
  Ticket,
  Coins,
  MessageSquare,
  CreditCard,
  Banknote,
  Smartphone,
  MapPinned,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  getActiveVouchersByMerchant,
  getMockUserCoins,
  SimpleVoucher,
} from "@/lib/apiClient";

export default function CheckoutPage() {
  const {
    cart: itemsToPurchase,
    totalPrice: totalGoodsAmount,
    clearCart: emptyCartAfterSuccess,
  } = useCart();

  const pageRouter = useRouter();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contactPhoneNumber, setContactPhoneNumber] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState<SimpleVoucher | null>(null);
  const [availableVouchers, setAvailableVouchers] = useState<SimpleVoucher[]>([]);
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false);
  const [shouldUseShopeeXu, setShouldUseShopeeXu] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");

  const [wasOrderSuccessful, setWasOrderSuccessful] = useState(false);
  const [generatedOrderCode, setGeneratedOrderCode] = useState("");
  const [deployedOrderId, setDeployedOrderId] = useState<string>("");
  const [userCoins, setUserCoins] = useState<any>(null);

  useEffect(function onPageMount() {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    setGeneratedOrderCode("SHOPEEFOOD_" + randomDigits);

    // Fetch mock user coins
    const userId = localStorage.getItem("userId") || "user123";
    getMockUserCoins(userId).then(setUserCoins).catch((err: any) => console.error("Error fetching coins:", err));

    // Fetch merchant vouchers
    const merchantId = itemsToPurchase[0]?.merchantId;
    if (merchantId) {
      getActiveVouchersByMerchant(merchantId)
        .then(setAvailableVouchers)
        .catch(err => console.error("Error fetching vouchers:", err));
    }
  }, [itemsToPurchase]);

  const fixedShippingFee = 15000;
  const discountableAmount = userCoins?.MaxRedeemablePerOrder || 0;
  const shopeeXuDiscount = shouldUseShopeeXu ? discountableAmount : 0;

  // Calculate Voucher Discount
  let voucherDiscount = 0;
  if (selectedVoucher) {
    if (totalGoodsAmount >= selectedVoucher.minOrderValue) {
      voucherDiscount = selectedVoucher.discountValue;
    }
  }

  const finalBillAmount =
    totalGoodsAmount + fixedShippingFee - shopeeXuDiscount - voucherDiscount;

  function formatVNDPrice(amount: number) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }

  async function submitOrderToStore() {
    if (!deliveryAddress || !contactPhoneNumber) {
      alert(
        "Vui lòng nhập đầy đủ địa chỉ và số điện thoại để chúng tôi giao hàng!",
      );
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Bạn cần đăng nhập để đặt hàng!");
      pageRouter.push("/login");
      return;
    }

    // Since we can have items from multiple merchants in the general cart,
    // but the backend placeOrder currently assumes a single merchant per order (based on PlaceOrderDTO),
    // we should group by merchant or just take the first one if we assume single merchant checkout for now.
    // However, looking at the code, it seems itemsToPurchase is likely filtered or users usually buy from one store.
    const merchantId = itemsToPurchase[0]?.merchantId;

    if (!merchantId) {
      alert("Không tìm thấy thông tin cửa hàng!");
      return;
    }

    try {
      const orderData = {
        userId,
        merchantId,
        deliveryAddress,
        contactPhone: contactPhoneNumber,
        customerNote,
        voucherCode: selectedVoucher?.voucherCode || null,
        shopeeXuUsed: shopeeXuDiscount > 0,
        shippingFee: fixedShippingFee,
        paymentMethod: selectedPaymentMethod,
      };

      const result = await (await import("@/lib/apiClient")).placeOrder(orderData);
      
      if (result) {
        setWasOrderSuccessful(true);
        setDeployedOrderId(result.orderId);
        await emptyCartAfterSuccess();
      }
    } catch (error: any) {
      const apiErr = (await import("@/lib/apiClient")).handleApiError(error);
      alert("Đặt hàng thất bại: " + apiErr.message);
    }
  }

  const handleSelectVoucher = (voucher: SimpleVoucher) => {
    if (totalGoodsAmount < voucher.minOrderValue) {
      alert(`Đơn hàng tối thiểu ${formatVNDPrice(voucher.minOrderValue)} mới có thể dùng voucher này!`);
      return;
    }
    setSelectedVoucher(voucher);
    setIsVoucherDialogOpen(false);
  };

  if (wasOrderSuccessful === true) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping scale-150 opacity-20"></div>
          <CheckCircle className="w-28 h-28 text-green-500 relative z-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Đặt đơn hàng thành công!
        </h1>
        <p className="text-gray-500 mb-10 max-w-lg leading-relaxed text-lg">
          Cảm ơn bạn đã tin dùng ShopeeFood. Đơn hàng{" "}
          <span className="font-bold text-[#ee4d2d]">{generatedOrderCode}</span>{" "}
          đang được xử lý và sẽ sớm được tài xế giao đến bạn.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button
            className="flex-1 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-100 py-8 text-xl font-bold rounded-2xl transition-all active:scale-95"
            onClick={function () {
              pageRouter.push("/");
            }}
          >
            Trang chủ
          </Button>
          <Button
            className="flex-1 bg-[#ee4d2d] hover:bg-[#d73211] text-white py-8 text-xl font-bold rounded-2xl shadow-xl shadow-orange-100 transition-all active:scale-95 flex items-center justify-center gap-2"
            onClick={function () {
              pageRouter.push(`/order-status?id=${deployedOrderId}`);
            }}
          >
            Theo dõi đơn hàng
          </Button>
        </div>
      </div>
    );
  }

  if (itemsToPurchase.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="container mx-auto py-32 px-4 text-center">
          <div className="text-6xl mb-6">🏜️</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="text-gray-500 mb-10">
            Hãy quay lại trang chủ để chọn những món ăn ngon nhé!
          </p>
          <Button
            className="bg-[#ee4d2d] hover:bg-[#d73211] px-10 py-6 text-lg font-bold rounded-xl"
            onClick={function () {
              pageRouter.push("/");
            }}
          >
            Quay lại mua sắm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex flex-col">
      <Navbar />

      <div className="max-w-5xl mx-auto mt-12 px-4 w-full flex-grow">
        <h1 className="text-3xl font-black mb-8 flex items-center gap-3 text-gray-900">
          <CreditCard className="w-8 h-8 text-[#ee4d2d]" />
          Thanh Toán
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {}
          <div className="lg:col-span-2 space-y-8">
            {}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-100/50">
              <div className="flex items-center gap-2.5 text-[#ee4d2d] mb-6 font-black text-xl">
                <MapPin className="w-6 h-6" />
                Địa Chỉ Nhận Hàng
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label
                    htmlFor="contactPhone"
                    className="font-bold text-gray-700"
                  >
                    Số điện thoại
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                    <Input
                      id="contactPhone"
                      placeholder="Nhập số điện thoại liên hệ..."
                      className="pl-12 h-12 rounded-xl bg-gray-50 border-gray-100 focus-visible:ring-[#ee4d2d]/20 transition-all font-medium"
                      value={contactPhoneNumber}
                      onChange={function (e) {
                        setContactPhoneNumber(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label
                    htmlFor="deliveryAddr"
                    className="font-bold text-gray-700"
                  >
                    Địa chỉ chi tiết
                  </Label>
                  <div className="relative">
                    <MapPinned className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                    <Input
                      id="deliveryAddr"
                      placeholder="Nhập số nhà, tên đường, phường..."
                      className="pl-12 h-12 rounded-xl bg-gray-50 border-gray-100 focus-visible:ring-[#ee4d2d]/20 transition-all font-medium"
                      value={deliveryAddress}
                      onChange={function (e) {
                        setDeliveryAddress(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              <div className="p-5 bg-gray-50/50 border-b border-gray-100 font-bold flex justify-between items-center text-xs text-gray-400 uppercase tracking-widest px-8">
                <span>Sản phẩm</span>
                <div className="hidden md:flex gap-16 items-center">
                  <span className="w-20 text-right">Đơn giá</span>
                  <span className="w-16 text-center">SL</span>
                  <span className="w-24 text-right">Thành tiền</span>
                </div>
              </div>
              <div className="divide-y divide-gray-50 px-4 md:px-0">
                {itemsToPurchase.map(function (item) {
                  const toppings = item.selectedToppings || [];
                  const itemKey = item.foodId + (toppings.map((t: any) => t.toppingName).sort().join(",") || "");
                  const basePrice = Number(item.price) || 0;
                  const toppingPrice = toppings.reduce((sum: number, t: any) => sum + (Number(t.price) || 0), 0);
                  const itemTotal = (basePrice + toppingPrice) * (Number(item.quantity) || 0);

                  return (
                    <div
                      key={itemKey}
                      className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 w-full">
                        <img
                          src={item.foodImage || "/placeholder-food.jpg"}
                          alt={item.foodName}
                          className="w-16 h-16 object-cover rounded-xl border border-gray-100 shadow-sm"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-base">
                            {item.foodName}
                          </p>
                          {toppings.length > 0 && (
                            <p className="text-[10px] text-gray-400 font-medium">
                              + {toppings.map((t: any) => t.toppingName).join(", ")}
                            </p>
                          )}
                          <p className="text-[10px] text-blue-500 font-black bg-blue-50 inline-block px-2 py-0.5 rounded-full mt-1 border border-blue-100 uppercase tracking-tighter">
                            Best Choice
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full md:w-auto md:gap-16 text-sm">
                        <p className="md:w-20 text-right font-medium text-gray-500">
                          {formatVNDPrice(basePrice + toppingPrice)}
                        </p>
                        <p className="md:w-16 text-center font-bold text-gray-900">
                          x{item.quantity}
                        </p>
                        <p className="md:w-24 text-right font-black text-[#ee4d2d] text-base">
                          {formatVNDPrice(itemTotal)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-black mb-6 text-gray-900 border-l-4 border-[#ee4d2d] pl-4">
                Phương thức thanh toán
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all duration-300 ${selectedPaymentMethod === "cash" ? "border-[#ee4d2d] bg-orange-50 text-[#ee4d2d] shadow-md shadow-orange-100" : "border-gray-50 hover:border-gray-100 text-gray-400"}`}
                  onClick={function () {
                    setSelectedPaymentMethod("cash");
                  }}
                >
                  <Banknote className="w-8 h-8 mb-3" />
                  <span className="text-sm font-bold">Tiền mặt</span>
                </button>
                <button
                  className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all duration-300 ${selectedPaymentMethod === "bank" ? "border-[#ee4d2d] bg-orange-50 text-[#ee4d2d] shadow-md shadow-orange-100" : "border-gray-50 hover:border-gray-100 text-gray-400"}`}
                  onClick={function () {
                    setSelectedPaymentMethod("bank");
                  }}
                >
                  <CreditCard className="w-8 h-8 mb-3" />
                  <span className="text-sm font-bold">Chuyển khoản</span>
                </button>
              </div>

              {}
              {selectedPaymentMethod === "bank" && (
                <div className="mt-8 p-8 border-2 border-dashed border-orange-200 rounded-3xl bg-orange-50/30 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                  <div className="text-[#ee4d2d] font-black mb-6 flex items-center gap-2 text-xl italic uppercase tracking-wider">
                    <CreditCard className="w-7 h-7" />
                    Thông Tin Chuyển Khoản
                  </div>
                  <div className="bg-white p-4 rounded-[40px] shadow-2xl mb-8 relative group hover:scale-[1.02] transition-transform">
                    <img
                      src="/QrBank.JPG"
                      alt="QR Code Ngân Hàng"
                      className="w-72 h-auto rounded-[30px] shadow-inner"
                    />
                    <div className="absolute inset-0 border-8 border-[#ee4d2d]/5 rounded-[40px] pointer-events-none"></div>
                  </div>
                  <div className="text-center space-y-4 mb-10 bg-white p-6 rounded-2xl w-full max-w-sm shadow-sm border border-orange-100">
                    <div className="flex justify-between items-center text-gray-500">
                      <span className="text-sm font-medium">Nội dung CK:</span>
                      <span className="font-black text-gray-900 text-lg uppercase tracking-widest">
                        {generatedOrderCode}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                      <span className="text-sm font-medium">Số tiền:</span>
                      <span className="font-black text-[#ee4d2d] text-2xl">
                        {formatVNDPrice(finalBillAmount)}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="group bg-red-600 hover:bg-green-600 text-white font-black px-16 py-8 rounded-2xl shadow-xl shadow-red-100 hover:shadow-green-100 transition-all hover:scale-105 flex items-center gap-3 text-xl"
                    onClick={submitOrderToStore}
                  >
                    <CheckCircle className="w-7 h-7 hidden group-hover:block animate-in fade-in zoom-in duration-300" />
                    Đã Chuyển Khoản
                  </Button>
                </div>
              )}
            </div>
          </div>

          {}
          <div className="lg:col-span-1 space-y-6">
            {}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-28">
              <h2 className="text-2xl font-black mb-8 text-gray-900">
                Chi tiết thanh toán
              </h2>

              <div className="space-y-6 mb-8">
                <div className="flex justify-between text-gray-500 font-bold mb-6">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-orange-400" />
                    <span>Voucher:</span>
                  </div>
                  {selectedVoucher ? (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-black">{selectedVoucher.voucherCode}</span>
                      <button 
                         className="text-gray-300 hover:text-red-500 text-xs"
                         onClick={() => setSelectedVoucher(null)}
                      >
                        (Gỡ)
                      </button>
                    </div>
                  ) : (
                    <Dialog open={isVoucherDialogOpen} onOpenChange={setIsVoucherDialogOpen}>
                      <DialogTrigger asChild>
                        <button className="text-blue-500 text-xs hover:underline flex items-center gap-1 font-bold">
                          Chọn voucher <ChevronRight className="w-3 h-3" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[450px] rounded-3xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black text-gray-900">Chọn Voucher Cửa Hàng</DialogTitle>
                          <DialogDescription className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">
                            Chọn 1 voucher ưu ái nhất cho bữa ăn của bạn
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-6 space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          {availableVouchers.length === 0 ? (
                            <div className="text-center py-10 italic text-gray-400">
                              Quán hiện chưa có voucher nào khả dụng.
                            </div>
                          ) : (
                            availableVouchers.map(v => (
                              <div 
                                key={v.voucherId}
                                className={`group p-5 border-2 rounded-2xl cursor-pointer transition-all hover:border-[#ee4d2d]/50 ${totalGoodsAmount < v.minOrderValue ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white hover:shadow-lg'}`}
                                onClick={() => totalGoodsAmount >= v.minOrderValue && handleSelectVoucher(v)}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <p className="font-black text-[#ee4d2d] text-lg uppercase tracking-wider">{v.voucherCode}</p>
                                    <p className="text-xs font-bold text-gray-500">{v.voucherType === 'food' ? 'Giảm giá đồ ăn' : v.voucherType === 'drink' ? 'Giảm giá thức uống' : 'Giảm phí vận chuyển'}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-black text-gray-900 text-xl">-{formatVNDPrice(v.discountValue)}</p>
                                  </div>
                                </div>
                                <div className="pt-3 border-t border-dashed border-gray-100 flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-gray-400">Đơn tối thiểu: {formatVNDPrice(v.minOrderValue)}</span>
                                  {totalGoodsAmount < v.minOrderValue && (
                                    <span className="text-[10px] font-black text-red-500">Chưa đủ điều kiện</span>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <div className="flex justify-between items-center bg-orange-50/50 p-4 rounded-2xl border border-orange-100 group transition-all hover:bg-orange-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-400 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                      <Coins className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-sm">
                        Dùng {discountableAmount.toLocaleString("vi-VN")} Shopee Xu
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        Tiết kiệm {formatVNDPrice(discountableAmount)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShouldUseShopeeXu(!shouldUseShopeeXu)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${shouldUseShopeeXu ? "bg-[#ee4d2d]" : "bg-gray-200"}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${shouldUseShopeeXu ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </div>

                <div className="flex flex-col gap-2 pb-6 border-b border-gray-50">
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Tổng tiền hàng:</span>
                    <span className="text-gray-900">
                      {formatVNDPrice(totalGoodsAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Phí vận chuyển:</span>
                    <span className="text-gray-900">
                      {formatVNDPrice(fixedShippingFee)}
                    </span>
                  </div>
                  {shouldUseShopeeXu && (
                    <div className="flex justify-between text-gray-500 font-medium pt-2 animate-in fade-in slide-in-from-top-1 duration-300">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span>Shopee Xu đã dùng:</span>
                      </div>
                      <span className="text-[#ee4d2d] font-bold">
                        -{formatVNDPrice(discountableAmount)}
                      </span>
                    </div>
                  )}
                  {selectedVoucher && (
                    <div className="flex justify-between text-gray-500 font-medium pt-2 animate-in fade-in slide-in-from-top-1 duration-300">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-blue-500" />
                        <span>Giảm giá Voucher:</span>
                      </div>
                      <span className="text-[#ee4d2d] font-bold">
                        -{formatVNDPrice(voucherDiscount)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-3xl font-black text-[#ee4d2d] pt-2">
                  <span className="text-gray-900 text-lg flex items-center">
                    Tổng:
                  </span>
                  <span>{formatVNDPrice(finalBillAmount)}</span>
                </div>
              </div>

              {selectedPaymentMethod !== "bank" && (
                <Button
                  className="w-full py-8 text-2xl font-black bg-[#ee4d2d] hover:bg-[#d73211] shadow-2xl shadow-orange-100 transition-all hover:scale-[1.02] active:scale-95 rounded-2xl flex items-center justify-center gap-3"
                  onClick={submitOrderToStore}
                >
                  ĐẶT ĐƠN NGAY
                  <ChevronRight className="w-6 h-6" />
                </Button>
              )}

              <div className="mt-8 space-y-4 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-black text-gray-400 uppercase tracking-tighter">
                    Ghi chú cho quán:
                  </span>
                </div>
                <Input
                  placeholder="Ví dụ: Đồ ăn nhớ cho cay ít thôi nha..."
                  className="bg-gray-50 border-none rounded-xl h-12 text-sm italic"
                  value={customerNote}
                  onChange={function (e) {
                    setCustomerNote(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
