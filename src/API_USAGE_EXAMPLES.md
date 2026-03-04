# API Usage Examples - Food Delivery App

This documentation shows practical patterns for using the `apiClient` from the UI_Website project.

**File Location:** `UI_Website/lib/apiClient.ts`

---

## Prerequisites

```bash
# Install axios before using apiClient
cd UI_Website
npm install axios
```

---

## Example 1: User Registration with Error Handling

```typescript
import {
  registerUser,
  handleApiError,
} from '@/lib/apiClient';
import { AxiosError } from 'axios';

export async function exampleRegister() {
  try {
    const response = await registerUser({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123!',
      phoneNumber: '0912345678',
      birthDate: '1990-05-15',
    });

    console.log('Registration successful:', response);
    // Store user info
    localStorage.setItem('userId', response.userId);
    localStorage.setItem('userFullName', response.fullName);

    return response;
  } catch (error) {
    const err = error as AxiosError;
    const errorData = handleApiError(err);
    console.error('Registration failed:', errorData.message);
    throw error;
  }
}
```

---

## Example 2: User Login with Token Management

```typescript
import { loginUser, handleApiError } from '@/lib/apiClient';
import { AxiosError } from 'axios';

export async function exampleLogin(email: string, password: string) {
  try {
    const response = await loginUser({ email, password });

    // Token is automatically stored by loginUser function
    // But you can also verify it's stored:
    const token = localStorage.getItem('authToken');
    console.log('Token stored:', !!token);

    // Store additional user info
    localStorage.setItem('userId', response.userId);
    localStorage.setItem('userFullName', response.fullName);

    return response;
  } catch (error) {
    const err = error as AxiosError;
    const errorData = handleApiError(err);
    console.error('Login failed:', errorData.message);
    // Could also handle specific status codes:
    if (errorData.status === 401) {
      console.error('Invalid credentials');
    }
    throw error;
  }
}
```

---

## Example 3: Fetching Foods with Loading State

```typescript
import { getAllFoods, handleApiError } from '@/lib/apiClient';
import { useState } from 'react';
import { AxiosError } from 'axios';

export function useFoods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFoods = async () => {
    setLoading(true);
    setError('');
    try {
      const foods = await getAllFoods();
      console.log('Foods fetched:', foods);
      setFoods(foods);
      return foods;
    } catch (error) {
      const err = error as AxiosError;
      const errorData = handleApiError(err);
      console.error('Failed to fetch foods:', errorData.message);
      setError(errorData.message);
    } finally {
      setLoading(false);
    }
  };

  return { foods, loading, error, fetchFoods };
}
```

---

## Example 4: Add to Cart with Validation

```typescript
import { addToCart, handleApiError } from '@/lib/apiClient';
import { AxiosError } from 'axios';

export async function exampleAddToCart(
  userId: string,
  foodId: string,
  quantity: number
) {
  try {
    // Validate inputs
    if (!userId || !foodId || quantity <= 0) {
      throw new Error('Invalid cart item parameters');
    }

    const cartItem = await addToCart({
      userId,
      foodId,
      quantity,
      toppingIds: ['TOP001', 'TOP002'], // Optional toppings
    });

    console.log('Item added to cart:', cartItem);
    console.log('Total price:', cartItem.totalPrice);

    return cartItem;
  } catch (error) {
    const err = error as AxiosError;
    const errorData = handleApiError(err);
    console.error('Failed to add to cart:', errorData.message);
    throw error;
  }
}
```

---

## Example 5: Get and Display User Cart

```typescript
import { getCart, handleApiError } from '@/lib/apiClient';
import { AxiosError } from 'axios';

export async function exampleGetCart(userId: string) {
  try {
    const cart = await getCart(userId);

    console.log('Cart items count:', cart.cartItems.length);
    console.log('Total amount:', cart.totalAmount);

    // Display cart items
    cart.cartItems.forEach((item: any) => {
      console.log(`- ${item.food.foodName}: ${item.quantity}x`);
    });

    return cart;
  } catch (error) {
    const err = error as AxiosError;
    if (err.response?.status === 404) {
      console.log('Cart not found - might be empty');
      return null;
    }
    const errorData = handleApiError(err);
    console.error('Failed to get cart:', errorData.message);
    throw error;
  }
}
```

---

## Example 6: Place Order with Complete Flow

```typescript
import {
  getCart,
  placeOrder,
  handleApiError,
} from '@/lib/apiClient';
import { AxiosError } from 'axios';

export async function examplePlaceOrder(userId: string) {
  try {
    // First, get current cart
    const cart = await getCart(userId);

    if (!cart.cartItems.length) {
      throw new Error('Cart is empty');
    }

    // Calculate totals
    const foodAmount = cart.totalAmount;
    const shippingFee = 3.0;
    const discountAmount = 0;

    // Place order
    const order = await placeOrder({
      userId,
      merchantId: 'MERCH001', // In real app, get from cart items
      deliveryAddress: '123 Main Street, City',
      foodAmount,
      shippingFee,
      discountAmount,
    });

    console.log('Order placed successfully!');
    console.log('Order ID:', order.orderId);
    console.log('Total amount:', order.totalAmount);
    console.log('Status:', order.status);

    return order;
  } catch (error) {
    const err = error as AxiosError;
    const errorData = handleApiError(err);
    console.error('Failed to place order:', errorData.message);
    throw error;
  }
}
```

---

## Example 7: Submit Review for Completed Order

```typescript
import { submitReview, handleApiError } from '@/lib/apiClient';
import { AxiosError } from 'axios';

export async function exampleSubmitReview(
  orderId: string,
  rating: number,
  comment: string
) {
  try {
    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const review = await submitReview({
      orderId,
      rating,
      comment,
    });

    console.log('Review submitted successfully!');
    console.log('Review ID:', review.reviewId);
    console.log('Rating:', review.rating);

    return review;
  } catch (error) {
    const err = error as AxiosError;

    // Handle specific errors
    if (err.response?.status === 400) {
      console.error('Order is not completed yet');
    } else {
      const errorData = handleApiError(err);
      console.error('Failed to submit review:', errorData.message);
    }

    throw error;
  }
}
```

---

## Example 8: Complete User Journey Simulation

```typescript
import {
  registerUser,
  loginUser,
  getAllFoods,
  addToCart,
  getCart,
  placeOrder,
  submitReview,
  handleApiError,
} from '@/lib/apiClient';
import { AxiosError } from 'axios';

export async function exampleCompleteJourney() {
  try {
    // Step 1: Register
    console.log('Step 1: Registering user...');
    const registerRes = await registerUser({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123!',
      phoneNumber: '0912345678',
      birthDate: '1990-05-15',
    });
    console.log('✓ Registered:', registerRes.email);

    // Step 2: Login
    console.log('Step 2: Logging in...');
    const loginRes = await loginUser({
      email: registerRes.email,
      password: 'SecurePass123!',
    });
    console.log('✓ Logged in:', loginRes.userId);

    // Step 3: Fetch foods
    console.log('Step 3: Fetching foods...');
    const foods = await getAllFoods();
    console.log('✓ Found', foods.length, 'foods');

    if (foods.length > 0) {
      // Step 4: Add to cart
      console.log('Step 4: Adding to cart...');
      await addToCart({
        userId: loginRes.userId,
        foodId: foods[0].foodId,
        quantity: 2,
      });
      console.log('✓ Added to cart');

      // Step 5: View cart
      console.log('Step 5: Viewing cart...');
      const cart = await getCart(loginRes.userId);
      console.log('✓ Cart total:', cart.totalAmount);

      // Step 6: Place order
      console.log('Step 6: Placing order...');
      const order = await placeOrder({
        userId: loginRes.userId,
        merchantId: 'MERCH001',
        deliveryAddress: '123 Main Street',
        foodAmount: cart.totalAmount,
        shippingFee: 3.0,
        discountAmount: 0,
      });
      console.log('✓ Order placed:', order.orderId);

      // Step 7: Submit review (after order is completed)
      console.log('Step 7: Submitting review...');
      try {
        await submitReview({
          orderId: order.orderId,
          rating: 5,
          comment: 'Great service!',
        });
        console.log('✓ Review submitted');
      } catch (err) {
        console.log('(Review skipped - order not completed yet)');
      }
    }

    console.log('\n✅ Journey completed successfully!');
  } catch (error) {
    console.error('❌ Journey failed:', error);
  }
}
```

---

## Example 9: Custom Error Handling Patterns

### Pattern 1: Try-catch with specific error types

```typescript
import { loginUser } from '@/lib/apiClient';
import { AxiosError } from 'axios';

try {
  await loginUser({ email: 'test@example.com', password: 'pass' });
} catch (error) {
  const err = error as AxiosError;

  if (!err.response) {
    // Network error
    console.error('Network error - check connection');
  } else if (err.response.status === 401) {
    // Unauthorized
    console.error('Invalid credentials');
  } else if (err.response.status === 400) {
    // Bad request
    console.error('Invalid input');
  } else if (err.response.status === 500) {
    // Server error
    console.error('Server error - try again later');
  } else {
    // Other error
    console.error('Error:', err.message);
  }
}
```

### Pattern 2: Using handleApiError utility

```typescript
import { loginUser, handleApiError } from '@/lib/apiClient';
import { AxiosError } from 'axios';

try {
  await loginUser({ email: 'test@example.com', password: 'pass' });
} catch (error) {
  const errorData = handleApiError(error as AxiosError);
  console.error(`Error (${errorData.status}): ${errorData.message}`);
}
```

### Pattern 3: Custom error messages

```typescript
import { loginUser, handleApiError } from '@/lib/apiClient';
import { AxiosError } from 'axios';

const errorMessages: { [key: number]: string } = {
  400: 'Please check your input',
  401: 'Please login again',
  404: 'Resource not found',
  500: 'Server error - please try again',
};

try {
  await loginUser({ email: 'test@example.com', password: 'pass' });
} catch (error) {
  const errorData = handleApiError(error as AxiosError);
  const message =
    errorMessages[errorData.status] || 'An error occurred';
  console.error(message);
}
```

---

## Example 10: React Component Integration

```typescript
'use client';

import { useState } from 'react';
import { loginUser, getAllFoods, handleApiError } from '@/lib/apiClient';
import { AxiosError } from 'axios';

export default function MyComponent() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoadFoods = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllFoods();
      setFoods(data);
    } catch (err) {
      const errorData = handleApiError(err as AxiosError);
      setError(errorData.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleLoadFoods} disabled={loading}>
        {loading ? 'Loading...' : 'Load Foods'}
      </button>
      {error && <p className="error">{error}</p>}
      <ul>
        {foods.map((food: any) => (
          <li key={food.foodId}>
            {food.foodName} - ${food.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Best Practices

1. ✅ **Always use try-catch blocks around API calls**
2. ✅ **Store token in localStorage after login** - automatically handled by `loginUser()`
3. ✅ **Add loading states to improve UX**
4. ✅ **Show clear error messages to users**
5. ✅ **Use AxiosError type when catching API errors**
6. ✅ **Validate inputs before making API calls**
7. ✅ **Handle 401 (Unauthorized) to redirect to login** - automatically handled by interceptor
8. ✅ **Use the handleApiError utility for consistent error formatting**
9. ✅ **Clear token from localStorage on logout**
10. ✅ **Test endpoints in Postman before integrating in frontend**

---

## API Client Features

### Automatic Token Management
- Reads token from `localStorage.authToken`
- Automatically adds to all requests as `Authorization: Bearer <token>`
- Clears token and redirects to login on 401 response

### Error Handling
- `handleApiError()` function provides standardized error info
- Includes message and HTTP status code
- Handles network errors gracefully

### TypeScript Interfaces
- Full type safety for all API operations
- IntelliSense support in IDE
- Auto-completion for function parameters

### Request/Response Interceptors
- Request interceptor: Adds auth token automatically
- Response interceptor: Handles 401 errors automatically

---

## Related Files

- **API Client:** `UI_Website/lib/apiClient.ts`
- **Login Page:** `UI_Website/app/login/page.tsx`
- **Register Page:** `UI_Website/app/register/page.tsx`
- **Cart Page:** `UI_Website/app/cart/page.tsx`
- **Postman Collection:** `ShopeeFood_Postman_Collection.json`
