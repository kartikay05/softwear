# ShopFlow — Task Tracker

> **Legend:** `[ ]` Todo &nbsp;|&nbsp; `[~]` In Progress &nbsp;|&nbsp; `[x]` Done &nbsp;|&nbsp; `[!]` Blocked

---

## Phase 1 — Backend Restructure + Core APIs
**Target: Week 1-2**

### 1.1 Project Setup & Config
- [ ] Clean up existing folder structure as per PROJECT_OVERVIEW.md
- [ ] Setup `server.js` with Express, CORS, cookie-parser, morgan
- [ ] Setup `config/db.js` — MongoDB Atlas connection with error handling
- [ ] Setup `config/cloudinary.js`
- [ ] Setup `config/razorpay.js`
- [ ] Create `.env.example` file
- [ ] Setup global error handler middleware (`middlewares/errorMiddleware.js`)
- [ ] Setup `utils/apiFeatures.js` — reusable filter, sort, pagination class

### 1.2 Auth (Refactor Existing)
- [ ] Refactor register/login controllers — clean response format `{ success, data, message }`
- [ ] Implement access token (15min) + refresh token (7 days) in httpOnly cookie
- [ ] Add `POST /api/auth/refresh-token` endpoint
- [ ] Add `POST /api/auth/logout` — clear cookies
- [ ] Refactor Google OAuth flow
- [ ] Write `authMiddleware.js` — `verifyToken`
- [ ] Write `roleMiddleware.js` — `isAdmin`

### 1.3 Product API
- [ ] Create `Product` Mongoose model
- [ ] `POST /api/products` — create product with image upload (Cloudinary) [Admin]
- [ ] `GET /api/products` — list with search, category filter, price range, sort, pagination
- [ ] `GET /api/products/:id` — single product with populated reviews
- [ ] `PUT /api/products/:id` — update product, handle image replace [Admin]
- [ ] `DELETE /api/products/:id` — delete product + remove images from Cloudinary [Admin]
- [ ] Setup `uploadMiddleware.js` using multer + cloudinary storage

### 1.4 Cart API
- [ ] Create `Cart` Mongoose model
- [ ] `POST /api/cart/add` — add item, if exists increase quantity
- [ ] `GET /api/cart` — get user's cart with populated product details
- [ ] `PUT /api/cart/update` — update item quantity
- [ ] `DELETE /api/cart/remove/:itemId` — remove single item
- [ ] `DELETE /api/cart/clear` — clear entire cart

### 1.5 Order API
- [ ] Create `Order` Mongoose model
- [ ] `POST /api/orders` — create order from cart, reduce product stock
- [ ] `GET /api/orders/my-orders` — paginated order history for logged-in user
- [ ] `GET /api/orders/:id` — order detail
- [ ] `PUT /api/orders/:id/cancel` — cancel if status is pending/processing

### 1.6 Payment (Razorpay)
- [ ] `POST /api/payment/create-order` — create Razorpay order, return order_id
- [ ] `POST /api/payment/verify` — verify payment signature (HMAC SHA256)
- [ ] `POST /api/payment/webhook` — Razorpay webhook handler, update order status
- [ ] On payment success: clear cart, send confirmation email
- [ ] `POST /api/payment/refund/:orderId` — initiate refund via Razorpay API [Admin]

---

## Phase 2 — React Frontend (User Side)
**Target: Week 3**

### 2.1 Setup & Config
- [ ] Setup Axios instance with base URL + interceptors (attach token, handle 401)
- [ ] Configure Redux store with all slices
- [ ] Setup React Router with protected routes
- [ ] Setup ProtectedRoute component (redirect if not logged in)
- [ ] Setup AdminRoute component (redirect if not admin)

### 2.2 Auth Pages (Refactor Existing UI)
- [ ] Login page — connect to API, store token in Redux, handle errors
- [ ] Register page — connect to API
- [ ] Google Login button — working OAuth flow

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
**Target: Week 7**

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
| Phase 1 — Backend Core | 28 | 0 | 28 |
| Phase 2 — Frontend User | 18 | 0 | 18 |
| Phase 3 — Admin Dashboard | 22 | 0 | 22 |
| Phase 4 — Pro Features | 16 | 0 | 16 |
| Phase 5 — Deploy & Polish | 14 | 0 | 14 |
| **Total** | **98** | **0** | **98** |

> Update this table manually as you complete tasks.

---

## Daily Work Log (Optional — fill as you go)

| Date | Tasks Completed | Notes |
|---|---|---|
| | | |
