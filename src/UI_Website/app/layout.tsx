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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const removeAttribute = () => {
                  const elements = document.querySelectorAll('[bis_skin_checked]');
                  elements.forEach(el => el.removeAttribute('bis_skin_checked'));
                };
                
                // Remove initially
                removeAttribute();
                
                // Observe for future injections
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' || mutation.type === 'childList') {
                      removeAttribute();
                    }
                  });
                });
                
                observer.observe(document.documentElement, { 
                  attributes: true, 
                  childList: true, 
                  subtree: true,
                  attributeFilter: ['bis_skin_checked']
                });
              })();
            `,
          }}
        />
      </head>
      <body className={interFont.className} suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen font-sans bg-gray-50" suppressHydrationWarning>
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
