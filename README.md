# 🌾 MandiAlert — Farmer's Market Price Alert App

A full-stack web application that helps Indian farmers get real-time mandi price alerts via SMS and a web dashboard, so they can sell crops at the best prices.

---

## 📁 Project Structure

```
mandi-alert/
├── backend/
│   ├── controllers/
│   │   ├── farmerController.js    # Farmer CRUD logic
│   │   ├── marketController.js    # Price management logic
│   │   ├── alertController.js     # Alert sending logic
│   │   └── adminController.js     # Admin stats & seed
│   ├── models/
│   │   ├── Farmer.js              # Farmer schema
│   │   ├── MarketPrice.js         # Mandi price schema
│   │   └── Alert.js               # SMS alert log schema
│   ├── routes/
│   │   ├── farmerRoutes.js
│   │   ├── marketRoutes.js
│   │   ├── alertRoutes.js
│   │   └── adminRoutes.js
│   ├── services/
│   │   ├── smsService.js          # Twilio SMS integration
│   │   └── cronService.js         # Scheduled price checks
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── PageWrapper.jsx
    │   │   ├── StatCard.jsx
    │   │   ├── PriceCard.jsx
    │   │   ├── AlertBadge.jsx
    │   │   └── LoadingSpinner.jsx
    │   ├── pages/
    │   │   ├── LandingPage.jsx    # Hero + features
    │   │   ├── RegisterPage.jsx   # Farmer registration form
    │   │   ├── DashboardPage.jsx  # Prices, charts, alerts
    │   │   └── AdminPage.jsx      # Admin panel
    │   ├── utils/
    │   │   └── api.js             # Axios API calls
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- (Optional) Twilio account for real SMS

---

### 1. Clone & Setup Backend

```bash
cd mandi-alert/backend

# Install dependencies
npm install

# Copy and edit environment variables
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mandi-alert

# Optional: Add Twilio credentials for real SMS
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

```bash
# Start backend
npm run dev
```

Backend runs on: **http://localhost:5000**

---

### 2. Setup Frontend

```bash
cd mandi-alert/frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

Frontend runs on: **http://localhost:3000**

Vite proxies `/api` calls to the backend automatically.

---

### 3. Load Sample Data

Open the **Dashboard** page and click **"🌱 Load Sample Data"**.

This seeds 15 market price entries across Karnataka mandis.

---

## 🔑 API Endpoints

### Farmer APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/farmers/register` | Register a farmer |
| GET | `/api/farmers` | Get all farmers |
| GET | `/api/farmers/:id` | Get farmer by ID |
| PUT | `/api/farmers/:id` | Update preferences |

### Market APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/market/add` | Add a price entry |
| GET | `/api/market/prices` | Get prices (filter by crop/location) |
| GET | `/api/market/compare?crop=Tomato` | Compare mandis for a crop |
| GET | `/api/market/crops` | List available crops |
| PUT | `/api/market/:id` | Update a price |

### Alert APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts` | Get all alerts |
| GET | `/api/alerts/farmer/:id` | Get farmer's alerts |
| POST | `/api/alerts/trigger` | Manually trigger alerts |

### Admin APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| POST | `/api/admin/seed` | Seed sample price data |

---

## 📱 SMS Alerts

### With Twilio (Real SMS)
1. Sign up at [twilio.com](https://twilio.com)
2. Get Account SID, Auth Token, and a Twilio phone number
3. Add them to your `.env` file
4. Farmer phone numbers must include country code `+91XXXXXXXXXX`

### Without Twilio (Simulation Mode)
If Twilio credentials are missing, the system runs in simulation mode:
- SMS content is printed to the console
- Alert records are saved with status `simulated`
- Full functionality is preserved

---

## ⏰ Cron Job

The price alert cron runs **every 6 hours** automatically.

Logic:
1. Fetches all registered farmers
2. For each farmer, finds the best mandi price for their crop
3. Compares with local mandi price
4. If best mandi is >5% better → sends SMS alert
5. Prevents duplicate alerts within 24 hours

---

## 🎨 Frontend Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Hero, features, CTA |
| Register | `/register` | Farmer signup form |
| Dashboard | `/dashboard` | Prices, charts, alerts |
| Admin | `/admin` | Stats, farmers table, add prices |

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Axios, React Router

**Backend:** Node.js, Express.js, MongoDB, Mongoose, node-cron, Twilio

---

## 🌱 Supported Crops

Tomato, Onion, Potato, Rice, Maize, Sugarcane, Ragi, Groundnut, Wheat, Banana, Mango

## 🏪 Supported Karnataka Mandis

Bangalore, Mysore, Hubli, Shivamogga, Davangere, Hassan, Mandya, Tumkur, Chitradurga, Bellary, Mandya

---

## 📄 License

MIT License — Free for educational and personal use.
