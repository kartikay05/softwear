# Software Requirements Specification (SRS)
# ShopFlow — E-Commerce Platform

**Version:** 1.0  
**Author:** [Your Name]  
**Date:** 2025  
**Status:** In Development

---

## Table of Contents

1. Introduction
2. Overall Description
3. System Architecture
4. Functional Requirements
5. Non-Functional Requirements
6. Database Design
7. API Design
8. Security Requirements
9. Deployment Architecture

---

## 1. Introduction

### 1.1 Purpose

This document describes the software requirements for **ShopFlow**, a production-grade full-stack e-commerce web application. It serves as a reference for development decisions, feature scope, and system design.

### 1.2 Project Scope

ShopFlow is a complete online shopping platform with two primary interfaces:

- **Customer Interface** — Browse products, manage cart, checkout with online payment, track orders
- **Admin Interface** — Manage products and inventory, process orders, analyze business metrics via charts

### 1.3 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 + Redux Toolkit | UI and state management |
| Styling | Tailwind CSS | Responsive design |
| Charts | Recharts | Admin analytics visualizations |
| Backend | Node.js + Express.js | REST API server |
| Database | MongoDB + Mongoose | Data persistence |
| Authentication | JWT (access + refresh) | Stateless auth |
| OAuth | Google OAuth 2.0 | Social login |
| Payments | Razorpay | Payment gateway |
| File Storage | Cloudinary | Product image storage |
| Email | Nodemailer (Gmail SMTP) | Transactional emails |
| Deployment | Vercel + Render + MongoDB Atlas | Cloud deployment |

---

## 2. Overall Description

### 2.1 Product Perspective

ShopFlow is a standalone web application accessible via any modern browser. It follows a client-server architecture where the React frontend communicates with the Express.js backend through a RESTful API. MongoDB Atlas is used as a cloud-hosted database.

### 2.2 User Roles

| Role | Description | Access Level |
|---|---|---|
| Guest | Unauthenticated visitor | Browse products only |
| Customer | Registered and logged-in user | Shopping, orders, reviews, wishlist |
| Admin | Privileged user with role = "admin" | Full CRUD on products, orders, users, analytics |

### 2.3 Assumptions

- Users have access to a modern browser (Chrome, Firefox, Safari, Edge)
- Admin accounts are created manually (no public admin registration)
- Razorpay is used in test mode during development; production keys for live deployment
- Email delivery uses Gmail SMTP via an App Password

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────┐
│              CLIENT (Vercel)                │
│         React + Redux + Tailwind            │
└──────────────────┬──────────────────────────┘
                   │ HTTPS REST API
┌──────────────────▼──────────────────────────┐
│              SERVER (Render)                │
│         Node.js + Express.js                │
│  ┌─────────────────────────────────────┐    │
│  │  Auth │ Products │ Orders │ Admin   │    │
│  └─────────────────────────────────────┘    │
└───────┬──────────┬──────────────┬───────────┘
        │          │              │
   ┌────▼───┐  ┌───▼───────┐ ┌───▼──────────┐
   │MongoDB │  │Cloudinary │ │  Razorpay    │
   │ Atlas  │  │(Images)   │ │  (Payments)  │
   └────────┘  └───────────┘ └──────────────┘
```

### 3.2 Authentication Flow

```
User Login → Server validates credentials
          → Issues Access Token (15 min, in memory)
          → Issues Refresh Token (7 days, httpOnly cookie)
          → Client stores Access Token in Redux state
          → On expiry, client calls /refresh-token silently
          → Server validates Refresh Token → issues new Access Token
```

### 3.3 Payment Flow

```
User clicks Pay
  → Frontend calls POST /api/payment/create-order
  → Backend creates Razorpay order → returns order_id
  → Frontend opens Razorpay modal with order_id
  → User completes payment on Razorpay UI
  → Razorpay returns payment_id + signature to frontend
  → Frontend calls POST /api/payment/verify with payment details
  → Backend verifies HMAC SHA256 signature
  → On success: Order status = paid, Cart cleared, Email sent
  → Razorpay also fires webhook → Backend handles as fallback verification
```

---

## 4. Functional Requirements

### 4.1 Authentication Module

| ID | Requirement |
|---|---|
| AUTH-01 | Users can register with name, email, and password |
| AUTH-02 | Passwords are hashed using bcrypt before storage |
| AUTH-03 | Users can login with email and password |
| AUTH-04 | Users can login via Google OAuth 2.0 ("Continue with Google") |
| AUTH-05 | JWT access token issued on login (15 minute expiry) |
| AUTH-06 | JWT refresh token issued on login (7 day expiry, httpOnly cookie) |
| AUTH-07 | Access token is silently refreshed before expiry |
| AUTH-08 | Users can logout — refresh token is cleared from DB and cookie |
| AUTH-09 | Role-based access: "user" and "admin" roles |
| AUTH-10 | Blocked users receive 403 error on login attempt |

### 4.2 Product Module

| ID | Requirement |
|---|---|
| PRD-01 | Products have: name, description, price, discount price, images, category, brand, stock count |
| PRD-02 | Admin can create products with multiple image uploads (stored on Cloudinary) |
| PRD-03 | Admin can update product details and replace images |
| PRD-04 | Admin can delete a product (images removed from Cloudinary) |
| PRD-05 | Customers can browse all products with pagination (12 per page) |
| PRD-06 | Products can be filtered by category, price range, and minimum rating |
| PRD-07 | Products can be sorted by price (low/high), newest, and most popular |
| PRD-08 | Product search by name using text index (case-insensitive) |
| PRD-09 | Product detail page shows all images, description, stock status, and reviews |
| PRD-10 | Stock count decrements automatically on successful order |

### 4.3 Cart Module

| ID | Requirement |
|---|---|
| CART-01 | Logged-in users have a persistent cart stored in the database |
| CART-02 | Users can add a product to cart; if already present, quantity increases |
| CART-03 | Users can update item quantity in cart |
| CART-04 | Users can remove individual items from cart |
| CART-05 | Users can clear the entire cart |
| CART-06 | Cart total is recalculated on every update |
| CART-07 | Out-of-stock products cannot be added to cart |

### 4.4 Order Module

| ID | Requirement |
|---|---|
| ORD-01 | Orders are created from the user's current cart after payment verification |
| ORD-02 | Each order stores: items snapshot, shipping address, payment info, and status |
| ORD-03 | Order statuses: pending → processing → shipped → delivered → cancelled |
| ORD-04 | Users can view their complete order history with pagination |
| ORD-05 | Users can view individual order details |
| ORD-06 | Users can cancel orders with status "pending" or "processing" |
| ORD-07 | Cart is cleared automatically after successful order creation |

### 4.5 Payment Module

| ID | Requirement |
|---|---|
| PAY-01 | Razorpay payment gateway is used for all transactions |
| PAY-02 | Backend creates a Razorpay order and returns order_id to frontend |
| PAY-03 | Frontend opens Razorpay checkout modal using the order_id |
| PAY-04 | Backend verifies payment using HMAC SHA256 signature verification |
| PAY-05 | Razorpay webhook is implemented as a fallback payment verification |
| PAY-06 | Order confirmation email is sent to the user after successful payment |
| PAY-07 | Admin can initiate refunds for cancelled orders via Razorpay Refund API |

### 4.6 Review Module

| ID | Requirement |
|---|---|
| REV-01 | Only users with a delivered order containing the product can submit a review |
| REV-02 | Reviews have: rating (1-5 stars), comment text, verified purchase badge |
| REV-03 | Each user can submit only one review per product |
| REV-04 | Product's average rating and review count update on every review change |
| REV-05 | Users can delete their own reviews; admins can delete any review |
| REV-06 | Reviews are paginated on the product detail page |

### 4.7 Coupon Module

| ID | Requirement |
|---|---|
| CPN-01 | Admin can create coupons with: code, discount type (percentage/flat), value, min order amount, expiry date, usage limit |
| CPN-02 | Users can apply a coupon code during checkout |
| CPN-03 | System validates: code exists, not expired, min order met, usage limit not exceeded |
| CPN-04 | Coupon usage count increments on successful order |
| CPN-05 | Admin can view all coupons and delete them |

### 4.8 Admin Dashboard Module

| ID | Requirement |
|---|---|
| ADM-01 | Admin dashboard shows stats: total revenue, orders today, new users (7 days), low stock products |
| ADM-02 | Revenue analytics chart — daily/weekly/monthly toggle (line chart) |
| ADM-03 | Orders by status chart (pie chart) |
| ADM-04 | Top 5 selling products chart (bar chart) |
| ADM-05 | Admin can view, filter, and update status of all orders |
| ADM-06 | Admin can block or unblock any user account |
| ADM-07 | Admin can manage all products (create, edit, delete) |
| ADM-08 | Admin can manage coupons (create, delete) |
| ADM-09 | Low stock products (stock < 10) are highlighted in the products table |

### 4.9 Wishlist Module

| ID | Requirement |
|---|---|
| WSH-01 | Logged-in users can add or remove products from their wishlist |
| WSH-02 | Wishlist is stored in the User document |
| WSH-03 | Users can view all wishlist items on the Wishlist page |
| WSH-04 | Heart icon on product cards reflects current wishlist state |

---

## 5. Non-Functional Requirements

### 5.1 Performance

- API responses should return within 500ms under normal load
- Product list page should load within 2 seconds (with pagination)
- Images served via Cloudinary CDN for fast global delivery

### 5.2 Security

- All passwords hashed with bcrypt (salt rounds: 12)
- JWT tokens have short expiry; refresh tokens stored as httpOnly cookies
- Admin routes protected by role-based middleware on every request
- Razorpay payment signature verified server-side on every transaction
- Input validation on all API endpoints
- Rate limiting on auth endpoints (max 10 requests / 15 min)
- HTTP security headers via helmet.js
- CORS restricted to frontend domain only

### 5.3 Scalability

- Codebase follows MVC pattern — controllers, models, routes are separate
- Reusable `ApiFeatures` utility for filtering, sorting, and pagination
- Mongoose models with indexed fields (email, product name, category)
- MongoDB Atlas supports horizontal scaling if needed

### 5.4 Code Quality

- Consistent async/await with try-catch throughout
- Global error handler middleware catches all unhandled errors
- Standardized API response format: `{ success, data, message }`
- Environment variables for all secrets (no hardcoded credentials)

### 5.5 Usability

- Fully responsive UI — works on mobile, tablet, and desktop
- Loading skeletons shown during data fetch
- Toast notifications for user feedback (success, error, info)
- Meaningful error messages returned from API

---

## 6. Database Design

### Entity Relationship Summary

```
User ──< Order >── Product
User ──< Review >── Product
User ── Cart >── Product
User ──< Wishlist >── Product
Order ──< Coupon
```

### Indexes

| Model | Indexed Field | Reason |
|---|---|---|
| User | email (unique) | Fast login lookup |
| Product | name (text index) | Full-text search |
| Product | category | Filter queries |
| Order | userId | User order history |
| Review | productId + userId (compound, unique) | One review per product per user |

---

## 7. API Design

### Response Format (All Endpoints)

**Success:**
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### HTTP Status Codes Used

| Code | Meaning |
|---|---|
| 200 | OK — successful GET, PUT |
| 201 | Created — successful POST |
| 400 | Bad Request — validation error |
| 401 | Unauthorized — not logged in |
| 403 | Forbidden — not admin / account blocked |
| 404 | Not Found — resource does not exist |
| 409 | Conflict — duplicate (e.g. email already exists) |
| 500 | Internal Server Error |

---

## 8. Security Requirements

| Requirement | Implementation |
|---|---|
| Password storage | bcrypt with 12 salt rounds |
| Auth tokens | JWT access (15m) + refresh (7d) in httpOnly cookie |
| Payment verification | HMAC SHA256 signature check (Razorpay standard) |
| Route protection | verifyToken + isAdmin middleware |
| Input validation | express-validator on all routes |
| Rate limiting | express-rate-limit on /api/auth/* |
| Security headers | helmet.js |
| CORS | Restricted to VITE_CLIENT_URL env variable |
| Secret management | dotenv, all keys in .env (gitignored) |

---

## 9. Deployment Architecture

### Infrastructure

| Component | Platform | Config |
|---|---|---|
| Frontend | Vercel | Auto-deploy from GitHub `main` branch |
| Backend API | Render (Web Service) | Node 18, add all .env vars in dashboard |
| Database | MongoDB Atlas | M0 free cluster, IP whitelist: 0.0.0.0/0 |
| Image Storage | Cloudinary | Free tier (25 GB storage, 25 GB bandwidth/month) |
| Email | Gmail SMTP | App Password via Google Account settings |
| Payments | Razorpay | Test keys for dev, live keys for production |

### Environment Variables Required on Render

```
PORT, MONGO_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET,
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET,
EMAIL_USER, EMAIL_PASS, CLIENT_URL
```

### CI/CD

- GitHub repository with `main` branch (production) and `dev` branch (development)
- Vercel auto-deploys on push to `main`
- Render auto-deploys on push to `main`
- `.env` is gitignored; `.env.example` is committed for reference

---

*ShopFlow SRS — Version 1.0*
