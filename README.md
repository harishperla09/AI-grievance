<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-8.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/AI%2FNLP-Keyword%20Engine-6366f1?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
</p>

# 🏛️ AI Grievance Portal

> **AI-Powered Civic Complaint Management System** — Submit civic complaints and let AI automatically route them to the correct government department. Track progress in real-time with color-coded priorities and earn rewards for civic participation.

---

## 📑 Table of Contents

- [Features](#-features)
- [Screenshots & UI Overview](#-screenshots--ui-overview)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
  - [Step 1 — Clone the Repository](#step-1--clone-the-repository)
  - [Step 2 — Install Dependencies](#step-2--install-dependencies)
  - [Step 3 — Configure Environment Variables](#step-3--configure-environment-variables)
  - [Step 4 — Database Setup](#step-4--database-setup)
  - [Step 5 — Seed Demo Data (Optional)](#step-5--seed-demo-data-optional)
  - [Step 6 — Start the Server](#step-6--start-the-server)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [AI / NLP Engine](#-ai--nlp-engine)
- [Database Schema](#-database-schema)
- [Gamification System](#-gamification-system)
- [Demo Accounts](#-demo-accounts)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

| Category | Feature |
|----------|---------|
| 🤖 **AI Categorization** | Automatic department routing using NLP keyword matching across 8+ departments |
| 🎨 **Color-Coded Priorities** | 🔴 Red (Urgent) · 🟡 Yellow (Medium) · 🟢 Green (Resolved) |
| 🔍 **Duplicate Detection** | String-similarity algorithm prevents duplicate complaints and merges them as upvotes |
| 📊 **Public Transparency Dashboard** | Live animated charts — complaints by department, status, and 7-day trend |
| 👤 **Citizen Dashboard** | Personal complaint cards with progress bars, filtering, badges, and reward points |
| 🛡️ **Admin Dashboard** | Table view with filters, status updates, staff assignment, escalation, and analytics |
| 💬 **AI Chatbot** | Floating chatbot widget with preset Q&A for portal guidance |
| 🏆 **Gamification** | Points (+10/+5/+2) and badges (New Citizen, Active Citizen, Civic Champion, Problem Solver) |
| 🔔 **Toast Notifications** | Animated alerts for complaint submission, status changes, and resolutions |
| 🔐 **JWT Authentication** | Secure login/register, role-based access (citizen/admin), protected routes |
| ⭐ **Feedback System** | Citizens rate resolved complaints (1–5 stars) to track department performance |
| 🌐 **Language Detection** | Detects English, Hindi, Tamil, Telugu with mock translation support |
| 📤 **File Uploads** | Image/video upload support (up to 10 MB) with drag-and-drop UI |
| 📱 **Fully Responsive** | Mobile-first design that works on phones, tablets, and desktops |

---

## 🖥️ Screenshots & UI Overview

| Page | Description |
|------|-------------|
| **Landing Page** | Hero section with stats, "How It Works" steps, departments grid, priority system explainer, public analytics charts, recent complaints, and gamification rewards |
| **Submit Complaint** | Form with real-time AI preview (department + priority detected as you type), file upload, language selector |
| **Citizen Dashboard** | Profile card with points/badges, filterable complaint grid with color-coded cards and progress bars |
| **Admin Dashboard** | Stats overview, pie/bar charts, filterable table with status update modals and staff assignment |
| **AI Chatbot** | Floating bottom-right widget with suggested questions and scrollable chat interface |

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup, single-page app structure |
| **CSS3** | Custom responsive styles with CSS variables, animations, grid/flexbox layouts |
| **JavaScript (Vanilla)** | SPA navigation, API client, auth flows, real-time UI updates |
| **Chart.js 4.x** | Interactive doughnut, bar, and line charts for analytics |
| **Font Awesome 6.x** | Icon library for UI elements |
| **Google Fonts (Inter)** | Modern typeface |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js 18+** | JavaScript runtime |
| **Express.js 4.x** | Web framework, REST API server, static file serving |
| **Mongoose 8.x** | MongoDB ODM (Object Document Mapper) |
| **JSON Web Tokens** | Stateless authentication (7-day expiry) |
| **bcrypt.js** | Password hashing (salt rounds: 10) |
| **Multer** | Multipart file upload handling |
| **string-similarity** | Duplicate complaint detection (Dice coefficient) |
| **dotenv** | Environment variable management |
| **mongodb-memory-server** | In-memory MongoDB for zero-config demo mode |

### Database
| Technology | Purpose |
|------------|---------|
| **MongoDB** | Primary database (local, Atlas, or in-memory) |
| **MongoDB Atlas** | Recommended cloud database for production |

---

## 📋 Prerequisites

Before installing, ensure you have the following on your system:

| Requirement | Minimum Version | Check Command | Install Guide |
|-------------|-----------------|---------------|---------------|
| **Node.js** | v18.0.0 or higher | `node --version` | [nodejs.org](https://nodejs.org/) |
| **npm** | v9.0.0 or higher | `npm --version` | Comes with Node.js |
| **Git** | v2.30+ | `git --version` | [git-scm.com](https://git-scm.com/) |
| **MongoDB** *(optional)* | v6.0+ | `mongod --version` | [mongodb.com](https://www.mongodb.com/docs/manual/installation/) |

> **💡 MongoDB is optional!** The app includes an automatic in-memory MongoDB fallback using `mongodb-memory-server`. If no external MongoDB is detected, it will spin up an in-memory database with demo data automatically. This is perfect for demos, hackathons, and quick testing.

### Installing Node.js

<details>
<summary><strong>macOS</strong></summary>

```bash
# Using Homebrew (recommended)
brew install node

# Or download the installer from https://nodejs.org/
```
</details>

<details>
<summary><strong>Ubuntu / Debian Linux</strong></summary>

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```
</details>

<details>
<summary><strong>Windows</strong></summary>

1. Download the installer from [nodejs.org](https://nodejs.org/)
2. Run the `.msi` installer
3. Restart your terminal / command prompt
</details>

### Installing MongoDB (Optional)

<details>
<summary><strong>macOS</strong></summary>

```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```
</details>

<details>
<summary><strong>Ubuntu / Debian Linux</strong></summary>

```bash
sudo apt-get install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```
</details>

<details>
<summary><strong>Windows</strong></summary>

1. Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run the `.msi` installer (choose "Complete" setup)
3. Check "Install MongoDB as a Service"
</details>

<details>
<summary><strong>MongoDB Atlas (Cloud — No Installation Required)</strong></summary>

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com/)
2. Create a free M0 cluster
3. Create a database user (note the username and password)
4. Whitelist your IP address (or allow access from anywhere: `0.0.0.0/0`)
5. Click **Connect** → **Connect your application** → copy the connection string
6. It will look like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/grievance_portal`
7. Use this URI in your `.env` file (see Step 3 below)
</details>

---

## 🚀 Installation

### Step 1 — Clone the Repository

```bash
git clone https://github.com/harishperla09/AI-grievance.git
cd AI-grievance
```

### Step 2 — Install Dependencies

```bash
npm install
```

This will install all required packages:

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.21.0 | Web server framework |
| `mongoose` | ^8.6.0 | MongoDB object modeling |
| `bcryptjs` | ^2.4.3 | Password hashing |
| `jsonwebtoken` | ^9.0.2 | JWT authentication tokens |
| `cors` | ^2.8.5 | Cross-origin resource sharing |
| `dotenv` | ^16.4.5 | Environment variable loading |
| `multer` | ^1.4.5 | File upload middleware |
| `string-similarity` | ^4.0.4 | Duplicate complaint detection |
| `uuid` | ^10.0.0 | Unique identifier generation |
| `mongodb-memory-server` | ^11.0.1 | In-memory MongoDB for demo mode |
| `nodemon` | ^3.1.4 | *(dev)* Auto-restart on file changes |

### Step 3 — Configure Environment Variables

Create a `.env` file in the project root:

```bash
touch .env
```

Add the following configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Connection
# Option A: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/grievance_portal

# Option B: MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/grievance_portal

# Option C: Leave blank or skip — app will use in-memory MongoDB automatically

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

#### Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Server port number |
| `MONGODB_URI` | No | `mongodb://localhost:27017/grievance_portal` | MongoDB connection string |
| `JWT_SECRET` | No | `dev_jwt_secret_change_in_production` | Secret key for JWT signing |
| `NODE_ENV` | No | `development` | Environment mode |

> ⚠️ **Security Note:** Always use a strong, unique `JWT_SECRET` in production. Never commit your `.env` file to version control.

### Step 4 — Database Setup

You have **three options** — choose whichever suits your setup:

#### Option A: Local MongoDB (if installed)

```bash
# Verify MongoDB is running
mongod --version
mongosh --eval "db.runCommand({ ping: 1 })"

# If not running, start it:
# macOS:   brew services start mongodb-community
# Linux:   sudo systemctl start mongod
# Windows: net start MongoDB
```

#### Option B: MongoDB Atlas (Cloud)

1. Set your Atlas connection string in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/grievance_portal
   ```
2. No further setup needed — the app connects on startup.

#### Option C: In-Memory MongoDB (Zero Config ✅)

**Do nothing!** If the app cannot connect to a MongoDB instance, it automatically:
1. Starts an in-memory MongoDB server using `mongodb-memory-server`
2. Seeds 10 demo complaints, 4 users, 8 departments, and reward data
3. Works fully — all APIs and features function normally

> ⚠️ **Note:** In-memory data is lost when the server stops. This is ideal for demos, testing, and hackathons.

### Step 5 — Seed Demo Data (Optional)

If using **local MongoDB** or **Atlas**, run the seed script to populate demo data:

```bash
npm run seed
```

This creates:
- **4 user accounts** (1 admin + 3 citizens)
- **8 government departments** with heads and contact emails
- **10 demo complaints** across various departments, priorities, and statuses
- **Notifications** for each complaint
- **Reward point records** for all citizens

Expected output:
```
Connected to MongoDB for seeding...
✅ Departments seeded
✅ Users seeded
✅ Complaints seeded
✅ Notifications seeded
✅ Rewards seeded

🎉 Database seeded successfully!

📋 Demo Accounts:
  Admin:   admin@grievance.gov / password123
  Citizen: rahul@example.com / password123
  Citizen: sneha@example.com / password123
  Citizen: amit@example.com / password123
```

> 💡 If using **in-memory mode** (Option C), seeding happens automatically on startup — no need to run this command.

### Step 6 — Start the Server

#### Production Mode
```bash
npm start
```

#### Development Mode (with auto-restart)
```bash
npm run dev
```

Expected startup output:
```
❌ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017   ← (only if no local MongoDB)
💡 Falling back to in-memory MongoDB server...
✅ Connected to in-memory MongoDB
✅ Demo data seeded automatically
🚀 AI Grievance Portal server running on http://localhost:3000
📊 Frontend: http://localhost:3000
📡 API Base: http://localhost:3000/api
```

**Open your browser and visit:** [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
AI-grievance/
│
├── .env                          # Environment variables (not committed)
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and npm scripts
├── package-lock.json             # Dependency lock file
│
├── backend/
│   ├── server.js                 # Express server entry point + DB connection
│   ├── seed.js                   # Database seeder (for external MongoDB)
│   ├── seedInMemory.js           # Auto-seeder for in-memory mode
│   │
│   ├── ai/
│   │   └── nlpEngine.js          # AI/NLP engine — categorization, priority, duplicates
│   │
│   ├── middleware/
│   │   └── auth.js               # JWT authentication + admin role middleware
│   │
│   ├── models/
│   │   ├── User.js               # User schema (citizens & admins)
│   │   ├── Complaint.js          # Complaint schema with AI fields
│   │   ├── Department.js         # Department registry
│   │   ├── Escalation.js         # Escalation tracking
│   │   ├── Notification.js       # User notifications
│   │   ├── Reward.js             # Points/reward history
│   │   └── Vote.js               # Upvote tracking (unique per user)
│   │
│   └── routes/
│       ├── userRoutes.js         # /api/register, /api/login, /api/user/profile
│       ├── complaintRoutes.js    # /api/complaints/* endpoints
│       └── adminRoutes.js        # /api/admin/* endpoints
│
├── frontend/
│   ├── index.html                # Single-page application (all pages)
│   │
│   ├── css/
│   │   ├── style.css             # Main styles (layout, nav, hero, cards, forms, modals)
│   │   ├── dashboard.css         # Citizen dashboard + priority indicators
│   │   ├── admin.css             # Admin dashboard + table styles
│   │   └── chatbot.css           # Chatbot widget styles
│   │
│   └── js/
│       ├── api.js                # API client (fetch wrapper, token management)
│       ├── auth.js               # Login, register, logout, demo account helpers
│       ├── app.js                # Main app logic (navigation, forms, dashboards)
│       ├── charts.js             # Chart.js chart rendering (public + admin)
│       └── chatbot.js            # Chatbot preset answers and UI logic
│
└── uploads/                      # Uploaded images/videos (created at runtime)
```

---

## 📡 API Documentation

All endpoints are prefixed with `/api`. Authentication uses **Bearer tokens** in the `Authorization` header.

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/register` | ❌ | Create a new citizen account |
| `POST` | `/api/login` | ❌ | Login and receive JWT token |
| `GET` | `/api/user/profile` | ✅ | Get authenticated user's profile + rewards |

#### `POST /api/register`
```json
// Request Body
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "mypassword123",
  "role": "citizen"
}

// Response (201)
{
  "message": "Registration successful!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "citizen", "reward_points": 0, "badges": [...] }
}
```

#### `POST /api/login`
```json
// Request Body
{ "email": "rahul@example.com", "password": "password123" }

// Response (200)
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "name": "Rahul Mehta", "role": "citizen", "reward_points": 45, "badges": [...] }
}
```

### Complaint Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/complaints/submit` | ✅ | Submit a new complaint (AI auto-categorizes) |
| `GET` | `/api/complaints/user/:userId` | ✅ | Get complaints by a specific user |
| `GET` | `/api/complaints/all` | ❌ | Get all public complaints (with filters) |
| `PUT` | `/api/complaints/update-status` | ✅ | Update complaint status |
| `POST` | `/api/complaints/upvote` | ✅ | Upvote a complaint (+2 points) |
| `POST` | `/api/complaints/feedback` | ✅ | Submit rating for resolved complaints |
| `GET` | `/api/complaints/insights` | ❌ | Get AI-generated analytics |
| `GET` | `/api/complaints/notifications/:userId` | ✅ | Get user's notifications |

#### `POST /api/complaints/submit`
```json
// Request Body
{
  "complaint_text": "Garbage not collected for 5 days, causing bad smell",
  "location": "MG Road, Sector 15, Bangalore",
  "language": "English",
  "uploaded_image_url": ""
}

// Response (201)
{
  "message": "Complaint submitted successfully!",
  "complaint": { ... },
  "ai_analysis": {
    "department": "Sanitation Department",
    "priority": "yellow",
    "suggestion": "While we process your complaint, please ensure garbage is kept in covered bins...",
    "language": "English",
    "translated_text": ""
  },
  "points_earned": 10
}
```

#### `GET /api/complaints/all?department=Water Department&priority=red&status=Pending&page=1&limit=10`

Returns filtered, paginated complaints with user info populated.

### Admin Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/admin/complaints` | ✅ Admin | Get all complaints (filterable, sorted by priority) |
| `PUT` | `/api/admin/update-status` | ✅ Admin | Update status + assign staff |
| `POST` | `/api/admin/escalate` | ✅ Admin | Escalate a complaint (sets priority to red) |
| `GET` | `/api/admin/insights` | ✅ Admin | Department performance insights |
| `GET` | `/api/admin/departments` | ✅ Admin | Department-wise statistics |

#### `PUT /api/admin/update-status`
```json
// Request Body
{
  "complaint_id": "65f1a2b3c4d5e6f7a8b9c0d1",
  "status": "In Progress",
  "assigned_staff": "Eng. Mohan Das"
}
```

### File Upload

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/upload` | ❌ | Upload image/video (multipart, max 10 MB) |

---

## 🧠 AI / NLP Engine

The AI engine (`backend/ai/nlpEngine.js`) provides an automated complaint processing pipeline:

### Department Detection

The engine matches complaint text against weighted keyword lists for **8 departments**:

| Department | Example Keywords |
|------------|-----------------|
| 🗑️ **Sanitation** | garbage, trash, waste, dump, sewage, drain, dustbin, cleaning, hygiene |
| 💧 **Water** | water, leakage, pipe, burst, supply, flood, plumbing, contaminated, tank |
| 💡 **Electrical** | electricity, street light, power, outage, transformer, wire, blackout |
| 🛣️ **Public Works** | road, pothole, bridge, footpath, crack, highway, asphalt, sidewalk |
| 🚦 **Traffic & Transport** | traffic, signal, parking, bus, congestion, accident, zebra crossing |
| 🏥 **Health** | hospital, health, mosquito, dengue, vaccination, ambulance, pest, infection |
| 🌳 **Parks & Recreation** | park, garden, tree, playground, bench, recreation, sports, landscape |
| 🏗️ **Housing & Urban Dev** | building, illegal construction, encroachment, demolition, permit, zoning |

> Keywords are weighted by length — longer, more specific keywords get higher scores.

### Priority Detection

| Priority | Color | Trigger Keywords |
|----------|-------|------------------|
| 🔴 **High** | Red | urgent, emergency, dangerous, hazard, critical, accident, collapse, fire, flood, toxic, fatal |
| 🟡 **Medium** | Yellow | *(default — when no high/low keywords match)* |
| 🟢 **Low** | Green | minor, small, suggestion, improvement, cosmetic, not urgent |

### Duplicate Detection

Uses the **Dice coefficient** (string-similarity library) to compare new complaints against existing unresolved ones:
- **Threshold:** 60% similarity
- **Action:** If duplicate found → skip creation, add upvote to original complaint instead
- **User earns:** +2 points for the merged upvote

### AI Suggestion Engine

Each department has a tailored safety/action suggestion returned to the citizen:

| Department | Suggestion |
|------------|-----------|
| Sanitation | "Please ensure garbage is kept in covered bins to prevent health hazards." |
| Water | "Please turn off the main valve if there's a leak. Avoid using contaminated water." |
| Electrical | "Please stay away from exposed wires. Use flashlights instead of candles." |
| Public Works | "Please be cautious around the damaged area. Use alternate routes if possible." |

### Language Detection

Detects script using Unicode ranges:
- **English** — ASCII text (default)
- **Hindi** — Devanagari `\u0900-\u097F`
- **Tamil** — `\u0B80-\u0BFF`
- **Telugu** — `\u0C00-\u0C7F`

Non-English text receives a mock translation prefix for prototype demonstration.

---

## 🗄️ Database Schema

### Users Collection

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name (required) |
| `email` | String | Unique email (required) |
| `phone` | String | Phone number |
| `password` | String | bcrypt hashed password |
| `role` | Enum | `citizen` or `admin` |
| `reward_points` | Number | Total accumulated points |
| `badges` | Array | `[{ name, icon, earned_at }]` |
| `created_at` | Date | Registration timestamp |

### Complaints Collection

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | ObjectId | Reference to Users |
| `complaint_text` | String | Original complaint text |
| `translated_text` | String | AI translated text (if non-English) |
| `location` | String | Location of the issue |
| `language` | String | Detected/selected language |
| `uploaded_image_url` | String | Path to uploaded media |
| `department` | String | AI-assigned department |
| `priority_level` | Enum | `red`, `yellow`, or `green` |
| `status` | Enum | `Pending`, `In Progress`, or `Resolved` |
| `upvotes` | Number | Community upvote count |
| `assigned_staff` | String | Staff assigned by admin |
| `ai_suggestion` | String | AI safety/action suggestion |
| `feedback` | Object | `{ rating, comment, submitted_at }` |
| `is_duplicate` | Boolean | Whether detected as duplicate |
| `duplicate_of` | ObjectId | Reference to original complaint |
| `created_at` | Date | Submission timestamp |
| `updated_at` | Date | Last update timestamp |

### Other Collections

| Collection | Key Fields |
|------------|------------|
| **Departments** | `department_name`, `department_email`, `department_head`, `icon` |
| **Votes** | `complaint_id`, `user_id` (unique compound index) |
| **Rewards** | `user_id`, `points`, `reason`, `created_at` |
| **Notifications** | `user_id`, `complaint_id`, `message`, `read`, `created_at` |
| **Escalations** | `complaint_id`, `department`, `escalation_level`, `reason`, `escalation_date` |

---

## 🏆 Gamification System

| Action | Points | Notes |
|--------|--------|-------|
| Submit a complaint | **+10** | Awarded immediately |
| Complaint gets resolved | **+5** | Awarded when admin sets status to "Resolved" |
| Upvote a complaint | **+2** | One vote per user per complaint |
| Duplicate merged as upvote | **+2** | When AI detects your complaint already exists |

### Badges

| Badge | Icon | Requirement |
|-------|------|-------------|
| New Citizen | 🌟 | Awarded on registration |
| Active Citizen | 🏆 | Submit 5 complaints |
| Civic Champion | 👑 | Submit 10 complaints |
| Problem Solver | 🔧 | Get 3 complaints resolved |
| Administrator | 🛡️ | Admin accounts only |

---

## 👥 Demo Accounts

All demo accounts use the password: **`password123`**

| Role | Name | Email | Points | Badges |
|------|------|-------|--------|--------|
| 🛡️ Admin | Admin User | `admin@grievance.gov` | 0 | Administrator |
| 👤 Citizen | Rahul Mehta | `rahul@example.com` | 45 | New Citizen, Active Citizen |
| 👤 Citizen | Sneha Reddy | `sneha@example.com` | 30 | New Citizen |
| 👤 Citizen | Amit Patel | `amit@example.com` | 20 | New Citizen |

---

## 🌐 Deployment

### Replit

1. Import the GitHub repository
2. Set environment variables in the **Secrets** tab:
   - `MONGODB_URI` — your Atlas connection string (or leave empty for in-memory)
   - `JWT_SECRET` — a strong random string
3. Set the run command to `npm start`
4. The app will auto-detect the port from the `PORT` env variable

### Render / Railway / Cyclic

1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_production_secret
   NODE_ENV=production
   PORT=3000
   ```

### Hostinger VPS

1. SSH into your server
2. Install Node.js 18+ and Git
3. Clone the repository:
   ```bash
   git clone https://github.com/harishperla09/AI-grievance.git
   cd AI-grievance
   npm install
   ```
4. Create `.env` with production values
5. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name "grievance-portal"
   pm2 save
   pm2 startup
   ```

### Docker (Optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "backend/server.js"]
```

```bash
docker build -t ai-grievance-portal .
docker run -p 3000:3000 --env-file .env ai-grievance-portal
```

---

## 🔧 Troubleshooting

### Port already in use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Fix:** Kill the existing process or use a different port:
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in .env
PORT=4000
```

> **macOS Note:** Port 5000 is used by AirPlay Receiver / ControlCenter. Use port 3000 or another port instead.

### MongoDB connection refused

```
❌ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```

**This is normal if MongoDB isn't installed!** The app will automatically fall back to in-memory MongoDB. If you want to use local MongoDB:
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### `npm install` fails

```bash
# Clear cache and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### JWT errors / "Access denied"

- Make sure you're sending the token in the `Authorization` header: `Bearer <token>`
- Tokens expire after 7 days — login again to get a new one
- Check that `JWT_SECRET` in `.env` matches the one used when the token was issued

### File upload not working

- Ensure the `uploads/` directory exists (created automatically on startup)
- Check file size — maximum is **10 MB**
- Accepted formats: images (JPG, PNG) and videos (MP4)

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Commit** changes: `git commit -m "Add my feature"`
4. **Push** to your fork: `git push origin feature/my-feature`
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

## 🙏 Acknowledgements

- **Chart.js** — Beautiful charts for analytics dashboards
- **Font Awesome** — Icon library
- **Google Fonts** — Inter typeface
- **mongodb-memory-server** — In-memory MongoDB for seamless demos
- **string-similarity** — Dice coefficient for duplicate detection

---

<p align="center">
  Built with ❤️ for Hackathon 2026<br/>
  <strong>AI Grievance Portal</strong> — Voice Your Complaints, Get Them Solved!
</p>
