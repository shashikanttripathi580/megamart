# 🛒 MegaMart - Production-Ready Supermarket E-Commerce Platform

MegaMart is a modern, full-featured online supermarket platform built for high-performance grocery shopping. It is designed to start with a **₹0 development budget** using generous free tiers (MongoDB Atlas, Cloudinary, Vercel, Render) and seamlessly scale into a high-volume production enterprise.

---

## 🌟 Key Architecture Principles

1. **Guest Checkout First**: Customers can freely browse, search, add products to cart, and checkout with their delivery address without mandatory account registration (`userId = null` supported natively).
2. **Supermarket Sourcing Model**: Designed for a high-throughput single-store supermarket catalog spanning thousands of items (Atta, Rice, Dals, Cooking Oils, FMCG, Dairy, Produce, Household).
3. **Interchangeable Payment Architecture**: Payment gateways are decoupled behind an abstraction layer (supports Mock/Test, Razorpay, Cashfree, and custom gateways).
4. **Clean Decoupled Architecture**: Strict separation of concerns with TypeScript end-to-end, thin Express controllers, domain services, Mongoose connection management, and modular frontend components.
5. **Zero Asset Storage in Database**: High-resolution product images are stored on Cloudinary; MongoDB only stores optimized CDN image URLs and public IDs.

---

## 🏗️ Project Monorepo Structure

```
megamart/
├── client/                     # Frontend (React + Vite + TS + Tailwind + shadcn/ui)
│   ├── public/                 # Static public assets & favicon
│   ├── src/
│   │   ├── api/                # API client & health check callers
│   │   ├── assets/             # Images and design assets
│   │   ├── components/         # Reusable UI & layout elements
│   │   │   ├── layout/         # Header, Footer, MainLayout
│   │   │   └── ui/             # shadcn/ui primitives (Button, Badge, Card, Input)
│   │   ├── constants/          # Application constants
│   │   ├── context/            # React Context providers (Cart, Auth, etc.)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── layouts/            # Page layout wrappers
│   │   ├── lib/                # Utilities (cn, formatters)
│   │   ├── pages/              # Route pages (HomePage, etc.)
│   │   ├── services/           # Frontend client services
│   │   ├── types/              # TypeScript type definitions
│   │   ├── utils/              # Helper utilities
│   │   ├── App.tsx             # Root React component with Router & QueryClient
│   │   ├── index.css           # Design tokens, CSS variables, Tailwind base
│   │   └── main.tsx            # Application entrypoint
│   ├── .env.example            # Sample frontend environment configuration
│   ├── components.json         # shadcn/ui configuration
│   ├── package.json            # Client dependencies & scripts
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── vite.config.ts          # Vite build config with path aliases
│
├── server/                     # Backend (Node.js + Express + TS + Mongoose)
│   ├── src/
│   │   ├── config/             # Environment validation (Zod) & Mongoose DB manager
│   │   ├── controllers/        # Express request handlers (Health, etc.)
│   │   ├── middleware/         # Security, error handler, 404, request logging
│   │   ├── models/             # Mongoose schemas (User, Product, Order, etc.)
│   │   ├── routes/             # REST endpoint routers (/api/v1)
│   │   ├── services/           # Core business logic layer
│   │   ├── types/              # Server-side TypeScript types
│   │   ├── utils/              # ApiResponse, ApiError, logger
│   │   ├── validators/         # Request validation schemas (Zod)
│   │   ├── app.ts              # Express application assembly
│   │   └── server.ts           # Server bootstrap & graceful shutdown lifecycle
│   ├── .env.example            # Sample backend environment configuration
│   ├── package.json            # Server dependencies & scripts
│   └── tsconfig.json           # TypeScript configuration
│
├── .gitignore                  # Monorepo git exclusion rules
├── package.json                # Root workspaces orchestrator
└── README.md                   # Complete developer & deployment documentation
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript | Modern, ultra-fast SPA framework |
| **Styling & UI** | Tailwind CSS, shadcn/ui, Lucide Icons | Responsive supermarket design system |
| **Routing** | React Router v6 | Client-side routing |
| **Server State**| TanStack Query v5 | Data fetching, caching, live health checks |
| **Forms & Validation** | React Hook Form, Zod | Fast validation for guest checkout & search |
| **Backend** | Node.js (v20+ / v22+), Express, TypeScript | Type-safe REST API server |
| **Database** | MongoDB Atlas, Mongoose | Flexible document database for catalog & orders |
| **Security** | Helmet, CORS, Morgan | HTTP security headers, origin control, logging |
| **Images** | Cloudinary CDN (Free Tier) | Fast image delivery without DB bloat |
| **Hosting** | Vercel (Client) + Render (Server) | Free-tier deployment targets |

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20 or v22 recommended)
- **npm**: v9.0.0 or higher

### 1. Install All Dependencies

Install dependencies for the entire workspace with one command from the project root:

```bash
npm install
```

---

## 🚀 Running the Project

### Option A: Run Both Frontend & Backend Concurrently

```bash
npm run dev:all
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/v1/health

---

### Option B: Run Frontend Independently

```bash
# From the root directory:
npm run dev:client

# OR navigate to client directory:
cd client
npm run dev
```

The Vite dev server starts with hot module reloading at `http://localhost:5173`. Any API calls to `/api` are automatically proxied to the backend at `http://localhost:5000`.

---

### Option C: Run Backend Independently

```bash
# From the root directory:
npm run dev:server

# OR navigate to server directory:
cd server
npm run dev
```

The server starts with automatic file watching via `tsx watch` at `http://localhost:5000`.

---

## ⚙️ Environment Variables

### Backend Configuration (`server/.env`)

Copy `server/.env.example` to `server/.env`:

```bash
cp server/.env.example server/.env
```

| Variable | Description | Default in Dev |
| :--- | :--- | :--- |
| `PORT` | Port on which the Express server listens | `5000` |
| `NODE_ENV` | Environment mode (`development`, `production`, `test`) | `development` |
| `MONGODB_URI` | MongoDB connection string (Atlas or Local) | `mongodb://127.0.0.1:27017/megamart` |
| `CORS_ORIGIN` | Allowed client origin for CORS | `http://localhost:5173` |
| `JWT_SECRET` | Secret key for JWT signing | Minimum 32-char secret |
| `JWT_EXPIRES_IN` | Token validity period | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier | Optional initially |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Optional initially |
| `CLOUDINARY_API_SECRET` | Cloudinary secret key | Optional initially |
| `PAYMENT_PROVIDER` | Active payment provider (`mock`, `razorpay`, `cashfree`) | `mock` |

> [!NOTE]
> The backend connection manager is non-blocking on startup. If MongoDB is not yet running locally, the server starts smoothly and reports connection state in the health endpoint.

### Frontend Configuration (`client/.env`)

Copy `client/.env.example` to `client/.env`:

```bash
cp client/.env.example client/.env
```

| Variable | Description | Default in Dev |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base endpoint URL for the MegaMart API | `http://localhost:5000/api/v1` |
| `VITE_APP_NAME` | Display brand name | `MegaMart` |

---

## 🩺 Health Check API

The backend provides a comprehensive health diagnostic endpoint for uptime monitoring and client diagnostics:

**Endpoint**: `GET /api/v1/health`

### Sample Response:
```json
{
  "success": true,
  "message": "MegaMart API is running healthy",
  "data": {
    "status": "ok",
    "service": "megamart-server",
    "version": "0.1.0",
    "environment": "development",
    "uptimeSeconds": 142,
    "uptimeFormatted": "2m 22s",
    "timestamp": "2026-09-19T04:30:00.000Z",
    "database": {
      "status": "connected",
      "isConnected": true
    },
    "system": {
      "nodeVersion": "v22.21.0",
      "platform": "win32",
      "memory": {
        "rssMB": 52.4,
        "heapUsedMB": 24.8
      }
    }
  }
}
```

---

## 📱 Android Native App Support

MegaMart has full native Android application support powered by **Capacitor**:
- **Native Android Studio & Gradle project**: Located in `client/android/` with full Java 17 and Android SDK 34 compatibility.
- **Mobile Bottom Navigation Bar**: App-like bottom bar on mobile viewports for quick switching between Home, Categories, Search, and Cart (with real-time cart badge).
- **Android Hardware Back Button**: Native back gesture and hardware button support via `@capacitor/app`.
- **Status Bar Integration**: Branded emerald status bar styling (`#059669`) with dark icons via `@capacitor/status-bar`.
- **Dynamic API Endpoint Configuration**: Built-in `ServerConfigModal` allowing instant switching between local Android emulator (`http://10.0.2.2:5000/api/v1`), physical Wi-Fi testing, or deployed production backends.
- **Pre-Built Debug APK**: Available directly at `MegaMart.apk` in the workspace root.

### Android Commands:

```bash
# Sync web changes into the Android project
npm run android:sync

# Build native debug APK (app-debug.apk)
npm run android:build

# Open project in Android Studio (if installed)
npm run android:open
```

### Installing on Device / Emulator:
```bash
# Via ADB (with phone connected via USB debugging or emulator running)
adb install -r MegaMart.apk
```

---

## 📦 Building for Production

### Verify All TypeScript Types and Production Bundles:

```bash
# Build both packages
npm run build

# OR build individually
npm run build:server   # Transpiles TypeScript into server/dist
npm run build:client   # Bundles optimized static assets into client/dist
```

---

## ☁️ Zero-Budget Deployment Targets

1. **Frontend**: Deploy `client` to **Vercel** with Root Directory set to `client` and Build Command `npm run build`.
2. **Backend**: Deploy `server` to **Render** Web Service (free tier) with Root Directory `server`, Build Command `npm install && npm run build`, and Start Command `npm start`.
3. **Database**: Create a free **M0 Sandbox cluster** on **MongoDB Atlas** (512MB free storage, suitable for 50,000+ products and orders).
4. **Media CDN**: Sign up for **Cloudinary** free tier (25 GB managed bandwidth/storage).
