# ShopeeFood Backend API Documentation

**Base URL:** `http://localhost:4040`

**Server:** Spring Boot 3.2.5  
**Database:** SQL Server 2019+  
**Authentication:** None (Sample data available for testing)

---

## Table of Contents
1. [User Management APIs](#1-user-management-apis)
2. [Food Management APIs](#2-food-management-apis)
3. [Order Management APIs](#3-order-management-apis)
4. [Sample Response Structure](#sample-response-structure)
5. [Testing Credentials](#testing-credentials)

---

## 1. User Management APIs

### 1.1 User Registration

| Property | Value |
|----------|-------|
| **Method** | POST |
| **Endpoint** | `/api/users/register` |
| **Description** | Register a new user in the system |

**Request Headers:**
```
Content-Type: application/json
```

**Request Body (JSON):**
```json
{
  "userId": "CUST002",
  "fullName": "Jane Smith",
  "birthDate": "1995-08-20",
  "phoneNumber": "0912345679",
  "email": "jane@example.com",
  "passwords": "securePassword123",
  "addressDelivery": "789 Oak Avenue, District 2"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "userId": "CUST002",
    "fullName": "Jane Smith",
    "birthDate": "1995-08-20",
    "phoneNumber": "0912345679",
    "email": "jane@example.com",
    "addressDelivery": "789 Oak Avenue, District 2",
    "shopeeCoins": 0
  }
}
```

**Validation Rules:**
- `userId`: Required, not blank
- `fullName`: Required, 2-50 characters
- `birthDate`: Required, format: yyyy-MM-dd
- `phoneNumber`: Required, exactly 10 digits
- `email`: Required, valid email format
- `passwords`: Required, 6-30 characters
- `addressDelivery`: Required, 5-100 characters

---

### 1.2 User Login

| Property | Value |
|----------|-------|
| **Method** | POST |
| **Endpoint** | `/api/users/login` |
| **Description** | Authenticate user and retrieve user info |

**Request Headers:**
```
Content-Type: application/json
```

**Request Body (JSON):**
```json
{
  "email": "john@example.com",
  "passwords": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "CUST001",
    "fullName": "John Doe",
    "birthDate": "1990-05-15",
    "phoneNumber": "0912345678",
    "email": "john@example.com",
    "addressDelivery": "123 Main Street, District 1",
    "shopeeCoins": 0
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Validation Rules:**
- `email`: Required, valid email format
- `passwords`: Required, not blank

---

### 1.3 Get User by ID

| Property | Value |
|----------|-------|
| **Method** | GET |
| **Endpoint** | `/api/users/{userId}` |
| **Description** | Retrieve user information by user ID |

**Path Parameters:**
- `userId` (String, required): User ID (e.g., `CUST001`)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "CUST001",
    "fullName": "John Doe",
    "birthDate": "1990-05-15",
    "phoneNumber": "0912345678",
    "email": "john@example.com",
    "addressDelivery": "123 Main Street, District 1",
    "shopeeCoins": 0
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 1.4 Update User

| Property | Value |
|----------|-------|
| **Method** | PUT |
| **Endpoint** | `/api/users/{userId}` |
| **Description** | Update user information |

**Path Parameters:**
- `userId` (String, required): User ID (e.g., `CUST001`)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body (JSON):**
```json
{
  "userId": "CUST001",
  "fullName": "John Smith",
  "birthDate": "1990-05-15",
  "phoneNumber": "0987654321",
  "email": "john.smith@example.com",
  "passwords": "newPassword456",
  "addressDelivery": "456 Oak Street, District 3"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "userId": "CUST001",
    "fullName": "John Smith",
    "birthDate": "1990-05-15",
    "phoneNumber": "0987654321",
    "email": "john.smith@example.com",
    "addressDelivery": "456 Oak Street, District 3",
    "shopeeCoins": 0
  }
}
```

**Validation Rules:** Same as User Registration

---

## 2. Food Management APIs

### 2.1 Get All Available Foods

| Property | Value |
|----------|-------|
| **Method** | GET |
| **Endpoint** | `/api/foods` |
| **Description** | Retrieve all available food items from all merchants |

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "foodId": "FOOD001",
      "foodName": "Margherita Pizza",
      "originalPrice": 150000,
      "salePrice": 120000,
      "foodImage": "https://example.com/margherita.jpg",
      "descriptions": "Classic tomato, mozzarella and basil pizza",
      "categoryId": "CAT001",
      "categoryName": "Pizzas"
    },
    {
      "foodId": "FOOD002",
      "foodName": "Pepperoni Pizza",
      "originalPrice": 180000,
      "salePrice": 150000,
      "foodImage": "https://example.com/pepperoni.jpg",
      "descriptions": "Delicious pepperoni with extra cheese",
      "categoryId": "CAT001",
      "categoryName": "Pizzas"
    },
    {
      "foodId": "FOOD003",
      "foodName": "Vegetarian Pizza",
      "originalPrice": 140000,
      "salePrice": 110000,
      "foodImage": "https://example.com/vegetarian.jpg",
      "descriptions": "Fresh vegetables and herbs on thin crust",
      "categoryId": "CAT001",
      "categoryName": "Pizzas"
    }
  ],
  "count": 3
}
```

---

### 2.2 Get Food by ID

| Property | Value |
|----------|-------|
| **Method** | GET |
| **Endpoint** | `/api/foods/{foodId}` |
| **Description** | Retrieve specific food item details by ID |

**Path Parameters:**
- `foodId` (String, required): Food ID (e.g., `FOOD001`)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "foodId": "FOOD001",
    "foodName": "Margherita Pizza",
    "originalPrice": 150000,
    "salePrice": 120000,
    "foodImage": "https://example.com/margherita.jpg",
    "descriptions": "Classic tomato, mozzarella and basil pizza",
    "categoryId": "CAT001",
    "categoryName": "Pizzas"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Food item not found"
}
```

---

### 2.3 Get Foods by Merchant

| Property | Value |
|----------|-------|
| **Method** | GET |
| **Endpoint** | `/api/foods/merchant/{merchantId}` |
| **Description** | Retrieve all available foods from a specific merchant |

**Path Parameters:**
- `merchantId` (String, required): Merchant ID (e.g., `PIZZA001`)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "foodId": "FOOD001",
      "foodName": "Margherita Pizza",
      "originalPrice": 150000,
      "salePrice": 120000,
      "foodImage": "https://example.com/margherita.jpg",
      "descriptions": "Classic tomato, mozzarella and basil pizza",
      "categoryId": "CAT001",
      "categoryName": "Pizzas"
    },
    {
      "foodId": "FOOD002",
      "foodName": "Pepperoni Pizza",
      "originalPrice": 180000,
      "salePrice": 150000,
      "foodImage": "https://example.com/pepperoni.jpg",
      "descriptions": "Delicious pepperoni with extra cheese",
      "categoryId": "CAT001",
      "categoryName": "Pizzas"
    }
  ],
  "count": 2
}
```

---

### 2.4 Get Foods by Category

| Property | Value |
|----------|-------|
| **Method** | GET |
| **Endpoint** | `/api/foods/category/{categoryId}` |
| **Description** | Retrieve all available foods in a specific category |

**Path Parameters:**
- `categoryId` (String, required): Category ID (e.g., `CAT001`)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "foodId": "FOOD001",
      "foodName": "Margherita Pizza",
      "originalPrice": 150000,
      "salePrice": 120000,
      "foodImage": "https://example.com/margherita.jpg",
      "descriptions": "Classic tomato, mozzarella and basil pizza",
      "categoryId": "CAT001",
      "categoryName": "Pizzas"
    },
    {
      "foodId": "FOOD003",
      "foodName": "Vegetarian Pizza",
      "originalPrice": 140000,
      "salePrice": 110000,
      "foodImage": "https://example.com/vegetarian.jpg",
      "descriptions": "Fresh vegetables and herbs on thin crust",
      "categoryId": "CAT001",
      "categoryName": "Pizzas"
    }
  ],
  "count": 2
}
```

---

## 3. Order Management APIs

### 3.1 Create Order

| Property | Value |
|----------|-------|
| **Method** | POST |
| **Endpoint** | `/api/orders` |
| **Description** | Create a new food order |

**Request Headers:**
```
Content-Type: application/json
```

**Request Body (JSON):**
```json
{
  "userId": "CUST001",
  "merchantId": "PIZZA001",
  "driverId": "DRV001",
  "voucherId": null,
  "foodAmount": 240000,
  "shippingFee": 25000,
  "discountAmount": 0,
  "deliveryAddress": "123 Main Street, District 1"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "ORD001",
    "userId": "CUST001",
    "merchantId": "PIZZA001",
    "driverId": "DRV001",
    "voucherId": null,
    "foodAmount": 240000,
    "shippingFee": 25000,
    "discountAmount": 0,
    "finalAmount": 265000,
    "deliveryAddress": "123 Main Street, District 1",
    "orderDate": "2026-01-28T20:30:45",
    "deliveryDate": null,
    "orderStatus": "Pending"
  }
}
```

**Validation Rules:**
- `userId`: Required, not blank
- `merchantId`: Required, not blank
- `driverId`: Optional
- `voucherId`: Optional
- `foodAmount`: Required, must be > 0
- `shippingFee`: Required, must be >= 0
- `discountAmount`: Optional, must be >= 0
- `deliveryAddress`: Required, 5-255 characters

**Note:** `finalAmount` is automatically calculated as: `foodAmount + shippingFee - discountAmount`

---

### 3.2 Get Order by ID

| Property | Value |
|----------|-------|
| **Method** | GET |
| **Endpoint** | `/api/orders/{orderId}` |
| **Description** | Retrieve specific order details by ID |

**Path Parameters:**
- `orderId` (String, required): Order ID (e.g., `ORD001`)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "orderId": "ORD001",
    "userId": "CUST001",
    "merchantId": "PIZZA001",
    "driverId": "DRV001",
    "voucherId": null,
    "foodAmount": 240000,
    "shippingFee": 25000,
    "discountAmount": 0,
    "finalAmount": 265000,
    "deliveryAddress": "123 Main Street, District 1",
    "orderDate": "2026-01-28T20:30:45",
    "deliveryDate": null,
    "orderStatus": "Pending"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Order not found"
}
```

---

### 3.3 Get Orders by User

| Property | Value |
|----------|-------|
| **Method** | GET |
| **Endpoint** | `/api/orders/user/{userId}` |
| **Description** | Retrieve all orders placed by a specific user |

**Path Parameters:**
- `userId` (String, required): User ID (e.g., `CUST001`)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "orderId": "ORD001",
      "userId": "CUST001",
      "merchantId": "PIZZA001",
      "driverId": "DRV001",
      "voucherId": null,
      "foodAmount": 240000,
      "shippingFee": 25000,
      "discountAmount": 0,
      "finalAmount": 265000,
      "deliveryAddress": "123 Main Street, District 1",
      "orderDate": "2026-01-28T20:30:45",
      "deliveryDate": null,
      "orderStatus": "Pending"
    },
    {
      "orderId": "ORD002",
      "userId": "CUST001",
      "merchantId": "PIZZA001",
      "driverId": "DRV002",
      "voucherId": null,
      "foodAmount": 110000,
      "shippingFee": 25000,
      "discountAmount": 10000,
      "finalAmount": 125000,
      "deliveryAddress": "123 Main Street, District 1",
      "orderDate": "2026-01-27T19:15:30",
      "deliveryDate": "2026-01-27T20:30:00",
      "orderStatus": "Delivered"
    }
  ],
  "count": 2
}
```

---

### 3.4 Get Orders by Merchant

| Property | Value |
|----------|-------|
| **Method** | GET |
| **Endpoint** | `/api/orders/merchant/{merchantId}` |
| **Description** | Retrieve all orders received by a specific merchant |

**Path Parameters:**
- `merchantId` (String, required): Merchant ID (e.g., `PIZZA001`)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "orderId": "ORD001",
      "userId": "CUST001",
      "merchantId": "PIZZA001",
      "driverId": "DRV001",
      "voucherId": null,
      "foodAmount": 240000,
      "shippingFee": 25000,
      "discountAmount": 0,
      "finalAmount": 265000,
      "deliveryAddress": "123 Main Street, District 1",
      "orderDate": "2026-01-28T20:30:45",
      "deliveryDate": null,
      "orderStatus": "Pending"
    }
  ],
  "count": 1
}
```

---

## Sample Response Structure

### Success Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* Actual data */ }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Error type"
}
```

### List Response Format
```json
{
  "success": true,
  "data": [ /* Array of items */ ],
  "count": 5
}
```

---

## Testing Credentials

### Sample Users (Auto-initialized)

| User ID | Email | Password | Role | Type |
|---------|-------|----------|------|------|
| CUST001 | john@example.com | password123 | Customer | Customer |
| MERCH001 | merchant@pizzashop.com | merchant123 | Merchant | Merchant |

### Sample Data

| Type | ID | Name | Status |
|------|----|----|--------|
| Merchant | PIZZA001 | Delicious Pizza | Active |
| Category | CAT001 | Pizzas | Active |
| Food | FOOD001 | Margherita Pizza | Available |
| Food | FOOD002 | Pepperoni Pizza | Available |
| Food | FOOD003 | Vegetarian Pizza | Available |

---

## CORS Configuration

✅ **CORS is enabled** for all origins (`@CrossOrigin(origins = "*")`)

All endpoints accept requests from:
- `http://localhost:3000`
- `http://localhost:5173`
- Frontend applications from any origin

---

## Error Handling

The API uses global exception handling with standardized error responses:

### Common Error Codes

| Error | Status Code | Message |
|-------|------------|---------|
| Resource Not Found | 404 | `{Resource} not found` |
| Invalid Login | 401 | `Invalid email or password` |
| Validation Error | 400 | Validation error message |
| Server Error | 500 | Internal server error message |

### Example Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Email should be valid"
}
```

---

## Testing with cURL

### Register New User
```bash
curl -X POST http://localhost:4040/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "CUST002",
    "fullName": "Jane Smith",
    "birthDate": "1995-08-20",
    "phoneNumber": "0912345679",
    "email": "jane@example.com",
    "passwords": "securePassword123",
    "addressDelivery": "789 Oak Avenue, District 2"
  }'
```

### Login User
```bash
curl -X POST http://localhost:4040/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "passwords": "password123"
  }'
```

### Get All Foods
```bash
curl -X GET http://localhost:4040/api/foods
```

### Create Order
```bash
curl -X POST http://localhost:4040/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "CUST001",
    "merchantId": "PIZZA001",
    "driverId": "DRV001",
    "foodAmount": 240000,
    "shippingFee": 25000,
    "discountAmount": 0,
    "deliveryAddress": "123 Main Street, District 1"
  }'
```

---

## Notes

- **Port:** Application runs on port **4040**
- **Database:** SQL Server 2019+ on `localhost:1433`
- **Authentication:** Currently no JWT/token-based auth (can be added in future versions)
- **Sample Data:** Automatically initialized on application startup
- **Validation:** All request bodies are validated before processing
- **Exception Handling:** Centralized with `@RestControllerAdvice`

---

**Last Updated:** January 28, 2026  
**Version:** 1.0  
**Framework:** Spring Boot 3.2.5 with Spring Data JPA
