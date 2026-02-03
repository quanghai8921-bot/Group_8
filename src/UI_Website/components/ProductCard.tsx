import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductProps {
  product: {
    id: number;
    name: string;
    image: string;
    description: string;
    price: string;
  };
}

export default function ProductCard({ product }: ProductProps) {
  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md" 
        />
      </CardHeader>
      <CardContent>
        <CardTitle className="mb-2 text-xl">{product.name}</CardTitle> 
        <p className="text-gray-600 text-sm mb-4">{product.description}</p> 
        <p className="text-lg font-bold text-primary">{product.price}</p> 
      </CardContent>
      <CardFooter>
        <Button className="w-full !rounded-full">Mua ngay</Button>
      </CardFooter>
    </Card>
  );
}