# ShareBite — Share more. Waste less. 🍲🌱

A food surplus donation and redistribution platform connecting restaurants, caterers, grocery stores, and community kitchens with NGOs and charitable shelters in real-time.

![ShareBite](https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Vision & Key Highlights

Global commercial food waste accounts for **8–10% of total greenhouse gas emissions**, while hundreds of thousands of community shelters struggle with nutrition security. 

**ShareBite** bridges this gap in under 60 seconds by combining:
1. **Interactive 3D-Inspired UI**: Floating depth food bowl, dynamic specular glare tilt cards, and a live geospatial redistribution graph.
2. **Instant Hyperlocal Matching**: Connects hot prepared meals, morning artisan bakes, and fresh produce within a 5km radius before expiry.
3. **Verified Food Safety & Legal Shield**: Full statutory protection under the **Bill Emerson Good Samaritan Food Act (42 U.S. Code § 1791)** with certified HACCP temperature logging.
4. **Frictionless Handoff**: 6-digit OTP codes and pickup verification passes for volunteer speed.
5. **ESG & Tax Deduction Engine**: Generates automated IRS Sec. 170(e)(3) compliance reports and environmental footprint certificates.

---

## 🎨 Brand & Design System

- **Primary Colors**:
  - Deep Forest Green: `#0f392b` / `#164e3b`
  - Fresh Lime: `#84cc16` / `#a3e635`
- **Secondary & Accent Colors**:
  - Warm Ivory: `#faf7f2`
  - Subtle Warm Amber / Orange: `#f97316`
  - Crisp White: `#ffffff`
- **Typography**: Bold modern headings (**Outfit**) with clean, accessible body text (**Plus Jakarta Sans**).
- **3D Mechanics**: Lightweight CSS 3D transforms (`preserve-3d`, `perspective: 1000px`, dynamic mouse tracking, specular lighting glare, depth layers). Respects `prefers-reduced-motion`.

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite 8 (JavaScript)
- **Styling**: Tailwind CSS v4 + `@tailwindcss/vite`
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Micro-Interactions**: Canvas Confetti
- **Backend Ready**: Node.js + Express REST API with MongoDB Mongoose schemas

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```

### 4. Optional Express Backend Server
```bash
npm run server
```
Runs the REST API at [http://localhost:5000](http://localhost:5000).

---

## 👥 Hackathon Demo Roles (1-Click Switcher)

Use the top-right **Role Switcher** on the navbar or the `/login` page to test all three perspectives:

1. **👨‍🍳 Donor Kitchen (Chef Marco Rossi)**:
   - **Organization**: Verde Artisan Osteria
   - **Features**: List surplus food in 60s wizard, set temperature logs, track claimed batches, verify volunteer OTP tokens, download tax certificates.
2. **🏢 Recipient NGO (Sarah Lin)**:
   - **Organization**: Eastside Hope Food Rescue & Shelter
   - **Features**: Browse live surplus, 1-click claim, generate pickup QR pass & 6-digit OTP code, route instructions.
3. **🛡️ Admin Safety Oversight (David Vance)**:
   - **Organization**: ShareBite Safety & Operations Board
   - **Features**: Audit queue for donor food handler licenses, 501(c)(3) verification, platform KPIs, and live temperature compliance monitoring.

---

## 📋 Platform Modules Tour

| Route | Feature | Description |
|---|---|---|
| `/` | **Landing Page** | 3D food bowl hero, live impact stats, autonomous network map, featured surplus, 3-step guide, and legal notice |
| `/explore` | **Surplus Catalog** | Real-time filters (category, dietary tags, urgency &lt;90m, proximity) with Grid and Live Map view modes |
| `/donor-dashboard` | **Donor Hub** | Surplus posting wizard, active batch tracker, OTP handoff verification, IRS tax receipt export |
| `/recipient-dashboard` | **NGO Shelter Hub** | Reserved pickup passes with OTP handoff codes, route details, and open donation claim radar |
| `/admin` | **Admin Board** | Platform safety metrics, license audit queue, compliance score, and temperature log ledger |
| `/impact` | **Impact & Calculator** | 100,000-meal community goal progress, CO2/water/trees metrics, interactive calculator, ESG certificate export |
| `/safety` | **Safety & Legal Shield** | Bill Emerson Good Samaritan Act breakdown, FDA temperature danger zones, interactive kitchen self-audit checklist |
| `/login` & `/register` | **Authentication** | Tailored multi-role registration and instant 1-click demo logins |

---

## 📜 Compliance & Legal Shield

All donations facilitated by ShareBite are protected under:
- **Bill Emerson Good Samaritan Food Donation Act (42 U.S. Code § 1791)**
- **Food Donation Improvement Act of 2023 (FDIA)**
- **Internal Revenue Code (IRC) Section 170(e)(3)** for enhanced corporate deductions

---

*ShareBite — Share more. Waste less.*
