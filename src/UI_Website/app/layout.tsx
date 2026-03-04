import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

import ConditionalFooter from "@/components/ConditionalFooter";

const interFont = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ShopeeFood - Giao Đồ Ăn Tận Nơi",
  description: "Đặt món trực tuyến với hàng ngàn quán ăn, nhà hàng. Giao hàng nhanh chóng và tiện lợi cùng ShopeeFood.",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={interFont.className} suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen font-sans bg-gray-50">
              { }
              <div className="flex-grow">
                {children}
              </div>
              { }
              <ConditionalFooter />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
