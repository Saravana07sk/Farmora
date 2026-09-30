# AgriLink — Connecting Farms Directly to Markets 🌾

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-2d6a4f.svg)](https://react.dev/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Platform Version](https://img.shields.io/badge/Version-1.0.0--Production-green.svg)]()

AgriLink is an industry-ready, full-stack farmer-to-buyer agricultural marketplace designed to eliminate middleman overheads, establish direct farm-to-table commerce, deliver transparent pricing, and provide real-time inventory management and analytics.

---

## 🌟 Key Product Features

### 🚜 1. Verified Farmer Portal
- **Farmer Verification Workflow**: Submit land records, Kisan Credit Cards, or Govt IDs for Admin review to earn the official **Verified Farmer** badge.
- **Produce Management**: Add, update, and manage produce listings with quality grading (Grade A+, Grade A, Grade B), harvest dates, minimum order quantities (MOQ), and stock levels.
- **Order Fulfillment Pipeline**: Step-by-step status updates (`PLACED` -> `CONFIRMED` -> `PROCESSING` -> `READY_FOR_DELIVERY` -> `OUT_FOR_DELIVERY` -> `DELIVERED`).
- **Real-Time Revenue Analytics**: Interactive Recharts graphs displaying monthly revenue and produce sales breakdowns calculated directly from MongoDB aggregations.

### 🛒 2. Buyer Marketplace & Checkout
- **Advanced Search & Filtering**: Multi-criteria produce filter (Category, Price Range, Location State, Farming Method, Quality Grade, Verified Farmer filter).
- **Transparent Fee Engine**: Every checkout explicitly displays the exact pricing model:
  $$\text{Total Payable} = \text{Produce Subtotal} + \text{Platform Fee (3\%)} + \text{Delivery Fee}$$
- **Cart & Stock Validation**: Instant validation of minimum order quantities and stock availability.
- **Shipment Tracking & Reviews**: Live order status stepper and customer review submission for delivered produce.

### 🛡️ 3. Administrative Control & Moderation
- **Marketplace Analytics**: Platform Gross Merchandise Value (GMV), total platform commissions collected, active listings, and category distributions.
- **Verification Management**: One-click approval or rejection of farmer land verification documents.
- **User & Content Moderation**: Active user status toggle (Suspend / Reactivate) and produce moderation.
- **Audit Logs**: Immutable event audit trail logging user registrations, verifications, status changes, and logins.

---

## 🏗️ Monorepo Architecture

```
agri-link/
├── client/                     # Vite + React 18 Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI (PriceBreakdown, VerifiedBadge, ProductCard, Navbar, Footer)
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── layouts/            # MainLayout, DashboardLayout
│   │   ├── pages/              # Public, Farmer, Buyer, Admin portal pages
│   │   ├── services/           # Axios API instance with JWT interceptors
│   │   ├── App.jsx             # React Router v6 definition
│   │   └── main.jsx
│   └── package.json
│
├── server/                     # Node.js + Express + MongoDB Backend API
│   ├── src/
│   │   ├── config/             # DB & Cloudinary configuration
│   │   ├── controllers/        # Auth, Product, Cart, Order, Review, Farmer, Admin controllers
│   │   ├── middleware/         # Auth, Role authorization, Multer upload, Central Error Handler
│   │   ├── models/             # Mongoose Schemas (User, Product, Order, Cart, Review, Notification, AuditLog)
│   │   ├── routes/             # RESTful API routes
│   │   ├── utils/              # Pricing engine, JWT helpers, Seed script
│   │   ├── app.js              # Express app middleware setup
│   │   └── server.js           # Server launcher
│   └── package.json
│
├── README.md
├── .env.example
```

---

## 🔑 Pre-seeded Demo Accounts

Use these pre-seeded credentials for testing all 3 user roles:

| Role | Email | Password | Features Accessible |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@agrilink.demo` | `Password123!` | Marketplace GMV, Commission Metrics, Verifications, User Control |
| **Farmer** | `farmer@agrilink.demo` | `Password123!` | Produce CRUD, Sales Analytics, Inventory Control, Order Status Updates |
| **Buyer** | `buyer@agrilink.demo` | `Password123!` | Marketplace Search, Cart, Transparent Pricing Checkout, Order Tracking |

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB server running locally at `mongodb://127.0.0.1:27017/agrilink` or a valid MongoDB Atlas connection string.

### 2. Install Backend & Seed Database
```bash
cd server
npm install
npm run seed
```

### 3. Start Backend Server
```bash
npm run dev
# Server will start on http://localhost:5000
```

### 4. Install & Start Frontend Client
In a new terminal window:
```bash
cd client
npm install
npm run dev
# Client will start on http://localhost:5173
```

---

## 🌐 API Endpoint Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new Buyer or Farmer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & get JWT token |
| `GET` | `/api/products` | Public | Search, filter, sort & paginate produce |
| `POST` | `/api/products` | Farmer/Admin | Create new produce listing with image upload |
| `GET` | `/api/cart` | Buyer | Fetch cart with live transparent pricing calculations |
| `POST` | `/api/orders` | Buyer | Place new order with inventory deduction |
| `PATCH` | `/api/orders/:id/status` | Farmer/Admin | Update order fulfillment status |
| `GET` | `/api/farmer/analytics` | Farmer | Revenue trends & sales breakdown aggregations |
| `GET` | `/api/admin/analytics` | Admin | GMV, total commissions, category stats |
| `PATCH` | `/api/admin/verifications/:farmerId` | Admin | Approve or reject farmer verification request |

---

## 🛡️ Security & Performance Standards

- **Password Security**: Passwords hashed with `bcryptjs` (salt factor 10); never exposed in queries.
- **JWT Authorization**: Token payload validation with custom `authenticate` and `authorize(...roles)` middleware.
- **Security Headers & Rate Limiting**: Guarded using `helmet` and `express-rate-limit`.
- **Database Optimization**: Indexed text searches and queries on `name`, `category`, `farmer`, `buyer`, and `status`.

---

## 📄 License
This project is licensed under the ISC License.
