export interface ToppingOption {
  toppingName: string;
  price: string;
}

export interface Product {
  id: number;
  name: string;
  merchantId: string;
  merchantName: string;
  image: string;
  description: string;
  price: string;
  discount?: string;
  toppingOptions?: ToppingOption[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Nui & Mì Xào Bò",
    merchantId: "m1",
    merchantName: "Quán Ăn Tisu",
    image: "https://cdn.tgdd.vn/2021/01/CookRecipe/Avatar/nui-xao-bo-bam-ca-chua-thumbnail.jpg",
    description: "Nui xào bò đậm đà, mì xào giòn rụm với rau củ tươi ngon, phục vụ kèm nước chấm đặc trưng của quán.",
    price: "35.000 VNĐ",
    discount: "Mã giảm 10%",
    toppingOptions: [
      { toppingName: "Thêm Trứng", price: "5.000 VNĐ" },
      { toppingName: "Thêm Bò", price: "15.000 VNĐ" },
      { toppingName: "Xúc Xích", price: "10.000 VNĐ" }
    ]
  },
  {
    id: 2,
    name: "Cháo Dinh Dưỡng Dành Cho Bé",
    merchantId: "m2",
    merchantName: "Cháo Trẻ Em BiBo",
    image: "https://2.bp.blogspot.com/-K4ApjSsk7DY/WY0vU2mKeqI/AAAAAAAAAJY/2w1b406X9BMCoydV0J0sltZuSkDJZAk_ACLcBGAs/s1600/15.jpg",
    description: "Cháo dinh dưỡng cho bé với nguyên liệu sạch, thay đổi thực đơn mỗi ngày: lươn, thịt bằm, cá hồi.",
    price: "25.000 VNĐ",
    discount: "Mã giảm 20%",
    toppingOptions: [
      { toppingName: "Thêm Phô Mai", price: "5.000 VNĐ" },
      { toppingName: "Thêm Hải Sản", price: "10.000 VNĐ" }
    ]
  },
  {
    id: 3,
    name: "Cơm Tấm Sườn Bì Chả",
    merchantId: "m3",
    merchantName: "Cơm Tấm Chị Huệ",
    image: "https://image-us.eva.vn/upload/2-2021/images/2021-04-30/ngay-nghi-hoc-me-dam-cach-lam-com-tam-suon-bi-ngon-hoan-hao-tu-a-den-z-batch_176214510_10222974579845719_3122974772686227-1619738133-734-width700height393.jpg",
    description: "Cơm tấm sườn bì chả truyền thống, sườn nướng mật ong thơm phức, nước mắm kẹo đậm vị.",
    price: "45.000 VNĐ",
    discount: "Giảm món",
    toppingOptions: [
      { toppingName: "Thêm Sườn", price: "25.000 VNĐ" },
      { toppingName: "Thêm Trứng Ốp La", price: "7.000 VNĐ" },
      { toppingName: "Thêm Chả", price: "10.000 VNĐ" }
    ]
  },
  {
    id: 4,
    name: "Phở Bò Truyền Thống",
    merchantId: "m4",
    merchantName: "Phở 193",
    image: "https://cdn.hita.com.vn/storage/blog/am-thuc-doi-song/cach-nau-pho-3.jpeg",
    description: "Phở bò truyền thống với nước dùng thanh ngọt từ xương hầm, thịt bò tái lăn mềm mại.",
    price: "55.000 VNĐ",
    discount: "Mã giảm 10%",
    toppingOptions: [
      { toppingName: "Thêm Quẩy", price: "5.000 VNĐ" },
      { toppingName: "Thêm Thịt", price: "20.000 VNĐ" },
      { toppingName: "Trứng Chần", price: "10.000 VNĐ" }
    ]
  },
  {
    id: 5,
    name: "Combo Gà Rán & Trà Sữa",
    merchantId: "m5",
    merchantName: "Rana Food & Drinks",
    image: "https://tse1.mm.bing.net/th/id/OIP.TYykdUopspwltWZDgD_zgQHaE8?rs=1&pid=ImgDetMain&o=7&rm=3",
    description: "Combo gà rán giòn tan, khoai tây chiên và trà sữa trân châu cho buổi chiều năng động.",
    price: "60.000 VNĐ",
    discount: "Giảm đến 2k",
    toppingOptions: [
      { toppingName: "Thêm Trân Châu", price: "5.000 VNĐ" },
      { toppingName: "Thêm Khoai Tây", price: "15.000 VNĐ" }
    ]
  },
  {
    id: 6,
    name: "Hột Vịt Lộn & Đồ Ăn Vặt",
    merchantId: "m6",
    merchantName: "Minh Tiến",
    image: "https://tse2.mm.bing.net/th/id/OIP.6fqtuI82gBB2zUb811b7nAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    description: "Mực nướng, hột vịt lộn và các món nhắm bình dân, phục vụ nhanh chóng.",
    price: "15.000 VNĐ",
    discount: "Giảm hết 30%",
    toppingOptions: [
      { toppingName: "Thêm Rau Răm", price: "0 VNĐ" },
      { toppingName: "Muối Tiêu Chanh", price: "0 VNĐ" }
    ]
  },
];
;
