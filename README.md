# 🩸 Blood Donation Management System - Documentation

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Deployment to Render](#deployment-to-render)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Project Overview

A full-stack web application that connects blood donors, hospitals/individuals (recipients), and blood banks. The system manages blood inventory, tracks donor eligibility (56-day WHO guideline), processes blood requests, and handles complaints/feedback.

**Live Demo:** od-donation-frontend-8pof.onrender.com

---

## ✨ Features

### For Blood Donors
- Register and manage donor profile
- View donation history
- Track eligibility status (auto-calculated)
- Submit complaints/feedback
- Export donation records

### For Hospitals/Individuals (Recipients)
- Search for eligible donors by blood group and location
- Submit blood requests with urgency levels
- Track request status
- View approval notifications
- Submit complaints/feedback

### For Blood Banks (Admins)
- Manage blood inventory with expiration tracking
- Approve/reject blood requests
- View all registered donors with filters
- Update donor donation dates
- Respond to complaints
- Export reports (donors, inventory, requests)
- Real-time stock statistics and alerts

### System Features
- JWT authentication with role-based access control
- Toast notifications
- Confirmation modals for critical actions
- CSV export functionality
- Responsive design (mobile-first)
- Auto-calculated blood expiration (35 days)
- Auto-calculated donor eligibility (56 days)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.3
- **Build Tool:** Vite 5.0
- **Styling:** Tailwind CSS 4.1
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Date Handling:** date-fns

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18
- **Database:** PostgreSQL 15+
- **ORM:** Sequelize 6.35
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Validation:** express-validator

### Deployment
- **Hosting:** Render (Frontend + Backend + Database)
- **Alternative:** Vercel (Frontend) + Render (Backend + DB)

---

## 📦 Prerequisites

Ensure you have these installed:

```bash
node -v    # v18.0.0 or higher
npm -v     # v9.0.0 or higher
git --version
psql --version  # PostgreSQL 15+ (for local development)
```

---

## 🚀 Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/Shalomhatesjavascript/blood-donation-system.git
cd blood-donation-system
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `backend/.env`:**
```bash
NODE_ENV=development
PORT=5000

# Local PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blood_donation_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=1h

# CORS
CORS_ORIGIN=http://localhost:5173
```

**Create PostgreSQL Database:**
```bash
# Open PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE blood_donation_db;

# Exit
\q
```

**Start Backend:**
```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `frontend/.env`:**
```bash
VITE_API_URL=http://localhost:5000/api/v1
```

**Start Frontend:**
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

### 4. Create Admin User

**Option A: Using Script (Recommended)**

```bash
# In backend folder, create file: createAdmin.js
# Copy code from deployment guide

# Run script
node createAdmin.js
```

**Option B: Direct SQL**

```bash
# Connect to database
psql -U postgres -d blood_donation_db

# Generate password hash first
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('Admin123', 10, (e,h) => console.log(h));"

# Insert admin (replace HASH with output above)
INSERT INTO users (email, password_hash, role, is_verified, "createdAt", "updatedAt")
VALUES ('admin@bloodbank.com', 'HASH', 'admin', true, NOW(), NOW());
```

**Login:**
- Email: `admin@bloodbank.com`
- Password: `Admin123`

---

## 🌐 Deployment to Render

### Prerequisites
1. GitHub account
2. Render account (sign up at https://render.com)
3. Code pushed to GitHub

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/blood-donation-system.git
git push -u origin main
```

### Step 2: Deploy Database

1. Go to Render Dashboard → **New +** → **PostgreSQL**
2. Configure:
   - **Name:** `blood-donation-db`
   - **Database:** `blood_donation_db`
   - **Plan:** Free
3. Click **Create Database**
4. **Copy "External Database URL"** (save for later)

### Step 3: Deploy Backend

1. **New +** → **Web Service**
2. Connect GitHub repository
3. Configure:
   - **Name:** `blood-donation-api`
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Add Environment Variables:**
   ```
   NODE_ENV=production
   DATABASE_URL=<paste External Database URL from Step 2>
   JWT_SECRET=<generate random 32+ character string>
   JWT_EXPIRE=1h
   CORS_ORIGIN=*
   PORT=5000
   ```

5. Click **Create Web Service**
6. Wait 5-10 minutes for deployment
7. **Copy backend URL** (e.g., `https://blood-donation-api.onrender.com`)

### Step 4: Deploy Frontend

1. Update `frontend/.env.production`:
   ```bash
   VITE_API_URL=https://blood-donation-api.onrender.com/api/v1
   ```

2. Commit and push:
   ```bash
   git add .
   git commit -m "Update production API URL"
   git push
   ```

3. **New +** → **Static Site**
4. Connect same GitHub repository
5. Configure:
   - **Name:** `blood-donation-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Plan:** Free

6. **Add Environment Variable:**
   ```
   VITE_API_URL=https://blood-donation-api.onrender.com/api/v1
   ```

7. Click **Create Static Site**
8. Wait 3-5 minutes
9. **Copy frontend URL** (e.g., `https://blood-donation-frontend.onrender.com`)

### Step 5: Update CORS

1. Go to backend service → **Environment**
2. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://blood-donation-frontend.onrender.com
   ```
3. Backend auto-redeploys (2-3 minutes)

### Step 6: Create Admin User

**Using local script pointing to production:**

```bash
# Update backend/.env with production DATABASE_URL
DATABASE_URL=<External Database URL from Render>

# Run admin creation script
node createAdmin.js
```

### Step 7: Test Deployment

Visit your frontend URL and test:
- Registration (donor, recipient)
- Login
- Admin login (`admin@bloodbank.com` / `Admin123`)
- All dashboard features

---

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Backend server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string (production) | `postgresql://user:pass@host:5432/db` |
| `DB_HOST` | Database host (local only) | `localhost` |
| `DB_PORT` | Database port (local only) | `5432` |
| `DB_NAME` | Database name (local only) | `blood_donation_db` |
| `DB_USER` | Database user (local only) | `postgres` |
| `DB_PASSWORD` | Database password (local only) | `your_password` |
| `JWT_SECRET` | Secret for JWT signing | `random-32-char-string` |
| `JWT_EXPIRE` | JWT expiration time | `1h` |
| `CORS_ORIGIN` | Allowed frontend URL | `http://localhost:5173` or production URL |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api/v1` |

---

## 🗄️ Database Schema

### Tables

**users**
- `user_id` (PK, auto-increment)
- `email` (unique)
- `password_hash`
- `role` (enum: donor, recipient, admin)
- `is_verified`
- `verification_token`
- `createdAt`, `updatedAt`

**donors**
- `donor_id` (PK, FK → users.user_id)
- `full_name`
- `age` (18-65)
- `gender` (enum: male, female, other)
- `blood_group` (enum: A+, A-, B+, B-, AB+, AB-, O+, O-)
- `phone`
- `address`
- `city`
- `state`
- `last_donation_date`
- `medical_history` (JSONB)

**blood_inventory**
- `unit_id` (PK)
- `blood_group`
- `donation_date`
- `expiration_date` (auto: donation_date + 35 days)
- `status` (enum: available, used, expired, discarded)
- `donor_id` (FK → donors.donor_id, nullable)
- `storage_location`

**blood_requests**
- `request_id` (PK)
- `recipient_id` (FK → users.user_id)
- `blood_group`
- `units_needed` (1-10)
- `urgency_level` (enum: low, medium, high)
- `hospital_location`
- `status` (enum: pending, approved, fulfilled, rejected)
- `admin_notes`
- `approved_by` (FK → users.user_id)
- `approved_at`

**complaints**
- `complaint_id` (PK)
- `user_id` (FK → users.user_id)
- `subject`
- `category` (enum: blood_quality, service_delay, staff_conduct, system_issue, donor_availability, request_processing, other)
- `description`
- `priority` (enum: low, medium, high)
- `status` (enum: pending, under_review, resolved, closed)
- `admin_response`
- `responded_by` (FK → users.user_id)
- `responded_at`
- `resolved_at`

---

## 🔌 API Endpoints

**Base URL:** `http://localhost:5000/api/v1` (local) or `https://your-backend.onrender.com/api/v1` (production)

### Authentication
```
POST   /auth/register          - Register new user
POST   /auth/login             - Login
GET    /auth/verify/:token     - Email verification
GET    /auth/me                - Get current user
POST   /auth/logout            - Logout
```

### Donors
```
GET    /donors/search          - Search donors (recipient, admin)
GET    /donors/all             - Get all donors (admin)
GET    /donors/eligible        - Get eligible donors (admin)
GET    /donors/:id             - Get donor details
PUT    /donors/:id             - Update donor profile
PUT    /donors/:id/donation-date - Update donation date (admin)
GET    /donors/:id/history     - Get donation history
```

### Inventory
```
GET    /inventory              - Get inventory
GET    /inventory/stats        - Stock statistics
GET    /inventory/expiring     - Expiring units (admin)
POST   /inventory              - Add blood unit (admin)
PUT    /inventory/:id          - Update blood unit (admin)
DELETE /inventory/:id          - Delete blood unit (admin)
```

### Requests
```
GET    /requests               - Get requests
POST   /requests               - Create request (recipient)
PUT    /requests/:id/approve   - Approve request (admin)
PUT    /requests/:id/reject    - Reject request (admin)
DELETE /requests/:id           - Cancel request (recipient)
```

### Complaints
```
GET    /complaints             - Get complaints
POST   /complaints             - Create complaint (donor, recipient)
GET    /complaints/:id         - Get complaint details
PUT    /complaints/:id/respond - Respond to complaint (admin)
PUT    /complaints/:id/status  - Update status (admin)
DELETE /complaints/:id         - Delete complaint
```

---

## 🐛 Troubleshooting

### Common Issues

**1. CORS Error**
```
Error: Not allowed by CORS
```
**Fix:** Update `CORS_ORIGIN` in backend to match frontend URL exactly (no trailing slash)

**2. Database Connection Failed**
```
Unable to connect to database
```
**Fix:** 
- Check `DATABASE_URL` is correct
- Verify database is running
- For Render: ensure backend and database in same region

**3. 404 on Page Refresh**
```
Cannot GET /donor/dashboard
```
**Fix:** Create `frontend/public/_redirects`:
```
/*    /index.html   200
```

**4. Admin Login Fails**
```
Invalid email or password
```
**Fix:** Recreate admin with correct password hash using `createAdmin.js` script

**5. Backend Sleeps (Render Free Tier)**
**Expected Behavior:** Backend sleeps after 15 min inactivity, wakes in 30-60 seconds
**Solution:** Upgrade to paid plan or accept behavior

### Debug Commands

**Check backend health:**
```bash
curl https://your-backend.onrender.com/api/health
```

**View backend logs (Render):**
Dashboard → Service → Logs tab

**Check database tables:**
```bash
psql -U postgres -d blood_donation_db
\dt
SELECT * FROM users LIMIT 5;
```

---

## 📁 Project Structure

```
blood-donation-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── jwt.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Donor.js
│   │   │   ├── BloodInventory.js
│   │   │   ├── BloodRequest.js
│   │   │   ├── Complaint.js
│   │   │   └── index.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── donorController.js
│   │   │   ├── inventoryController.js
│   │   │   ├── requestController.js
│   │   │   └── complaintController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── roleMiddleware.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── donorRoutes.js
│   │   │   ├── inventoryRoutes.js
│   │   │   ├── requestRoutes.js
│   │   │   └── complaintRoutes.js
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   ├── donorValidator.js
│   │   │   ├── inventoryValidator.js
│   │   │   ├── requestValidator.js
│   │   │   └── complaintValidator.js
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── createAdmin.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── auth/
│   │   │   ├── donor/
│   │   │   ├── recipient/
│   │   │   └── admin/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── donor/
│   │   │   ├── recipient/
│   │   │   └── admin/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── donorService.js
│   │   │   ├── inventoryService.js
│   │   │   ├── requestService.js
│   │   │   └── complaintService.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── exportCSV.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useToast.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   │   └── _redirects
│   ├── .env.example
│   ├── .env.production
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- WHO guidelines for blood donation intervals
- Render for free hosting
- Tailwind CSS for styling framework
- React and Node.js communities

---

## 📞 Support

For issues and questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Open an issue on GitHub
3. Contact: badeshalom@gmail.com

---

**Built with ❤️ for saving lives through technology**
