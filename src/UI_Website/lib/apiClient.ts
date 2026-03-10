import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import mockDishes from './mockData/dishes.json';
import mockShops from './mockData/shops.json';
import mockOrders from './mockData/orders.json';
import mockReviews from './mockData/reviews.json';
import mockProducts from './mockData/products.json';

// Create axios instance with base URL
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Handle response errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== Types & Interfaces ====================

export interface UserResponse {
  UserId: string;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  BirthDate: string;
  RoleName?: string;
  Token?: string;
}

export interface Topping {
  ToppingId: string;
  MerchantId: string;
  ToppingName: string;
  Price: number;
}

export interface FoodCategory {
  CategoryId: string;
  CategoryName: string;
}

export interface Merchant {
  MerchantId: string;
  UserId: string;
  StoreName: string;
  StoreAddress: string;
  OpenTime: string;
  CloseTime: string;
  ActiveStatus: number; // 0/1
  ShopType: string;
}

export interface Food {
  FoodId: string;
  CategoryId: string;
  MerchantId: string;
  FoodName: string;
  OriginalPrice: number;
  SalePrice: number;
  FoodImage: string;
  Descriptions: string;
  FoodStatus: number; // 0/1
  // Join/Helper fields
  StoreName?: string;
  CategoryName?: string;
  ToppingOptions?: Topping[];
  Rating?: number;
}

export interface OrderDetail {
  OrderItemId: string;
  OrderId: string;
  FoodId: string;
  Quantity: number;
  UnitPrice: number;
  FoodName?: string;
  FoodImage?: string;
}

export interface Order {
  OrderId: string;
  UserId: string;
  MerchantId: string;
  DriverId?: string | null;
  VoucherId?: string | null;
  OrderDate: string;
  PickupTime?: string;
  DeliveryTime?: string;
  FoodAmount: number;
  ShippingFee: number;
  FoodDiscount: number;
  ShipDiscount: number;
  FinalAmount: number;
  OrderStatus: number; // 1-5
  DeliveryAddress: string;
  // Join fields
  FullName?: string;
  StoreName?: string;
  OrderItemsSummary?: string;
  PaymentStatus?: number; // 0/1
  PaymentMethod?: string;
  AvatarUrl?: string; // For merchant UI
  orderDetails?: OrderDetail[];
}

export interface Review {
  ReviewId: string;
  OrderId: string;
  Rating: number;
  Comment: string;
  ReviewType: string; // 'Order' | 'FoodItem'
  MediaUrl?: string;
  ReviewDate: string;
  // Join fields
  FullName?: string;
  FoodName?: string;
  FoodImage?: string;
}

// ==================== Mock Data Access =====================

export const getMockDishes = async (): Promise<Food[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockDishes as Food[];
};

export const getMockShops = async (): Promise<Merchant[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockShops as Merchant[];
};

export const getMockOrders = async (): Promise<Order[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockOrders as Order[];
};

export const getMockReviews = async (): Promise<Review[]> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return mockReviews as Review[];
};

export const getMockProducts = async (): Promise<Food[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockProducts as Food[];
};

// ==================== API Methods (Templates) ====================

export const getAllFoods = async (): Promise<Food[]> => {
  const response = await apiClient.get<Food[]>('/foods');
  return response.data;
};

export const getFoodsByMerchant = async (merchantId: string): Promise<Food[]> => {
  const response = await apiClient.get<Food[]>(`/foods/merchant/${merchantId}`);
  return response.data;
};

export const getCart = async (userId: string): Promise<any> => {
  const response = await apiClient.get(`/carts/${userId}`);
  return response.data;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const response = await apiClient.get<Order[]>(`/orders/user/${userId}`);
  return response.data;
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  const response = await apiClient.get<Order>(`/orders/${orderId}`);
  return response.data;
};

export const getOrderReviews = async (orderId: string): Promise<Review[]> => {
  const response = await apiClient.get<Review[]>(`/reviews/order/${orderId}`);
  return response.data;
};

export default apiClient;
