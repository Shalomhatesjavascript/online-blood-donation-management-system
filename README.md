

# 🩸 Online Blood Donation Management System (OBDMS)

An **Online Blood Donation Management System (OBDMS)** designed to efficiently manage blood donors, recipients, blood inventory, and donation records.
This system helps hospitals, blood banks, and administrators easily track available blood units and connect donors with recipients in need.

---

## 🚀 Tech Stack

### Frontend

* **React**
* **Vite**
* **JavaScript**
* **CSS / Tailwind (optional)**

### Backend

* **Node.js**
* **Express.js**
* **REST API**

### Database

* **PostgreSQL**

---

## ✨ Features

### 👨‍💼 Admin

* Manage donors and recipients
* Manage blood inventory
* Track blood donations
* View available blood units by blood group
* Approve or reject donation records

### 🧑‍🦱 Donor

* Register as a donor
* View donation history
* Update personal information
* Check eligibility status

### 🧑‍⚕️ Recipient

* Search for available blood by blood group
* Request blood units
* View request status

---

## 📂 Project Structure

```
OBDMS/
│
├── frontend/          # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── backend/           # Express + Node backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   └── config/
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/obdms.git
cd obdms
```

---

## 🔧 Backend Setup (Express + Node)

### 2️⃣ Navigate to Backend Folder

```bash
cd backend
npm install
```

### 3️⃣ Create Environment Variables

Create a `.env` file in the `backend` folder:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blood_donation_db
DB_USER=postgres
DB_PASSWORD=your_password
```

---

## 🗄️ PostgreSQL Database Setup

### Option A: Create Database Locally

1. Open PostgreSQL (pgAdmin or terminal)
2. Run:

```sql
CREATE DATABASE blood_donation_db;
```

3. Ensure PostgreSQL is running
4. Tables will be created automatically (or via migrations, if used)

---

### Option B: Restore Database from Google Drive Backup

If you are using a **database backup uploaded to Google Drive**:
sample db: https://drive.google.com/file/d/1wMU1m9d_mM8KQbD4cQxKo8gtojzijtoo/view?usp=sharing

1. Download the `.sql` backup file
2. Restore using terminal:

```bash
psql -U postgres -d blood_donation_db -f blood_donation_db.sql
```
OR 

Create empty database

Right-click → Restore

Select backup.sql

Restore

> Make sure the database `blood_donation_db` already exists before restoring.


---

## ▶️ Start Backend Server

```bash
npm run dev
```

or

```bash
npm start
```

Backend will run on:

```
http://localhost:5000
```

---

## 🎨 Frontend Setup (React + Vite)

### 4️⃣ Navigate to Frontend Folder

```bash
cd frontend
npm install
```

### 5️⃣ Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## 🔗 API & Frontend Connection

Ensure the frontend API base URL points to the backend:

```js
const API_BASE_URL = "http://localhost:5000/api";
```

---

## 🔐 Environment & Security Notes

* Never commit `.env` files to GitHub
* Use strong database passwords
* Enable CORS properly in backend

---

## 📌 Future Improvements

* Authentication (JWT)
* Role-based access control
* Email notifications
* Mobile-friendly UI
* Deployment with Docker

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Commit changes
4. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Ogungbade Shalom**
Nigeria 🇳🇬
Software Developer | Game Developer

---

