import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";

export default function Home() {
  const productElements = products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ));

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Danh Sách Apple</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productElements}
        </div>
      </div>
    </main>
  );
}