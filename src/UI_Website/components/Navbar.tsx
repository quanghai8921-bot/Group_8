import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between p-4 bg-white shadow-md">
            <Link href="/" className="text-2xl font-bold text-blue-600 text-decoration-none">
                Mua sắm thiết bị điện tử siêu rẻ
            </Link>
            <div className="flex gap-4">
                <Link href="/login">
                    <Button variant="outline" className="!rounded-full">Login</Button>
                </Link>
                <Link href="/register">
                    <Button className="!rounded-full">Register</Button>
                </Link>
            </div>
        </nav>
    );
}