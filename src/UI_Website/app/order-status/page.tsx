"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getOrderById, updateOrderStatus, Order } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  CheckCircle,
  ChevronRight,
  MapPin,
  Phone,
  Star,
  Camera,
  Upload,
  X,
  User,
  ShieldCheck,
  Zap,
} from "lucide-react";

type OrderStatusNum = 1 | 2 | 3 | 4;

const STATUS_STEPS = [
  { id: 1, label: "Chờ xác nhận", icon: Clock },
  { id: 2, label: "Đang chuẩn bị", icon: Package },
  { id: 3, label: "Đang giao", icon: Truck },
  { id: 4, label: "Đã nhận hàng", icon: CheckCircle },
];

const REVIEW_TYPES = [
  "Dịch vụ",
  "Tài xế",
  "Đóng gói",
  "Chất lượng quán",
  "Khác",
];

export default function OrderStatusPage() {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get("id");
  
  const [order, setOrder] = useState<Order | null>(null);
  const [currentStatus, setCurrentStatus] = useState<number>(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Review form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewType, setReviewType] = useState(REVIEW_TYPES[0]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const router = useRouter();

  const fetchOrderData = async () => {
    if (!orderIdFromUrl) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await getOrderById(orderIdFromUrl);
      if (data) {
        setOrder(data);
        setCurrentStatus(data.orderStatus);
      }
    } catch (err) {
      console.error("Error fetching order status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
    const interval = setInterval(fetchOrderData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [orderIdFromUrl]);

  const getCurrentStepIndex = () => {
    return STATUS_STEPS.findIndex((step) => step.id === currentStatus);
  };

  const handleConfirmReceipt = async () => {
    if (!orderIdFromUrl) return;
    try {
      const updated = await updateOrderStatus(orderIdFromUrl, 4);
      setOrder(updated);
      setCurrentStatus(4);
      alert("Xác nhận đã nhận hàng thành công!");
    } catch (err) {
      alert("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert("Vui lòng chọn mức độ đánh giá sao nhé!");
      return;
    }

    try {
      // Mapping frontend state to backend ReviewDTO
      const reviewData = {
        orderId: order?.orderId || orderIdFromUrl,
        rating: rating,
        comment: comment,
        reviewType: reviewType,
        mediaUrl: mediaFile ? mediaFile.name : null, // Simplification for now, as file upload is not fully implemented
      };

      console.log("Submitting Review to Backend:", reviewData);
      
      const { createReview } = await import("@/lib/apiClient");
      await createReview(reviewData);

      alert("Cảm ơn bạn đã gửi đánh giá đơn hàng!");
      setIsReviewed(true);
      setIsReviewModalOpen(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 border-4 border-orange-100 border-t-[#ee4d2d] rounded-full animate-spin" />
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest animate-pulse">Đang tải trạng thái đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6">
        <Navbar />
        <div className="p-8 bg-white rounded-3xl shadow-xl border border-gray-100 text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-4 uppercase">Không tìm thấy đơn hàng</h1>
          <p className="text-gray-500 font-bold mb-8 italic">Mã đơn hàng #{orderIdFromUrl} không tồn tại hoặc bạn không có quyền truy cập.</p>
          <Button onClick={() => router.push("/orders")} className="w-full py-6 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-100">
            Quay lại danh sách đơn hàng
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto mt-12 px-4 w-full flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-[#ee4d2d] p-8 text-white relative">
            <div className="relative z-10">
              <h1 className="text-3xl font-black mb-2 uppercase tracking-tight">
                Theo dõi trạng thái
              </h1>
              <p className="text-orange-100 font-bold opacity-90 italic">
                Mã đơn hàng: #{order.orderId}
              </p>
            </div>
            <div className="absolute top-0 right-0 p-8 hidden md:block opacity-20">
              <Package className="w-32 h-32" />
            </div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full -mb-32 -mr-32 blur-3xl"></div>
          </div>

          <div className="p-8">
            {/* Stepper - Hide if cancelled */}
            {currentStatus !== 0 && (
              <div className="relative flex justify-between items-start mb-16 px-4">
                {/* Line connecting steps */}
                <div className="absolute top-7 left-10 right-10 h-1 bg-gray-100 rounded-full -z-10">
                  <div
                    className="h-full bg-green-500 transition-all duration-1000 ease-in-out rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                    style={{
                      width: `${(getCurrentStepIndex() / (STATUS_STEPS.length - 1)) * 100}%`,
                    }}
                  ></div>
                </div>

                {STATUS_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= getCurrentStepIndex();
                  const isCurrent = index === getCurrentStepIndex();

                  return (
                    <div
                      key={step.id}
                      className="flex flex-col items-center group"
                    >
                      <div
                        className={`
                                              w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 relative
                                              ${isActive ? "bg-green-500 text-white shadow-lg shadow-green-100" : "bg-white text-gray-300 border-2 border-gray-100"}
                                              ${isCurrent ? "scale-110 ring-4 ring-green-50" : ""}
                                          `}
                      >
                        <Icon
                          className={`w-7 h-7 ${isCurrent ? "animate-pulse" : ""}`}
                        />
                        {isActive &&
                          !isCurrent &&
                          index !== STATUS_STEPS.length - 1 && (
                            <div className="absolute -top-1 -right-1 bg-white rounded-full">
                              <CheckCircle2 className="w-5 h-5 text-green-500 fill-white" />
                            </div>
                          )}
                      </div>
                      <div className="mt-4 text-center">
                        <p
                          className={`text-xs font-black uppercase tracking-widest ${isActive ? "text-green-600" : "text-gray-400"}`}
                        >
                          {step.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Status Message Section */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                  {currentStatus === 0 && (
                    <X className="w-6 h-6 text-red-500" />
                  )}
                  {currentStatus === 1 && (
                    <Clock className="w-6 h-6 text-[#ee4d2d]" />
                  )}
                  {currentStatus === 2 && (
                    <Package className="w-6 h-6 text-orange-500" />
                  )}
                  {currentStatus === 3 && (
                    <Truck className="w-6 h-6 text-blue-500" />
                  )}
                  {currentStatus === 4 && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-900 text-lg">
                    {currentStatus === 0 &&
                      "Đơn hàng của bạn đã bị hủy"}
                    {currentStatus === 1 &&
                      "Hệ thống đang tiếp nhận đơn hàng của bạn"}
                    {currentStatus === 2 &&
                      "Chủ quán đang chuẩn bị món ăn..."}
                    {currentStatus === 3 &&
                      "Tài xế đang giao đơn hàng đến bạn"}
                    {currentStatus === 4 &&
                      "Đơn hàng đã được giao thành công!"}
                  </h3>
                  <p className="text-gray-500 text-sm font-medium">
                    {currentStatus === 0 &&
                      "Vui lòng đặt lại hoặc liên hệ hỗ trợ nếu cần thiết."}
                    {currentStatus === 1 &&
                      "Vui lòng đợi trong giây lát."}
                    {currentStatus === 2 &&
                      "Món ăn đang được nấu nướng tận tâm."}
                    {currentStatus === 3 &&
                      "Tài xế đang di chuyển, vui lòng để ý điện thoại."}
                    {currentStatus === 4 &&
                      "Chúc bạn ngon miệng với món ăn từ ShopeeFood!"}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 border-2 border-dashed border-gray-100 rounded-2xl">
                <div className="flex items-center gap-2 text-gray-400 mb-3 uppercase tracking-widest font-black text-[10px]">
                  <MapPin className="w-3 h-3" />
                  Địa chỉ nhận hàng
                </div>
                <p className="font-bold text-gray-800">
                  {order.deliveryAddress || "Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội"}
                </p>
              </div>
              <div className="p-6 border-2 border-dashed border-gray-100 rounded-2xl">
                <div className="flex items-center gap-2 text-gray-400 mb-3 uppercase tracking-widest font-black text-[10px]">
                  <Phone className="w-3 h-3" />
                  Thông tin liên hệ
                </div>
                <p className="font-bold text-gray-800">
                  {order.contactPhone || "0987 654 321"} - {order.customerName || "Khách hàng"}
                </p>
              </div>
            </div>

            {/* Action Area */}
            <div className="flex flex-col gap-4">
              {currentStatus === 3 && (
                <Button
                  onClick={handleConfirmReceipt}
                  className="group w-full py-8 bg-red-600 hover:bg-green-600 text-white text-xl font-black rounded-2xl shadow-xl shadow-red-100 hover:shadow-green-100 transition-all hover:scale-[1.02] flex items-center justify-center gap-3 animate-bounce-subtle"
                >
                  <CheckCircle className="w-7 h-7 hidden group-hover:block animate-in fade-in zoom-in duration-300" />
                  TÔI ĐÃ NHẬN ĐƯỢC HÀNG
                </Button>
              )}

              {currentStatus === 4 && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => router.push("/")}
                    className="flex-1 py-6 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-100 text-lg font-bold rounded-2xl transition-all"
                  >
                    Quay về trang chủ
                  </Button>
                  {!isReviewed ? (
                    <Button
                      onClick={() => setIsReviewModalOpen(true)}
                      className="flex-1 py-6 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-100 transition-all"
                    >
                      Đánh giá đơn hàng
                    </Button>
                  ) : (
                    <div className="flex-1 py-6 bg-green-50 text-green-600 border-2 border-green-100 text-lg font-bold rounded-2xl flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Đã gửi đánh giá
                    </div>
                  )}
                </div>
              )}

              <Button
                variant="ghost"
                onClick={() =>
                  router.push("/")
                }
                className="text-gray-400 hover:text-gray-600 font-bold flex items-center justify-center gap-2"
              >
                Tiếp tục mua hàng
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Driver Info Panel - Hide if cancelled */}
        {currentStatus !== 0 && (currentStatus === 3 || currentStatus === 4) && order.driverName && (
          <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-8 animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden text-center">
              <div className="bg-blue-600 p-6 text-white relative">
                <div className="relative z-10">
                  <h2 className="text-xl font-black uppercase tracking-tight">Tài xế của bạn</h2>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Truck className="w-16 h-16" />
                </div>
              </div>
              <div className="p-8">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-blue-50 shadow-inner relative">
                  <User className="w-12 h-12 text-gray-400" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white fill-white" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1">{order.driverName}</h3>
                <p className="text-gray-500 font-bold text-sm mb-6 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  Đối tác ShopeeFood
                </p>
                
                <div className="space-y-4 text-left">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Số điện thoại</p>
                    <p className="font-bold text-gray-800">{order.driverPhone}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Biển số xe</p>
                    <p className="font-bold text-gray-800">{order.licensePlate}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Loại xe</p>
                    <p className="font-bold text-gray-800">{order.vehicleType}</p>
                  </div>
                </div>
                
                <Button className="w-full mt-8 py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95">
                  <Phone className="w-4 h-4" />
                  GỌI CHO TÀI XẾ
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500">
            {/* Modal Header */}
            <div className="bg-[#ee4d2d] p-8 text-white flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-1">
                  Đánh giá đơn hàng
                </h2>
                <p className="text-orange-100 font-bold opacity-90 text-sm">
                  Chia sẻ trải nghiệm của bạn về #{order.orderId}
                </p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-10 space-y-8">
              {/* Star Rating */}
              <div className="text-center">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-4">
                  Mức độ hài lòng của bạn?
                </p>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-all transform hover:scale-125 duration-200"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          (hoverRating || rating) >= star
                            ? "fill-yellow-400 text-yellow-400 drop-shadow-md"
                            : "text-gray-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="mt-3 font-black text-gray-800">
                  {rating === 1 && "Tệ"}
                  {rating === 2 && "Không hài lòng"}
                  {rating === 3 && "Bình thường"}
                  {rating === 4 && "Hài lòng"}
                  {rating === 5 && "Tuyệt vời!"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Review Type */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Bạn đánh giá cho?
                  </label>
                  <select
                    value={reviewType}
                    onChange={(e) => setReviewType(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ee4d2d] font-bold text-gray-700"
                  >
                    {REVIEW_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Media Upload */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Hình ảnh đính kèm
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="review-image"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <button
                      onClick={() =>
                        document.getElementById("review-image")?.click()
                      }
                      className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition-colors group"
                    >
                      <span className="text-gray-500 font-bold truncate max-w-[150px]">
                        {previewUrl
                          ? "Đã chọn ảnh"
                          : mediaFile
                            ? mediaFile.name
                            : "Chọn từ PC..."}
                      </span>
                      <div className="p-1 px-3 bg-white rounded-lg shadow-sm border border-gray-100 text-[#ee4d2d] group-hover:scale-105 transition-transform flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase">
                          Mở PC
                        </span>
                      </div>
                    </button>
                    {previewUrl && (
                      <div className="mt-2 relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            setPreviewUrl(null);
                            setMediaFile(null);
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Bình luận chi tiết ({comment.length}/255)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={255}
                  rows={3}
                  placeholder="Đơn hàng của bạn như thế nào? Hãy chia sẻ cho chúng mình biết nhé..."
                  className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[28px] focus:outline-none focus:ring-2 focus:ring-[#ee4d2d] font-medium text-gray-700 resize-none"
                />
              </div>

              <Button
                onClick={handleSubmitReview}
                className="w-full py-8 bg-[#ee4d2d] hover:bg-[#d73211] text-white text-xl font-black rounded-[28px] shadow-2xl shadow-orange-200 transition-all hover:scale-[1.03] active:scale-100 flex items-center justify-center gap-4"
              >
                <Upload className="w-6 h-6" />
                GỬI ĐÁNH GIÁ NGAY
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
