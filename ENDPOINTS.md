# API Endpoints Documentation

This document provides a comprehensive list of all available API endpoints for the RE-GEN application backend.

## Base URL
All endpoints are relative to `http://localhost:3000/api` (or the configured port).

---

## Authentication

### 1. Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword123"
  }
  ```
- **Success Response**:
  - **Code**: `201 Created`
  - **Content**: Supabase User Object

### 2. Login User
- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword123"
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: Supabase Session/User Object (including `access_token`)

---

## Products

### 3. Get All Products
- **URL**: `/products`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: Array of Product Objects

### 4. Get Product By ID
- **URL**: `/products/:id`
- **Method**: `GET`
- **Auth required**: No
- **URL Parameters**: 
  - `id` (UUID or string): The product identifier
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: Single Product Object

### 5. Get Products By Category
- **URL**: `/products/category/:category`
- **Method**: `GET`
- **Auth required**: No
- **URL Parameters**: 
  - `category` (string): The category identifier
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: Array of Product Objects

### 6. Add New Product
- **URL**: `/products`
- **Method**: `POST`
- **Auth required**: Yes (`Authorization: Bearer <token>`)
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `name` (string)
  - `description` (string)
  - `price` (number)
  - `categoryId` (string/UUID)
  - `stockQuantity` (number)
  - `ecoScore` (number)
  - `isSwapable` (boolean)
  - `image` (File - single file upload)
- **Success Response**:
  - **Code**: `201 Created`
  - **Content**: Created Product Object

---

## Swaps

### 7. Propose Swap
- **URL**: `/swaps`
- **Method**: `POST`
- **Auth required**: Yes (`Authorization: Bearer <token>`)
- **Request Body**:
  ```json
  {
    "proposerId": "uuid-of-proposer",
    "receiverId": "uuid-of-receiver",
    "offeredItemId": "uuid-of-offered-product",
    "requestedItemId": "uuid-of-requested-product"
  }
  ```
- **Success Response**:
  - **Code**: `201 Created`
  - **Content**: Created Swap Object (with status `pending`)

### 8. Update Swap Status
- **URL**: `/swaps/:id`
- **Method**: `PUT`
- **Auth required**: Yes (`Authorization: Bearer <token>`)
- **URL Parameters**: 
  - `id` (UUID): The swap request identifier
- **Request Body**:
  ```json
  {
    "status": "accepted"
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: `{ "success": true, "message": "Swap status updated successfully...", "swap": {...} }`

---

## Users

### 9. Get User Profile
- **URL**: `/users/profile`
- **Method**: `GET`
- **Auth required**: Yes (`Authorization: Bearer <token>`)
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: Supabase Auth User Object

### 10. Get User Eco-Stats
- **URL**: `/users/eco-stats`
- **Method**: `GET`
- **Auth required**: Yes (`Authorization: Bearer <token>`)
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**: 
    ```json
    {
      "success": true,
      "data": {
        "total_carbon_saved_kg": 12.5,
        "items_recycled": 4,
        "eco_rank": "Circular Starter",
        "total_swaps": 2,
        "comparisons": "..."
      }
    }
    ```
