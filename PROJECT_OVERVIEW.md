# Softwear — E-commerce Platform
## Project Overview for AI Agent

---

## What Are We Building?

A **production-grade, full-stack E-commerce web application** built with the MERN stack (MongoDB, Express.js, React, Node.js). This is not a tutorial project — it is designed to reflect real-world engineering standards with a scalable backend, role-based access, payment integration, and a full admin analytics dashboard.

**Project Name:** Softwear  
**Type:** Full Stack Web Application  
**Stack:** MERN (MongoDB, Express, React, Node.js)  
**Purpose:** Portfolio project to demonstrate senior-level MERN development for job applications

---

## Current State of the Project

The developer has already built the following:

**Backend (Node.js + Express):**
- User Auth — Register, Login with JWT
- Google OAuth ("Continue with Google")
- Imagekit image upload utility
- Basic Product and Cart API routes (need restructuring)

**Frontend (React + Redux Toolkit):**
- Login / Register UI
- Basic Redux store setup
- Tailwind CSS configured

**What needs to be done:**
- Complete backend restructure for scalability
- Full Product, Cart, Order, Payment APIs
- Razorpay payment integration (with webhook verification)
- Complete React frontend (all user-facing pages)
- Admin Dashboard with analytics charts
- Pro features: coupons, reviews, email notifications, refunds

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Redux Toolkit, React Query, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens), Google OAuth |
| Payments | Razorpay (payment + webhook + refunds) |
| File Storage | Imagekit |
| Email | Nodemailer + Gmail SMTP |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas (DB) |

---

## Folder Structure

```
Softwear/
├── client/                          # React Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── common/              # Navbar, Footer, Loader, ProtectedRoute
│       │   ├── product/             # ProductCard, ProductGrid, ProductFilter
│       │   ├── cart/                # CartItem, CartSummary
│       │   └── admin/               # Sidebar, StatsCard, Charts
│       ├── pages/
│       │   ├── user/
│       │   │   ├── HomePage.jsx
│       │   │   ├── ProductListPage.jsx
│       │   │   ├── ProductDetailPage.jsx
│       │   │   ├── CartPage.jsx
│       │   │   ├── CheckoutPage.jsx
│       │   │   ├── OrderSuccessPage.jsx
│       │   │   ├── OrderHistoryPage.jsx
│       │   │   └── WishlistPage.jsx
│       │   └── admin/
│       │       ├── AdminDashboard.jsx
│       │       ├── AdminProducts.jsx
│       │       ├── AdminOrders.jsx
│       │       ├── AdminUsers.jsx
│       │       ├── AdminCoupons.jsx
│       │       └── AdminAnalytics.jsx
│       ├── features/                # Redux slices
│       │   ├── authSlice.js
│       │   ├── cartSlice.js
│       │   ├── productSlice.js
│       │   └── orderSlice.js
│       ├── services/                # Axios API call functions
│       │   ├── authService.js
│       │   ├── productService.js
│       │   ├── cartService.js
│       │   ├── orderService.js
│       │   └── adminService.js
│       ├── hooks/                   # Custom React hooks
│       ├── utils/                   # formatPrice, formatDate, etc.
│       └── App.jsx
│
├── server/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   |-- config.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── reviewController.js
│   │   ├── couponController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Product.model.js
│   │   ├── Cart.model.js
│   │   ├── Order.model.js
│   │   ├── Review.model.js
│   │   └── Coupon.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   ├── payment.routes.js
│   │   ├── review.routes.js
│   │   ├── coupon.routes.js
│   │   └── admin.routes.js
│   ├── middlewares/
│   │   ├── auth.middleware.js        # verifyToken
│   │   ├── role.middleware.js        # isAdmin
│   │   ├── error.middleware.js       # global error handler
│   │   └── upload.middleware.js      # multer + imagekit
│   ├── utils/
│   │   ├── storage.js               # imagekit + multer
│   │   ├── payment.js               # razorpay + webhook
│   │   ├── email.js                 # nodemailer
│   │   ├── jwt.js                   # generateToken
│   │   └── features.js              # filter, sort, paginate helper
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
└── README.md
```

---

## Key Conventions to Follow

1. **Always use async/await** with try-catch in controllers
2. **Global error handler** middleware handles all errors — throw errors from controllers using `next(error)`
3. **Mongoose models** use timestamps: true
4. **JWT** — access token (15min), refresh token (7 days) stored in httpOnly cookie
5. **All admin routes** must use both `verifyToken` and `isAdmin` middleware
6. **Razorpay webhook** — always verify signature before updating order status
7. **Environment variables** — never hardcode secrets, always use `.env`
8. **API response format** — always return `{ success: true/false, data: {}, message: "" }`

---

## Database Models (Schema Summary)

### User
```js
{ name, email, password (hashed), googleId, role: ['user','admin'],
  isBlocked, addresses: [{ label, street, city, state, pincode }],
  wishlist: [productId], refreshToken, timestamps }
```

### Product
```js
{ name, description, price, discountPrice, images: [{ url, publicId }],
  category, brand, stock, sold, ratings: { average, count },
  isFeatured, timestamps }
```

### Cart
```js
{ userId (ref: User), items: [{ productId (ref: Product), quantity, price }],
  totalPrice, timestamps }
```

### Order
```js
{ userId (ref: User), items: [{ productId, name, price, quantity, image }],
  shippingAddress, paymentInfo: { razorpayOrderId, razorpayPaymentId, status },
  couponApplied, discount, totalAmount,
  orderStatus: ['pending','processing','shipped','delivered','cancelled'],
  timestamps }
```

### Review
```js
{ userId (ref: User), productId (ref: Product), rating (1-5),
  comment, verifiedPurchase, timestamps }
```

### Coupon
```js
{ code, discountType: ['percentage','flat'], value,
  minOrderAmount, expiryDate, usageLimit, usedCount, isActive, timestamps }
```

---

## API Endpoints Reference

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/google
POST   /api/auth/logout
POST   /api/auth/refresh-token
```

### Products
```
GET    /api/products              (with query: search, category, price, sort, page)
GET    /api/products/:id
POST   /api/products              [Admin]
PUT    /api/products/:id          [Admin]
DELETE /api/products/:id          [Admin]
```

### Cart
```
GET    /api/cart                  [Auth]
POST   /api/cart/add              [Auth]
PUT    /api/cart/update           [Auth]
DELETE /api/cart/remove/:itemId   [Auth]
DELETE /api/cart/clear            [Auth]
```

### Orders
```
POST   /api/orders                [Auth]
GET    /api/orders/my-orders      [Auth]
GET    /api/orders/:id            [Auth]
PUT    /api/orders/:id/cancel     [Auth]
```

### Payment
```
POST   /api/payment/create-order          [Auth]
POST   /api/payment/verify                [Auth]
POST   /api/payment/webhook               (Razorpay webhook — no auth)
POST   /api/payment/refund/:orderId       [Admin]
```

### Reviews
```
POST   /api/reviews/:productId    [Auth]
GET    /api/reviews/:productId
DELETE /api/reviews/:reviewId     [Auth / Admin]
```

### Coupons
```
POST   /api/coupons/apply         [Auth]
POST   /api/coupons               [Admin]
GET    /api/coupons               [Admin]
DELETE /api/coupons/:id           [Admin]
```

### Admin
```
GET    /api/admin/stats                    [Admin]
GET    /api/admin/analytics/revenue        [Admin]
GET    /api/admin/analytics/orders         [Admin]
GET    /api/admin/users                    [Admin]
PUT    /api/admin/users/:id/block          [Admin]
GET    /api/admin/orders                   [Admin]
PUT    /api/admin/orders/:id/status        [Admin]
```

---

## Environment Variables (.env)

```
PORT=5000
MONGO_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_URL_ENDPOINT=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
EMAIL_USER=
EMAIL_PASS=
CLIENT_URL=http://localhost:5173
```

---

## Deployment Plan

| Service | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Auto-deploy from GitHub main branch |
| Backend | Render (free tier) | Web service, add all env vars |
| Database | MongoDB Atlas | Free M0 cluster |
| Images | ImageKit | Free tier (25GB) |
