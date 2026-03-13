export interface ToppingOption {
  ToppingId: string;
  ToppingName: string;
  Price: number;
}

export interface Product {
  FoodId: string;
  CategoryId: string;
  MerchantId: string;
  FoodName: string;
  OriginalPrice: number;
  SalePrice: number;
  FoodImage: string;
  Descriptions: string;
  FoodStatus: number;
  // UI helpers
  merchantName?: string;
  rating?: number;
  discount?: string;
  toppingOptions?: ToppingOption[];
}
;
