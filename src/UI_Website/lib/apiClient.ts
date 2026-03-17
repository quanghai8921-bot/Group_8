import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Create axios instance with base URL
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:4040/api',
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

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
}

export interface UserRegistration {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  birthDate: string;
  addressDelivery: string;
}

export interface UserResponse {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  birthDate?: string;
  addressDelivery?: string;
  shopeeCoins?: number;
  roles?: string[];
  token?: string;
}

export interface Topping {
  toppingId: string;
  merchantId: string;
  toppingName: string;
  price: number;
}

export interface FoodCategory {
  categoryId: string;
  categoryName: string;
}

export interface Merchant {
  merchantId: string;
  userId: string;
  storeName: string;
  storeAddress: string;
  openTime: string;
  closeTime: string;
  activeStatus: boolean;
  shopType: string;
}

export interface Food {
  foodId: string;
  categoryId: string;
  merchantId: string;
  foodName: string;
  originalPrice: number;
  salePrice: number;
  foodImage: string;
  descriptions: string;
  foodStatus: number;
  // Join/Helper fields
  storeName?: string;
  categoryName?: string;
  toppingOptions?: Topping[];
  rating?: number;
}

export interface OrderDetail {
  orderItemId: string;
  orderId: string;
  foodId: string;
  quantity: number;
  unitPrice: number;
  foodName?: string;
  foodImage?: string;
}

export interface Order {
  orderId: string;
  userId: string;
  merchantId: string;
  driverId?: string | null;
  voucherId?: string | null;
  orderTime: string;
  foodAmount: number;
  shippingFee: number;
  foodDiscount: number;
  shipDiscount: number;
  finalAmount: number;
  orderStatus: number;
  deliveryAddress: string;
  contactPhone?: string;
  customerNote?: string;
  driverName?: string;
  driverPhone?: string;
  licensePlate?: string;
  vehicleType?: string;
  // Join fields
  customerName?: string;
  customerEmail?: string;
  storeName?: string;
  orderItemsSummary?: string;
  paymentStatus?: number;
  paymentMethod?: string;
  avatarUrl?: string;
  orderDetails?: OrderDetail[];
}

export interface Review {
  reviewId: string;
  orderId: string;
  rating: number;
  comment: string;
  reviewType: string;
  mediaUrl?: string;
  reviewDate: string;
  createdAt?: string;
  fullName?: string;
  phoneNumber?: string;
  foodName?: string;
  foodImage?: string;
}

// ==================== API Methods ====================

export const getAllFoods = async (): Promise<Food[]> => {
  const response = await apiClient.get<ApiResponse<Food[]>>('/foods');
  return response.data.data;
};

export const getFoodsByMerchant = async (merchantId: string, includeAll: boolean = false): Promise<Food[]> => {
  const response = await apiClient.get<ApiResponse<Food[]>>(`/foods/merchant/${merchantId}${includeAll ? '?all=true' : ''}`);
  return response.data.data;
};

export const createFood = async (foodData: Partial<Food>): Promise<Food> => {
  const response = await apiClient.post<ApiResponse<Food>>('/foods', foodData);
  return response.data.data;
};

export const updateFood = async (foodId: string, foodData: Partial<Food>): Promise<Food> => {
  const response = await apiClient.put<ApiResponse<Food>>(`/foods/${foodId}`, foodData);
  return response.data.data;
};

export const deleteFood = async (foodId: string): Promise<void> => {
  await apiClient.delete<ApiResponse<any>>(`/foods/${foodId}`);
};

export const getMerchantOrders = async (merchantId: string): Promise<Order[]> => {
  const response = await apiClient.get<ApiResponse<Order[]>>(`/orders/merchant/${merchantId}`);
  return response.data.data;
};

export const updateOrderStatus = async (orderId: string, status: number): Promise<Order> => {
  const response = await apiClient.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, { status });
  return response.data.data;
};

export const getAllCategories = async (): Promise<FoodCategory[]> => {
  const response = await apiClient.get<ApiResponse<FoodCategory[]>>('/categories');
  return response.data.data;
};

export const getMerchantToppings = async (merchantId: string): Promise<Topping[]> => {
  const response = await apiClient.get<ApiResponse<Topping[]>>(`/toppings/merchant/${merchantId}`);
  return response.data.data;
};

// Merchant Application APIs
export interface MerchantApplication {
  applicationId?: string;
  user: { userId: string };
  storeName: string;
  storeAddress: string;
  shopType: string;
  applicationStatus?: string;
  createdAt?: string;
}

export const submitMerchantApplication = async (app: MerchantApplication): Promise<MerchantApplication> => {
  const response = await apiClient.post<ApiResponse<MerchantApplication>>('/merchants/apply', app);
  return response.data.data;
};

export const getPendingApplications = async (): Promise<MerchantApplication[]> => {
  const response = await apiClient.get<ApiResponse<MerchantApplication[]>>('/merchants/apply/pending');
  return response.data.data;
};

export const approveApplication = async (id: string): Promise<void> => {
  await apiClient.post(`/merchants/apply/${id}/approve`);
};

export const rejectApplication = async (id: string): Promise<void> => {
  await apiClient.post(`/merchants/apply/${id}/reject`);
};

export const getMyApplications = async (userId: string): Promise<MerchantApplication[]> => {
  const response = await apiClient.get<ApiResponse<MerchantApplication[]>>(`/merchants/apply/user/${userId}`);
  return response.data.data;
};

export const getMerchantById = async (id: string): Promise<Merchant> => {
  const response = await apiClient.get<ApiResponse<Merchant>>(`/merchants/${id}`);
  return response.data.data;
};

// Cart APIs
export interface AddCartItemDTO {
  userId: string;
  merchantId: string;
  foodId: string;
  quantity: number;
  note?: string;
  toppingIds?: string[];
}

export interface CartItemDTO {
  cartItemId: string;
  foodId: string;
  foodName: string;
  quantity: number;
  note?: string;
  foodImage?: string;
  unitPrice: number;
  totalPrice: number;
  toppings: {
    toppingId: string;
    toppingName: string;
    price: number;
  }[];
}

export interface CartResponseDTO {
  cartId: string;
  userId: string;
  merchantId: string;
  subtotalPrice: number;
  items: CartItemDTO[];
}

export const addToCartInDb = async (dto: AddCartItemDTO): Promise<CartResponseDTO> => {
  const response = await apiClient.post<ApiResponse<CartResponseDTO>>('/carts/add', dto);
  return response.data.data;
};

export const getCartFromDb = async (userId: string, merchantId: string): Promise<CartResponseDTO> => {
  const response = await apiClient.get<ApiResponse<CartResponseDTO>>(`/carts/${userId}/${merchantId}`);
  return response.data.data;
};

export const getCartsByUser = async (userId: string): Promise<CartResponseDTO[]> => {
  const response = await apiClient.get<ApiResponse<CartResponseDTO[]>>(`/carts/user/${userId}`);
  return response.data.data;
};

export const removeCartItemFromDb = async (cartItemId: string): Promise<void> => {
  await apiClient.delete(`/carts/item/${cartItemId}`);
};

export const clearCartFromDb = async (cartId: string): Promise<void> => {
  await apiClient.delete(`/carts/${cartId}`);
};

export const getMockUserCoins = async (userId: string): Promise<any> => {
  return {
    TotalCoins: 50000,
    MaxRedeemablePerOrder: 15000,
    CoinHistory: []
  };
};

export const getMerchantByUserId = async (userId: string): Promise<Merchant | null> => {
  try {
    const response = await apiClient.get<ApiResponse<Merchant>>(`/merchants/user/${userId}`);
    return response.data.data;
  } catch (error) {
    return null;
  }
};

// Review APIs
export const getMerchantReviews = async (merchantId: string): Promise<Review[]> => {
  const response = await apiClient.get<ApiResponse<Review[]>>(`/reviews/merchant/${merchantId}`);
  return response.data.data;
};

// Order APIs

// Voucher APIs
export interface SimpleVoucher {
  voucherId?: string;
  voucherCode: string;
  voucherType: string;
  discountValue: number;
  minOrderValue: number;
  maxUsage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  merchantId: string;
}

export const getAllVouchers = async (): Promise<SimpleVoucher[]> => {
  const response = await apiClient.get<ApiResponse<SimpleVoucher[]>>('/vouchers');
  return response.data.data;
};

export const getVouchersByMerchant = async (merchantId: string): Promise<SimpleVoucher[]> => {
  const response = await apiClient.get<ApiResponse<SimpleVoucher[]>>(`/vouchers/merchant/${merchantId}`);
  return response.data.data;
};

export const getActiveVouchersByMerchant = async (merchantId: string): Promise<SimpleVoucher[]> => {
  const response = await apiClient.get<ApiResponse<SimpleVoucher[]>>(`/vouchers/merchant/${merchantId}/active`);
  return response.data.data;
};

export const createVoucher = async (voucherData: Partial<SimpleVoucher>): Promise<SimpleVoucher> => {
  const response = await apiClient.post<ApiResponse<SimpleVoucher>>('/vouchers', voucherData);
  return response.data.data;
};

export const updateVoucher = async (voucherId: string, voucherData: Partial<SimpleVoucher>): Promise<SimpleVoucher> => {
  const response = await apiClient.put<ApiResponse<SimpleVoucher>>(`/vouchers/${voucherId}`, voucherData);
  return response.data.data;
};

export const deleteVoucher = async (voucherId: string): Promise<void> => {
  await apiClient.delete(`/vouchers/${voucherId}`);
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const response = await apiClient.get<ApiResponse<Order[]>>(`/orders/user/${userId}`);
  return response.data.data;
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
  return response.data.data;
};

export const getAllMerchants = async (): Promise<Merchant[]> => {
  const response = await apiClient.get<ApiResponse<Merchant[]>>('/merchants');
  return response.data.data;
};

export const toggleMerchantStatus = async (merchantId: string, status: boolean): Promise<Merchant> => {
  const response = await apiClient.patch<ApiResponse<Merchant>>(`/merchants/${merchantId}/status`, { activeStatus: status });
  return response.data.data;
};

export const loginUser = async (credentials: any): Promise<any> => {
  const response = await apiClient.post<ApiResponse<any>>('/users/login', credentials);
  return response.data.data;
};

export const getUserProfile = async (userId: string): Promise<UserResponse> => {
  const response = await apiClient.get<ApiResponse<UserResponse>>(`/users/${userId}`);
  return response.data.data;
};

export const registerUser = async (userData: UserRegistration): Promise<UserResponse> => {
  const response = await apiClient.post<ApiResponse<UserResponse>>('/users/register', userData);
  return response.data.data;
};

export const placeOrder = async (orderData: any): Promise<any> => {
  const response = await apiClient.post<ApiResponse<any>>('/orders/place', orderData);
  return response.data.data;
};

export const handleApiError = (error: AxiosError): { message: string } => {
  console.error('API Error:', error);
  if (error.response && error.response.data) {
    const data = error.response.data as any;
    return { message: data.message || 'Có lỗi xảy ra từ máy chủ.' };
  }
  return { message: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.' };
};

export default apiClient;
