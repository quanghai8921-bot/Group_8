# Food Delivery App - API Postman Guide

## Base URL
```
http://localhost:4040/api
```

## Main Endpoints for Testing

### 1. User Registration
**Method:** POST  
**URL:** `http://localhost:4040/api/users/register`  
**Body (JSON):**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phoneNumber": "0912345678",
  "birthDate": "1990-05-15"
}
```

**Expected Response (201 Created):**
```json
{
  "userId": "CUST001",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "0912345678",
  "birthDate": "1990-05-15",
  "role": "CUSTOMER"
}
```

---

### 2. User Login
**Method:** POST  
**URL:** `http://localhost:4040/api/users/login`  
**Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Expected Response (200 OK):**
```json
{
  "userId": "CUST001",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "0912345678",
  "role": "CUSTOMER",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Get All Food Items
**Method:** GET  
**URL:** `http://localhost:4040/api/foods`  
**Headers:** None required  

**Expected Response (200 OK):**
```json
[
  {
    "foodId": "FOOD001",
    "foodName": "Burger",
    "foodCategory": {
      "categoryId": "CAT001",
      "categoryName": "Fast Food"
    },
    "merchant": {
      "merchantId": "MERCH001",
      "storeName": "burger King"
    },
    "description": "Delicious homemade burger",
    "price": 5.99,
    "rating": 4.5,
    "availableQuantity": 50
  },
  {
    "foodId": "FOOD002",
    "foodName": "Pizza",
    "foodCategory": {
      "categoryId": "CAT002",
      "categoryName": "Italian"
    },
    "merchant": {
      "merchantId": "MERCH002",
      "storeName": "Pizza Hut"
    },
    "description": "Classic Italian pizza",
    "price": 12.99,
    "rating": 4.8,
    "availableQuantity": 30
  }
]
```

---

### 4. Add to Cart
**Method:** POST  
**URL:** `http://localhost:4040/api/carts/add-item`  
**Headers:** 
```
Authorization: Bearer <token>
```

**Body (JSON):**
```json
{
  "userId": "CUST001",
  "foodId": "FOOD001",
  "quantity": 2,
  "toppingIds": ["TOP001", "TOP002"]
}
```

**Expected Response (201 Created):**
```json
{
  "cartItemId": "CI001",
  "food": {
    "foodId": "FOOD001",
    "foodName": "Burger",
    "price": 5.99
  },
  "quantity": 2,
  "toppingList": [
    {
      "toppingId": "TOP001",
      "toppingName": "Extra Cheese",
      "price": 1.00
    },
    {
      "toppingId": "TOP002",
      "toppingName": "Bacon",
      "price": 1.50
    }
  ],
  "totalPrice": 23.98
}
```

---

### 5. Get User Cart
**Method:** GET  
**URL:** `http://localhost:4040/api/carts/{userId}`  
**Headers:** 
```
Authorization: Bearer <token>
```

**Example URL:** `http://localhost:4040/api/carts/CUST001`

**Expected Response (200 OK):**
```json
{
  "cartId": "CART001",
  "user": {
    "userId": "CUST001",
    "fullName": "John Doe"
  },
  "cartItems": [
    {
      "cartItemId": "CI001",
      "food": {
        "foodId": "FOOD001",
        "foodName": "Burger",
        "price": 5.99
      },
      "quantity": 2,
      "toppingList": [
        {
          "toppingId": "TOP001",
          "toppingName": "Extra Cheese",
          "price": 1.00
        }
      ],
      "subtotal": 13.98
    }
  ],
  "totalAmount": 13.98
}
```

---

### 6. Place Order
**Method:** POST  
**URL:** `http://localhost:4040/api/orders/place-order`  
**Headers:** 
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "userId": "CUST001",
  "merchantId": "MERCH001",
  "driverId": null,
  "voucherId": null,
  "deliveryAddress": "123 Main Street, City, Country",
  "foodAmount": 13.98,
  "shippingFee": 3.00,
  "discountAmount": 0
}
```

**Expected Response (201 Created):**
```json
{
  "orderId": "ORD001",
  "user": {
    "userId": "CUST001",
    "fullName": "John Doe"
  },
  "merchant": {
    "merchantId": "MERCH001",
    "storeName": "Burger King"
  },
  "orderTime": "2024-01-15T10:30:00",
  "deliveryAddress": "123 Main Street, City, Country",
  "foodAmount": 13.98,
  "shippingFee": 3.00,
  "discountAmount": 0,
  "totalAmount": 16.98,
  "status": "Pending",
  "orderDetails": [
    {
      "detailId": "OD001",
      "food": {
        "foodId": "FOOD001",
        "foodName": "Burger",
        "price": 5.99
      },
      "quantity": 2,
      "toppingList": [
        {
          "toppingId": "TOP001",
          "toppingName": "Extra Cheese",
          "price": 1.00
        }
      ]
    }
  ]
}
```

---

### 7. Submit Review
**Method:** POST  
**URL:** `http://localhost:4040/api/reviews/submit`  
**Headers:** 
```
Authorization: Bearer <token>
```

**Body (JSON):**
```json
{
  "orderId": "ORD001",
  "rating": 5,
  "comment": "Great food and fast delivery!"
}
```

**Expected Response (201 Created):**
```json
{
  "reviewId": "REV001",
  "order": {
    "orderId": "ORD001"
  },
  "rating": 5,
  "comment": "Great food and fast delivery!",
  "reviewType": "ORDER",
  "createdAt": "2024-01-15T11:00:00"
}
```

---

## Testing Notes

1. **Register first** - Create a user account before testing other endpoints
2. **Use token from Login** - Copy the token from login response and add to Authorization header for protected endpoints
3. **Test Add to Cart** - Make sure food items exist before adding to cart
4. **Test Order** - Ensure cart has items before placing an order
5. **Test Review** - Order must be in completed status (status = 4) before submitting review

---

## Status Codes Reference
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
