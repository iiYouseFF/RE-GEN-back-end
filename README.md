# RE-GEN — Backend API

> **RE-GEN** is a sustainable hardware marketplace platform that enables users to buy, sell, and **swap** used electronic components. The backend serves as the core API engine, handling authentication, product moderation, swap lifecycle management, order processing, and admin utilities.

---

## 🔗 Live API Base URL

```
https://re-gen-backend.vercel.app
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | **Node.js ≥ 20** | JavaScript runtime |
| Framework | **Express 5** | HTTP routing & middleware |
| Database | **Supabase (PostgreSQL)** | Data persistence & Row-Level-Security |
| Auth | **Supabase Auth** | JWT-based user authentication |
| Media | **Cloudinary** | Image upload & storage |
| File Uploads | **Multer** | `multipart/form-data` processing |
| Security | **Helmet, CORS, express-rate-limit** | HTTP hardening |
| Logging | **Morgan** | Request logging (Apache-style in prod) |
| Performance | **Compression** | gzip response compression |
| Dev Tool | **Nodemon** | Auto-restart on file change |

---

## 📁 Project Structure

```
Back-end/
├── config/
│   ├── supabase.js          # Supabase client (uses SUPABASE_ROLE_KEY for admin ops)
│   └── cloudinary.js        # Cloudinary uploader configuration
├── controllers/
│   ├── authController.js    # Login / register / profile fetch
│   ├── productController.js # CRUD for hardware listings
│   ├── swapController.js    # Swap proposal & status lifecycle
│   ├── orderController.js   # Checkout & order management
│   ├── userController.js    # User profiles & eco stats
│   └── adminController.js   # Admin moderation, users, categories
├── middleware/
│   ├── authMiddleware.js    # JWT token verification
│   ├── uploadMiddleware.js  # Multer + Cloudinary stream handler
│   └── errorMiddleware.js   # notFound + global errorHandler
├── models/
│   └── schema.sql           # PostgreSQL schema (run in Supabase SQL editor)
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── swapRoutes.js
│   ├── orderRoutes.js
│   ├── userRoutes.js
│   └── adminRoutes.js
├── service/
│   └── ecoCalculator.js     # Carbon savings calculation logic
├── utils/
│   └── colorLogger.js       # ANSI color-coded console logging
├── server.js                # Application entry point
├── vercel.json              # Vercel serverless deployment config
├── ENDPOINTS.md             # Full API endpoint reference
└── .env.example             # Environment variable template
```

---

## 🗄 Database Schema

All tables are managed in **Supabase** (PostgreSQL) with Row Level Security (RLS) enabled.

### `categories`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary Key |
| `name` | TEXT | Category name |
| `slug` | TEXT | Unique, URL-friendly slug |

### `products`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary Key |
| `name` | TEXT | Product name |
| `description` | TEXT | Optional description |
| `price` | DECIMAL | Listed price |
| `image_url` | TEXT | Cloudinary URL |
| `category_id` | UUID | FK → `categories` |
| `stock_quantity` | INTEGER | Defaults to 10 |
| `eco_score` | INTEGER | 1–100 sustainability score |
| `is_swap_eligible` | BOOLEAN | If product can be offered in a swap |
| `status` | TEXT | `pending`, `approved`, `declined` |
| `user_id` | UUID | FK → `auth.users` |

### `swaps`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary Key |
| `user_id` | UUID | Proposer |
| `offered_item_id` | UUID | Product offered by proposer |
| `desired_item_id` | UUID | Product the proposer wants |
| `status` | TEXT | `pending` → `accepted` → `shipped` → `completed` / `rejected` |
| `shipping_status` | TEXT | `pending`, `shipped`, `in_transit`, `delivered` |
| `delivery_status` | TEXT | `pending`, `processing`, `completed`, `failed` |

### `orders`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary Key |
| `user_id` | UUID | FK → `auth.users` |
| `total_amount` | DECIMAL | Checkout total |
| `shipping_address` | TEXT | Delivery address |
| `status` | TEXT | `processing`, `shipped`, `completed` |

### `order_items`
Junction table binding orders to individual products with quantity and price-at-purchase snapshotting.

> **Trigger**: A PostgreSQL trigger `on_order_item_created` automatically decrements `stock_quantity` on `products` whenever an `order_item` is inserted.

---

## 🔒 Security Architecture

- **Helmet**: Sets secure HTTP response headers.
- **CORS**: Allowlisted origins via `CORS_ORIGIN` env var (defaults to `localhost:5173` and the Vercel frontend).
- **Rate Limiting**: 100 requests per IP per 15-minute window on all `/api` routes.
- **JWT Auth Middleware**: Validates Supabase-issued JWTs on all protected endpoints.
- **`SUPABASE_ROLE_KEY`**: Admin operations (swap updates, moderation) bypass RLS using the service role key — **never expose this client-side**.
- **Payload Limit**: Request bodies are capped at `10kb` to prevent large payload attacks.

---

## 🌐 API Route Summary

| Prefix | File | Description |
|---|---|---|
| `GET /`, `GET /health` | `server.js` | Health check endpoints |
| `/api/auth` | `authRoutes.js` | Login, register, session |
| `/api/products` | `productRoutes.js` | CRUD, image uploads, categories |
| `/api/swaps` | `swapRoutes.js` | Propose, accept, reject, update logistics |
| `/api/orders` | `orderRoutes.js` | Checkout, order history |
| `/api/users` | `userRoutes.js` | Profile, eco impact stats |
| `/api/admin` | `adminRoutes.js` | Moderation, user management, analytics |

> See **[ENDPOINTS.md](./ENDPOINTS.md)** for the complete request/response reference for every route.

---

## ⚙️ Environment Variables

Create a `.env` file at the project root using `.env.example` as a template:

```env
# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,https://re-gen-theta.vercel.app

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_ROLE_KEY=your_service_role_key   # NEVER expose publicly

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> ⚠️ **`SUPABASE_ROLE_KEY`** grants full database access bypassing RLS. Keep it strictly server-side.

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_ORG/re-gen-backend.git
cd re-gen-backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Fill in all values in .env
```

### 3. Set Up Database

Run `models/schema.sql` in your **Supabase SQL Editor** to create all tables, RLS policies, and triggers.

### 4. Start the Development Server

```bash
npm run dev          # nodemon auto-restart
# or
npm start            # node server.js
```

### 5. Test Endpoints

```bash
npm test             # node test_endpoints.js
```

The server runs at `http://localhost:3000`. Use the health check:
```
GET http://localhost:3000/health
```

---

## ☁️ Deployment (Vercel)

The project is configured for **Vercel Serverless** deployment via `vercel.json`:

```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

1. Push to your GitHub repository.
2. Import the project into [Vercel](https://vercel.com).
3. Set all environment variables in **Vercel Dashboard → Settings → Environment Variables**.
4. Deploy — Vercel handles the rest.

---

## 📊 Eco Score System

The `service/ecoCalculator.js` utility provides carbon savings metrics:

- Each product carries an `eco_score` (1–100).
- Scores are aggregated per user to calculate `total_carbon_saved_kg`.
- The formula accounts for product category weight and eco score multiplier.
- Accessible via `GET /api/users/:id/eco-stats`.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Commit with conventional commits: `git commit -m "feat: add xyz"`.
4. Open a Pull Request targeting `main`.
