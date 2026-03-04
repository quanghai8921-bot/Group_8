"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
    const pathname = usePathname();

    // Check if the current path is in admin or merchant section
    const shouldHide = pathname.startsWith('/admin') || pathname.startsWith('/merchant');

    if (shouldHide) {
        return null;
    }

    return <Footer />;
}
