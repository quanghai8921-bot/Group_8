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
    const token = localStorage.getItem('authToken');
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
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== Auth Endpoints ====================

export interface UserRegistration {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  birthDate: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  role: string;
  token?: string;
}

export const registerUser = async (data: UserRegistration): Promise<UserResponse> => {
  const response = await apiClient.post<UserResponse>('/users/register', data);
  return response.data;
};

export const loginUser = async (data: UserLogin): Promise<UserResponse> => {
  const response = await apiClient.post<UserResponse>('/users/login', data);
  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token);
  }
  return response.data;
};

// ==================== Food Endpoints ====================

export interface Topping {
  toppingId: string;
  toppingName: string;
  price: number;
}

export interface FoodCategory {
  categoryId: string;
  categoryName: string;
}

export interface Merchant {
  merchantId: string;
  storeName: string;
  storeAddress?: string;
}

export interface Food {
  foodId: string;
  foodName: string;
  description: string;
  price: number;
  rating: number;
  availableQuantity: number;
  foodCategory: FoodCategory;
  merchant: Merchant;
  toppingList?: Topping[];
}

export const getAllFoods = async (): Promise<Food[]> => {
  const response = await apiClient.get<Food[]>('/foods');
  return response.data;
};

export const getFoodsByMerchant = async (merchantId: string): Promise<Food[]> => {
  const response = await apiClient.get<Food[]>(`/foods/merchant/${merchantId}`);
  return response.data;
};

// ==================== Cart Endpoints ====================

export interface AddToCartRequest {
  userId: string;
  foodId: string;
  quantity: number;
  toppingIds?: string[];
}

export interface CartItemTopping {
  toppingId: string;
  toppingName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  food: Food;
  quantity: number;
  toppingList: CartItemTopping[];
  totalPrice: number;
}

export interface CartResponse {
  cartId: string;
  user: {
    userId: string;
    fullName: string;
  };
  cartItems: CartItem[];
  totalAmount: number;
}

export const addToCart = async (data: AddToCartRequest): Promise<CartItem> => {
  const response = await apiClient.post<CartItem>('/carts/add-item', data);
  return response.data;
};

export const getCart = async (userId: string): Promise<CartResponse> => {
  const response = await apiClient.get<CartResponse>(`/carts/${userId}`);
  return response.data;
};

export const removeFromCart = async (cartItemId: string): Promise<void> => {
  await apiClient.delete(`/carts/remove/${cartItemId}`);
};

export const clearCart = async (userId: string): Promise<void> => {
  await apiClient.delete(`/carts/${userId}`);
};

// ==================== Order Endpoints ====================

export interface PlaceOrderRequest {
  userId: string;
  merchantId: string;
  driverId?: string | null;
  voucherId?: string | null;
  deliveryAddress: string;
  foodAmount: number;
  shippingFee: number;
  discountAmount: number;
}

export interface OrderDetail {
  detailId: string;
  food: Food;
  quantity: number;
  toppingList: CartItemTopping[];
}

export interface Order {
  orderId: string;
  user: {
    userId: string;
    fullName: string;
  };
  merchant: Merchant;
  driver?: any;
  orderTime: string;
  pickupTime?: string;
  deliveryTime?: string;
  deliveryAddress: string;
  foodAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  status: number;
  orderDetails: OrderDetail[];
}

export const placeOrder = async (data: PlaceOrderRequest): Promise<Order> => {
  const response = await apiClient.post<Order>('/orders/place-order', data);
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

// ==================== Payment Endpoints ====================

export interface PaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: string;
}

export interface Payment {
  paymentId: string;
  order: Order;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: string;
}

export const processPayment = async (data: PaymentRequest): Promise<Payment> => {
  const response = await apiClient.post<Payment>('/payments/process', data);
  return response.data;
};

// ==================== Review Endpoints ====================

export interface SubmitReviewRequest {
  orderId: string;
  rating: number;
  comment: string;
}

export interface Review {
  reviewId: string;
  order: Order;
  rating: number;
  comment: string;
  reviewType: string;
  createdAt: string;
}

export const submitReview = async (data: SubmitReviewRequest): Promise<Review> => {
  const response = await apiClient.post<Review>('/reviews/submit', data);
  return response.data;
};

export const getOrderReviews = async (orderId: string): Promise<Review[]> => {
  const response = await apiClient.get<Review[]>(`/reviews/order/${orderId}`);
  return response.data;
};

// ==================== Error Handling ====================

export const handleApiError = (error: AxiosError) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: (error.response.data as any)?.message || 'An error occurred',
      status: error.response.status,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'No response from server',
      status: 0,
    };
  } else {
    // Error in request setup
    return {
      message: error.message,
      status: 0,
    };
  }
};

export default apiClient;
