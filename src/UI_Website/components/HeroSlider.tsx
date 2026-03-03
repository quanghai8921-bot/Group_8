"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";


import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200",
        title: "Món ngon mỗi ngày",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200",
        title: "Đặc sản vùng miền",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200",
        title: "Pizza siêu ưu đãi",
    },
    {
        id: 4,
        image: "https://forevermark.vn/wp-content/uploads/2023/04/cac-loai-banh-trang-mieng-dam-cuoi-768x614.jpg",
        title: "Tráng miệng ngọt ngào",
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=1200",
        title: "Món Á đậm vị",
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200",
        title: "Bữa tối lãng mạn",
    },
    {
        id: 7,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200",
        title: "Thực đơn tiệc nướng",
    },
    {
        id: 8,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200",
        title: "Burger thượng hạng",
    },
    {
        id: 9,
        image: "https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?q=80&w=1200",
        title: "Bữa sáng tràn năng lượng",
    },
    {
        id: 10,
        image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=1200",
        title: "Hải sản tươi sống",
    },
];

export default function HeroSlider() {
    return (
        <div className="w-full h-[400px] sm:h-[500px] mb-10 rounded-2xl overflow-hidden shadow-xl relative group">
            <Swiper
                spaceBetween={0}
                centeredSlides={true}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="w-full h-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-full">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <h2 className="text-white text-3xl sm:text-5xl font-bold tracking-wider text-center px-4 drop-shadow-lg">
                                    {slide.title}
                                </h2>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
