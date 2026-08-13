# 🩸 Blood Bank Management System

> A modern, secure, and full-stack **Blood Bank Management System** built with **React**, **Flask (Python)**, and **MySQL**. Designed for healthcare applications and academic project demonstrations.

---

## ✨ Features

### 👤 Donor Dashboard (`/donor-dashboard`)
- View personal blood group badge and eligibility status.
- Update profile details (Name, Blood Group, City/Location, Last Donation Date).
- Log new blood donations and view full donation history log.

### 🏥 Hospital Dashboard (`/hospital-dashboard`)
- Real-time blood availability stock checker.
- Submit blood requests with quantity, urgency reason, and required date.
- Track request status with filter pills (`All`, `Pending`, `Approved`, `Rejected`).

### ⚙️ Admin Control Panel (`/admin-dashboard`)
- **System Metrics**: Total users, donors, hospitals, available blood units, and requests count.
- **User Management**: Search, filter by role (`donor`, `hospital`, `admin`), and delete user accounts.
- **Donor Directory**: View and filter all registered blood donors.
- **Inventory Control**: Live stock manager for all 8 blood groups (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`).
- **Request Approval Panel**: Approve or reject hospital blood requests with automated inventory checks and atomic database transactions.

### 🔐 Security & Auth
- **Password Hashing**: Werkzeug `generate_password_hash` & `check_password_hash`.
- **Role-Based Access**: Restricted routes for `donor`, `hospital`, and `admin`.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, Tailwind CSS, Axios, Lucide Icons |
| **Backend** | Python 3, Flask REST API, Flask-CORS, PyMySQL / MySQL-Connector |
| **Database** | MySQL 8.0 |
| **Security** | Werkzeug Security (SHA-256 Hashing) |

---

## 📁 Project Structure

```text
BloodBankProject/
├── .gitignore              # Ignores node_modules, venv, .env files
├── README.md               # Project documentation
│
├── backend/
│   ├── app.py              # Main Flask REST API application
│   ├── config.py           # Database connection & configuration
│   ├── requirements.txt    # Python dependencies
│   ├── .env                # Local backend environment file (Ignored by Git)
│   └── .env.example        # Template for backend environment variables
│
├── frontend/
│   ├── package.json        # Frontend Node dependencies
│   ├── .env                # Local frontend environment file (Ignored by Git)
│   ├── .env.example        # Template for frontend environment variables
│   └── src/
│       ├── components/     # Navbar, ProtectedRoute, UI components
│       ├── context/        # AuthContext for session management
│       ├── pages/          # Home, Login, Register, Dashboards, Directory
│       ├── services/       # Axios API client setup
│       └── index.css       # Tailwind CSS styles
│
└── mysql/
    ├── schema.sql          # Complete MySQL database schema
    └── migration.sql       # Schema updates & test data script
```

---

## ⚡ Local Quick Start Guide

### 1️⃣ Database Setup (MySQL)
Run the schema script in your MySQL client (MySQL Workbench, XAMPP, or CLI):
```sql
SOURCE mysql/schema.sql;
```

### 2️⃣ Backend Setup (Flask)
```bash
# Move to backend folder
cd backend

# Create and activate virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (Copy from .env.example)
# Add your MySQL password to DB_PASSWORD in backend/.env

# Run Flask backend server
python app.py
```
> Backend runs at: `http://localhost:5000`

### 3️⃣ Frontend Setup (React)
```bash
# Move to frontend folder in a new terminal
cd frontend

# Install packages
npm install

# Start React development server
npm start
```
> Frontend runs at: `http://localhost:3000`

---

## 🔐 Environment Variables

Do **NOT** push real `.env` files to GitHub. Use `.env.example` as a reference.

### Backend (`backend/.env`)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bloodbank
DB_PORT=3306
FLASK_ENV=development
```

### Frontend (`frontend/.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🌐 Deployment Overview

| Service | Platform | Build Command / Root Dir | Key Environment Variable |
| :--- | :--- | :--- | :--- |
| **Frontend** | [Vercel](https://vercel.com) / [Netlify](https://netlify.com) | Root: `frontend` \| Build: `npm run build` | `REACT_APP_API_URL` |
| **Backend** | [Render](https://render.com) / [Railway](https://railway.app) | Root: `backend` \| Start: `python app.py` | `DB_HOST`, `DB_USER`, `DB_PASSWORD` |
| **Database** | [Aiven](https://aiven.io) / [Railway](https://railway.app) | Import `mysql/schema.sql` | `DB_NAME=bloodbank` |

---

## 🔌 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User authentication & password hash check |
| `GET` | `/api/users` | List all users (Admin) |
| `DELETE`| `/api/users/<id>` | Delete user account (Admin) |
| `GET` | `/api/donors` | Search donor directory |
| `PUT` | `/api/donors/<id>` | Update donor profile |
| `GET` | `/api/donations` | View donation history |
| `POST` | `/api/donations` | Log donation & increment blood stock |
| `GET` | `/api/inventory` | View live stock for all 8 blood groups |
| `PUT` | `/api/inventory/<group>` | Adjust blood group inventory |
| `GET` | `/api/requests` | List hospital blood requests |
| `POST` | `/api/requests` | Submit new blood request |
| `PUT` | `/api/requests/<id>/status` | Approve/Reject request & deduct inventory |
| `GET` | `/api/admin/dashboard` | Aggregated dashboard statistics |
