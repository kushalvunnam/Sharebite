# ShareBite — Share more. Waste less. 🍲🌱

A full-stack food surplus donation and redistribution platform connecting commercial kitchens, restaurants, bakeries, caterers, and grocery stores with NGOs, food pantries, and emergency shelters in real-time.

![ShareBite](https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Architecture Overview

```
ShareBite/
├── backend/                     # Node.js + Express + MongoDB Atlas backend
│   ├── config/                  # Mongoose database connection & status
│   ├── controllers/             # Auth, Listings, Requests, Reports controllers
│   ├── middleware/              # JWT auth, role RBAC, input validation, error handling
│   ├── models/                  # Mongoose schemas (User, FoodListing, DonationRequest, Report)
│   ├── routes/                  # Express REST route definitions
│   ├── scripts/                 # Repeatable seed script (10+ listings, 3+ NGOs)
│   ├── tests/                   # Automated Node test runner suite (24 tests)
│   ├── .env.example             # Environment configuration template
│   ├── package.json             # Backend package configuration
│   └── server.js                # Express app entry & health monitoring
├── src/                         # React 19 + Vite 8 frontend
│   ├── components/              # 3D food bowl hero, tilt cards, community network map
│   ├── context/                 # AppContext (central state with live API & offline fallback)
│   ├── pages/                   # Landing, Explore, Donor Hub, Recipient Hub, Admin Board
│   └── services/api.js          # Centralized API client (VITE_API_BASE_URL)
└── package.json                 # Unified monorepo scripts
```

---

## 🚀 Running the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend Environment
Copy the backend `.env.example` to `.env`:
```bash
cp backend/.env.example backend/.env
```
Fill in your environment variables:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sharebite?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
*(Never commit `.env` files. Both root and nested `.env` files are strictly excluded by `.gitignore`.)*

### 3. Start the Backend API Server
```bash
npm run server
```
Server starts on [http://localhost:5000](http://localhost:5000).  
Check health status at [http://localhost:5000/api/health](http://localhost:5000/api/health).

For live development with auto-reloading:
```bash
npm run server:dev
```

### 4. Start the Frontend Client
In a separate terminal:
```bash
npm run dev
```
Client runs at [http://localhost:5173](http://localhost:5173).

### 5. Seed Initial Data (Repeatable)
Seeds the database with 8 user accounts (Admin, Donors, Recipients), 10+ compliant food listings, and sample donation requests:
```bash
npm run seed
```
To explicitly reset and re-seed:
```bash
npm run seed:force
```

### 6. Run Backend Automated Test Suite
Executes 24 automated tests across authentication security, role permissions, listing validation, atomic portion reservations, and OTP handoff completion:
```bash
npm run test:backend
```

---

## 📡 REST API Reference

### Health
- `GET /api/health` — Service uptime, version, and MongoDB connection status.

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register donor or recipient account. Validates email normalization, password hash, and **strictly blocks public admin role assignment**.
- `POST /api/auth/login` — Sign in with bcrypt verification, returns signed JWT.
- `GET /api/auth/me` — Retrieve authenticated user profile (Bearer token).

### Food Listings (`/api/listings`)
- `GET /api/listings` — Filter surplus listings by `search`, `category`, `status`, or `donorId`.
- `GET /api/listings/:id` — Retrieve detailed listing with donor contact and handling instructions.
- `POST /api/listings` — Authenticated donor creates surplus listing with verified pickup windows.
- `PATCH /api/listings/:id` — Update listing details (ownership guard enforced).
- `DELETE /api/listings/:id` — Remove listing (blocked if active accepted pickups exist).

### Donation Requests (`/api/requests`)
- `POST /api/requests` — Recipient reserves surplus portions with atomic database reservation limits. Generates 6-digit OTP and pickup pass.
- `GET /api/requests/my` — Retrieve authenticated user's requests.
- `PATCH /api/requests/:id/accept` — Donor accepts pending reservation.
- `PATCH /api/requests/:id/reject` — Donor rejects request and **atomically releases reserved portions**.
- `PATCH /api/requests/:id/cancel` — Recipient/donor cancels and **releases portions back to inventory**.
- `PATCH /api/requests/:id/pickup` — Mark volunteer arrival / pickup in progress.
- `PATCH /api/requests/:id/complete` — Donor verifies volunteer's 6-digit OTP code and completes handoff.

### Safety Reports (`/api/reports`)
- `POST /api/reports` — Submit food safety or accuracy report on a listing.
- `GET /api/reports` — Admin oversight queue.
- `PATCH /api/reports/:id` — Admin resolution action.

---

## 👥 Seeded Demo Credentials

| Role | Email | Password | Organization |
|---|---|---|---|
| **Admin** | `admin@sharebite.org` | `AdminPassword123!` | ShareBite Platform Safety Board |
| **Donor** | `marco@verdeosteria.com` | `DonorPassword123!` | Verde Artisan Osteria |
| **Donor** | `claire@goldenharvest.com` | `DonorPassword123!` | Golden Harvest Boulangerie |
| **Recipient** | `sarah@eastsidehope.org` | `RecipientPassword123!` | Eastside Hope Food Rescue & Shelter |
| **Recipient** | `thomas@breadbasket.org` | `RecipientPassword123!` | Community Breadbasket Hub |

---

## 🛡️ Security & Reliability Features
- **Strict Role Boundaries**: Public registration cannot assign the Admin role.
- **Password Protection**: Passwords hashed using `bcrypt` (cost factor 10) and omitted from standard queries (`select: false`).
- **Token Integrity**: Standard Bearer JWT verification with expiration handling.
- **Atomic Operations**: Over-reservation is prevented using atomic conditional updates (`$expr` and `$inc`).
- **Resilient Fallback**: If the MongoDB database or backend is temporarily offline, the frontend seamlessly displays a clear **"Demo Mode (Offline)"** badge while preserving full 3D interactive functionality.
