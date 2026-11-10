# ShopNova — Online Shopping Web Application
> **Complete Full-Stack MERN E-Commerce Platform**  
> Built strictly adhering to the *Online Shopping Web Application: Complete Project Research & Development Guide*.

---

## 🌟 Executive Overview

ShopNova is a production-grade, full-stack e-commerce web application designed to deliver an end-to-end shopping and store administration experience. It features customer catalog browsing, responsive filtering, persistent cart & wishlist, secure checkout with Razorpay test mode & COD, live order tracking with status timelines, customer reviews with verified-purchase badges, coupon discount campaigns, and a comprehensive admin management portal with sales charts.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | React 18 with Vite | Modern single-page app architecture, high-speed HMR |
| **Styling** | Tailwind CSS | Responsive utility-first design system with custom colors |
| **Icons** | Lucide React | Clean, scalable visual iconography |
| **Charts** | Recharts | Sales revenue trends, category inventory distributions |
| **Notifications** | React Hot Toast | Real-time toast feedback for cart, wishlist & auth events |
| **Backend Runtime** | Node.js (v24+) & Express.js | Robust REST API server with modular routing and controllers |
| **Database & ODM** | MongoDB with Mongoose | Flexible document model with dual-mode resilient local fallback |
| **Authentication** | JWT & Bcrypt.js | Secure password hashing & role-based authorization |
| **Payments** | Razorpay SDK & Simulator | India-focused test gateway integration + COD |

---

## 📂 Project Directory Structure

```
online-shopping-app/
├── package.json               # Root convenience scripts
├── README.md                  # Project blueprint & operational documentation
├── backend/                   # Express REST API Server
│   ├── config/
│   │   └── db.js              # Database connection & dual-mode fallback
│   ├── controllers/           # Modular request controllers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── couponController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── productController.js
│   │   └── reviewController.js
│   ├── data/                  # Persistent store files (JSON database)
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT Bearer verification & role check
│   │   └── errorMiddleware.js # 404 & JSON error handler
│   ├── models/                # Mongoose database schemas
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   ├── Coupon.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/                # Express API endpoint routes
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── seedData.js        # Rich demo dataset seeder
│   ├── server.js              # Express app bootstrap & listener
│   └── .env                   # Environment secrets & ports
└── frontend/                  # React + Vite Frontend
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── admin/         # AdminSidebar, StatCard
    │   │   ├── cart/          # CartItem, PriceSummary
    │   │   ├── common/        # Navbar, Footer
    │   │   ├── order/         # OrderStatusTimeline
    │   │   └── product/       # ProductCard, ProductFilters
    │   ├── context/           # AuthContext, CartContext, WishlistContext
    │   ├── layouts/           # MainLayout, AdminLayout
    │   ├── pages/
    │   │   ├── admin/         # AdminDashboard, Products, Orders, Categories, Coupons
    │   │   ├── HomePage.jsx
    │   │   ├── ProductsPage.jsx
    │   │   ├── ProductDetailPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── WishlistPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── MyOrdersPage.jsx
    │   │   ├── OrderDetailPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── services/
    │   │   └── api.js         # Axios client with JWT interceptor
    │   ├── App.jsx            # Router and Provider wrapping
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🔑 Pre-seeded Demo Credentials

The application is pre-seeded with realistic products, categories, coupons, and accounts:

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Administrator** | `admin@shopnova.com` | `admin123` | Full Admin Dashboard, Catalog CRUD, Order Management, Category & Coupon Tools |
| **Customer** | `customer@shopnova.com` | `customer123` | Shopping, Wishlist, Cart, Checkout, Order Tracking, Customer Reviews |

> **Tip:** The Login screen includes one-click buttons to instantly autofill both accounts!

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher, tested on v24)
- **npm** (v9 or higher)

### 2. Start the Backend API Server
```powershell
cd C:\Users\priya\.gemini\antigravity\scratch\online-shopping-app\backend
npm start
```
*The server will boot on `http://localhost:5001`. If MongoDB is not running locally, it seamlessly uses the built-in local store so everything works immediately without failure.*

### 3. Start the Frontend React Client
```powershell
cd C:\Users\priya\.gemini\antigravity\scratch\online-shopping-app\frontend
npm run dev
```
*Open your browser to `http://localhost:5173`.*

---

## 🛒 Core Functional Modules Implemented

### Module A — Authentication & Authorization
- Customer registration and login with bcrypt password hashing (10 salt rounds).
- JWT (JSON Web Token) generation with 7-day expiration.
- Role-based authorization (`customer` vs `admin`) with middleware guards.
- IDOR protections: users can only view and modify their own orders and profile.

### Module B — Homepage
- Navigation bar with category quick links, real-time cart badge, and wishlist count.
- Hero banner with CTA linking directly to promotional products.
- Visual category grid (Audio, Electronics, Computers, Wearables, Lifestyle).
- Trending & Featured products showcase.
- Comprehensive footer adhering to Consumer Protection & DPDP regulations.

### Module C — Product Catalogue & Management
- Multi-dimensional search by name, brand, description, and category.
- Dynamic filtering by Price Range, Minimum Customer Rating, and Stock Availability.
- Sorting by: Newest Arrivals, Price (Low to High), Price (High to Low), and Rating.
- Product Details page with multi-image gallery, price discounts, stock badges, specifications table, and customer reviews.
- Admin Catalog Manager with full CRUD, stock alerts, and feature toggles.

### Module D — Shopping Cart & Wishlist
- Server-side stock verification (prevents purchasing more than available stock).
- Dual persistence: local storage for guests, automatically synced to database upon login.
- Subtotal, 10% GST tax calculation, and free shipping progress meter.
- Wishlist with one-click "Move to Cart" actions.

### Module E — Checkout & Payments
- Multi-field shipping address form with default address pre-population.
- Server-calculated totals (client-side totals are never trusted).
- Payment options: **Razorpay Test Mode**, **Card**, **UPI**, and **Cash on Delivery (COD)**.
- Concurrency-safe atomic inventory reduction upon checkout.

### Module F — Order Management & Tracking
- Complete order lifecycle:  
  `Order Placed` ➔ `Processing` ➔ `Shipped` ➔ `Out for Delivery` ➔ `Delivered` (or `Cancelled`).
- Step-by-step visual `OrderStatusTimeline` on the order tracking screen.
- Self-service order cancellation for customers before shipping, with automatic inventory restoration.
- Admin status transition dropdown to update order fulfillment states.

### Module G — Admin Dashboard & Analytics
- Key metrics cards: Gross Revenue, Total Orders, Active Products, and Registered Customers.
- Recharts visualizations: Interactive AreaChart for monthly revenue trends and BarChart for category inventory distribution.
- Low-stock alert table highlighting items with $\le 5$ units in stock.
- Recent transactions list with direct links to full order details.

### Module H — Reviews, Ratings & Coupons
- Star ratings (1 to 5) and feedback comments on products.
- **Verified Purchase Badge**: automatically displayed if the reviewer previously purchased the item.
- Promotional coupon engine: code validation, percentage discounts, minimum order caps (e.g. `WELCOME10`, `FESTIVE20`).

---

## 📡 REST API Plan Summary

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new customer account | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT | Public |
| `GET` | `/api/auth/profile` | Get current user's profile | Private |
| `PUT` | `/api/auth/profile` | Update profile / saved addresses | Private |
| `POST` | `/api/auth/wishlist/toggle` | Toggle product in wishlist | Private |
| `GET` | `/api/products` | Query products with filters & sort | Public |
| `GET` | `/api/products/:id` | Fetch product details & reviews | Public |
| `POST` | `/api/products` | Create product listing | Admin |
| `PUT` | `/api/products/:id` | Update product details or stock | Admin |
| `DELETE` | `/api/products/:id` | Delete/archive product | Admin |
| `GET` | `/api/cart` | Get current user's cart & totals | Private |
| `POST` | `/api/cart/items` | Add product to cart with quantity | Private |
| `PATCH` | `/api/cart/items/:productId` | Change item quantity | Private |
| `DELETE` | `/api/cart/items/:productId` | Remove item from cart | Private |
| `POST` | `/api/orders` | Checkout & place order | Private |
| `GET` | `/api/orders/my-orders` | Fetch customer's order history | Private |
| `GET` | `/api/orders/:id` | Get order details & tracking info | Private (Owner/Admin) |
| `PATCH` | `/api/orders/:id/status` | Update order delivery lifecycle | Admin |
| `PATCH` | `/api/orders/:id/cancel` | Cancel order & restore inventory | Private (Owner) |
| `POST` | `/api/payments/create` | Initialize Razorpay payment order | Private |
| `POST` | `/api/payments/verify` | Verify payment HMAC signature | Private |
| `POST` | `/api/reviews` | Submit product review & rating | Private |
| `GET` | `/api/admin/dashboard` | Dashboard metrics & chart data | Admin |
| `POST` | `/api/coupons/apply` | Validate & apply coupon discount | Public |

---

## ⚖️ Indian Legal & Privacy Considerations

As outlined in Section 9 of the Project Guide:
1. **Digital Personal Data Protection Act (DPDP), 2023**: Clear notice of data collection is provided at registration; user personal details and addresses can be updated or deleted directly via account settings.
2. **Consumer Protection (E-Commerce) Rules, 2020**: Transparent pricing, explicit delivery fees, refund/return terms (7-day hassle-free window), customer grievance channels, and verified-purchase indicators are built into the storefront and footer.
3. **Payment Security**: Card details and CVVs are never handled or stored directly by the server, relying exclusively on trusted gateway workflows (Razorpay / UPI).

