# Softwear — Task Tracker

> **Legend:** `[ ]` Todo &nbsp;|&nbsp; `[~]` In Progress &nbsp;|&nbsp; `[x]` Done &nbsp;|&nbsp; `[!]` Blocked

---

## Phase 1 — Backend Restructure + Core APIs

### 1.1 Project Setup & Config
- [x] Clean up existing folder structure as per PROJECT_OVERVIEW.md
- [x] Setup `server.js` with Express, CORS, cookie-parser, morgan
- [x] Setup `config/db.js` — MongoDB Atlas connection with error handling
- [x] Create `.env.example` file
- [x] Setup global error handler middleware (`middlewares/errorMiddleware.js`)
- [x] Setup `utils/apiFeatures.js` — reusable filter, sort, pagination class

### 1.2 Auth (Refactor Existing)
- [x] Refactor register/login controllers — clean response format `{ success, data, message }`
- [x] Implement access token (15min) + refresh token (7 days) in httpOnly cookie
- [x] Add `POST /api/auth/refresh-token` endpoint
- [x] Add `POST /api/auth/logout` — clear cookies
- [x] Refactor Google OAuth flow
- [x] Write `authMiddleware.js` — `verifyToken`
- [x] Write `roleMiddleware.js` — `isAdmin`

### 1.3 Product API
- [x] Create `Product` Mongoose model
- [x] `POST /api/products` — create product with image upload (Imagekit) [Admin]
- [x] `GET /api/products` — list with search, category filter, price range, sort, pagination
- [x] `GET /api/products/:id` — single product with populated reviews
- [x] `PUT /api/products/:id` — update product, handle image replace [Admin]
- [x] `DELETE /api/products/:id` — delete product + remove images from Imagekit [Admin]
- [x] Setup `uploadMiddleware.js` using multer + Imagekit storage

### 1.4 Cart API
- [x] Create `Cart` Mongoose model
- [x] `POST /api/cart/add` — add item, if exists increase quantity
- [x] `GET /api/cart` — get user's cart with populated product details
- [x] `PUT /api/cart/update` — update item quantity
- [x] `DELETE /api/cart/remove/:itemId` — remove single item
- [x] `DELETE /api/cart/clear` — clear entire cart

### 1.5 Order API
- [x] Create `Order` Mongoose model
- [x] `POST /api/orders` — create order from cart, reduce product stock
- [x] `GET /api/orders/my-orders` — paginated order history for logged-in user
- [x] `GET /api/orders/:id` — order detail
- [x] `PUT /api/orders/:id/cancel` — cancel if status is pending/processing

### 1.6 Payment (Razorpay)
- [x] `POST /api/payment/create-order` — create Razorpay order, return order_id
- [x] `POST /api/payment/verify` — verify payment signature (HMAC SHA256)
- [x] `POST /api/payment/webhook` — Razorpay webhook handler, update order status
- [x] On payment success: clear cart, send confirmation email
- [x] `POST /api/payment/refund/:orderId` — initiate refund via Razorpay API [Admin]

---

## Phase 2 — React Frontend (User Side)

### 2.1 Setup & Config
- [x] Setup Axios instance with base URL + interceptors (attach token, handle 401)
- [x] Configure Redux store with all slices
- [x] Setup React Router with protected routes
- [x] Setup ProtectedRoute component (redirect if not logged in)
- [x] Setup AdminRoute component (redirect if not admin)

### 2.2 Auth Pages (Refactor Existing UI)
- [x] Login page — connect to API, store token in Redux, handle errors
- [x] Register page — connect to API
- [x] Google Login button — working OAuth flow

### 2.3 Product Pages
- [ ] `HomePage.jsx` — featured products, categories section, hero banner
- [ ] `ProductListPage.jsx` — product grid, sidebar filters (category, price, rating), pagination
- [ ] `ProductDetailPage.jsx` — images gallery, description, add to cart, reviews section
- [ ] Product search bar — debounced input, query params

### 2.4 Cart & Checkout
- [ ] `CartPage.jsx` — cart items list, quantity controls, total, proceed to checkout
- [ ] `CheckoutPage.jsx` — address form, coupon input, order summary, Pay button
- [ ] Razorpay payment UI integration (open Razorpay modal on frontend)
- [ ] `OrderSuccessPage.jsx` — order confirmation with order ID

### 2.5 User Account
- [ ] `OrderHistoryPage.jsx` — list of orders with status badge
- [ ] Order detail modal/page
- [ ] `WishlistPage.jsx` — saved products grid

---

## Phase 3 — Admin Dashboard
**Target: Week 4-5**

### 3.1 Dashboard Home
- [ ] Stats cards — Total Revenue, Orders Today, New Users (7 days), Low Stock Alerts
- [ ] Revenue line chart — toggle: last 7 days / 30 days / 3 months (Recharts)
- [ ] Orders by status pie chart (Recharts)
- [ ] Top 5 selling products bar chart (Recharts)
- [ ] Monthly new users trend line chart (Recharts)
- [ ] Admin sidebar navigation

### 3.2 Product Management
- [ ] Products table — name, category, price, stock, status
- [ ] Add product form — name, description, price, discount price, category, stock, images upload
- [ ] Edit product modal — pre-filled form
- [ ] Delete product — with confirmation dialog
- [ ] Low stock highlight (stock < 10 shown in red)

### 3.3 Order Management
- [ ] Orders table — order ID, customer, amount, status, date
- [ ] Filter orders by status (dropdown)
- [ ] Update order status — dropdown (pending → processing → shipped → delivered)
- [ ] Initiate refund button for cancelled orders

### 3.4 User Management
- [ ] Users table — name, email, role, joined date, blocked status
- [ ] Block / Unblock user toggle
- [ ] Assign admin role

### 3.5 Coupon Management
- [ ] Coupons table — code, type, value, expiry, usage
- [ ] Create coupon form
- [ ] Delete coupon
- [ ] Active / Expired badge

### 3.6 Admin Backend APIs
- [ ] `GET /api/admin/stats` — revenue total, orders today, new users, low stock count
- [ ] `GET /api/admin/analytics/revenue` — grouped by day/week/month (MongoDB aggregation)
- [ ] `GET /api/admin/analytics/orders` — count by status
- [ ] `GET /api/admin/users` — paginated user list
- [ ] `PUT /api/admin/users/:id/block`
- [ ] `GET /api/admin/orders` — all orders with filters
- [ ] `PUT /api/admin/orders/:id/status`

---

## Phase 4 — Pro Features
**Target: Week 6**

### 4.1 Reviews & Ratings
- [ ] `Review` Mongoose model
- [ ] `POST /api/reviews/:productId` — only users who ordered the product (verifiedPurchase check)
- [ ] `GET /api/reviews/:productId` — paginated reviews with average rating
- [ ] `DELETE /api/reviews/:reviewId` — reviewer or admin only
- [ ] Update product's average rating on review create/delete (post-save hook)
- [ ] Review form UI on ProductDetailPage
- [ ] Star rating component

### 4.2 Coupon / Discount System
- [ ] `POST /api/coupons/apply` — validate code, check expiry, min order, usage limit
- [ ] Apply discount in CheckoutPage — show discount amount, new total
- [ ] Increment coupon usedCount on order success

### 4.3 Email Notifications
- [ ] Setup `utils/sendEmail.js` — Nodemailer + Gmail SMTP
- [ ] Order confirmation email — HTML template with order summary
- [ ] Order shipped email — with tracking note
- [ ] Welcome email on register

### 4.4 Wishlist
- [ ] `PUT /api/products/:id/wishlist` — toggle add/remove from user wishlist
- [ ] `GET /api/users/wishlist` — get user's wishlist
- [ ] Heart icon on ProductCard — filled/outline based on wishlist state
- [ ] WishlistPage — grid of saved products

---

## Phase 5 — Final Polish & Deployment

### 5.1 Code Quality
- [ ] Add input validation on all routes (express-validator or zod)
- [ ] Add rate limiting on auth routes (express-rate-limit)
- [ ] Add helmet.js for security headers
- [ ] Add compression middleware
- [ ] Review all error messages — user-friendly

### 5.2 UI Polish
- [ ] Loading skeletons on product list, dashboard
- [ ] Toast notifications (react-hot-toast) — success, error, info
- [ ] Empty states — no products, no orders, no results
- [ ] 404 page
- [ ] Responsive design check — mobile, tablet, desktop

### 5.3 README
- [ ] Project description and screenshots
- [ ] Features list
- [ ] Tech stack badges
- [ ] Local setup instructions
- [ ] Environment variables table
- [ ] Live demo link
- [ ] API documentation summary

### 5.4 Deployment
- [ ] Push code to GitHub (public repo, clean commit history)
- [ ] Deploy backend to Render — add all env vars
- [ ] Deploy frontend to Vercel — set VITE_API_URL
- [ ] Connect MongoDB Atlas — whitelist all IPs (0.0.0.0/0)
- [ ] Test all flows on live URL — auth, payment, admin
- [ ] Add live URL to GitHub repo and Resume

---

## Progress Summary

| Phase | Total Tasks | Done | Remaining |
|---|---|---|---|
| Phase 1 — Backend Core | 28 | 28 | 0 |
| Phase 2 — Frontend User | 18 | 0 | 18 |
| Phase 3 — Admin Dashboard | 22 | 0 | 22 |
| Phase 4 — Pro Features | 16 | 0 | 16 |
| Phase 5 — Deploy & Polish | 14 | 0 | 14 |
| **Total** | **98** | **0** | **98** |

> Update this table manually as you complete tasks.

---
