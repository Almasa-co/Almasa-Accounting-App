# Quick Setup Guide

## For Windows Users

### 1. Install Prerequisites

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/
   - Choose LTS version (18.x or higher)
   - Run installer and follow prompts

2. **Install MySQL** (if not already installed)
   - Download from https://dev.mysql.com/downloads/mysql/
   - During installation, set root password (remember this!)
   - OR use XAMPP which includes MySQL

### 2. Create Database

Open MySQL Command Line or phpMyAdmin:

```sql
CREATE DATABASE accounting_db;
```

### 3. Setup Backend

```powershell
# Open PowerShell and navigate to project
cd C:\Users\Nyan-nyaaa!!\Documents\Almasa\accounting-app

# Go to backend folder
cd backend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Edit .env file with Notepad
notepad .env
```

In the .env file, update:
```
DATABASE_URL="mysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/accounting_db"
JWT_SECRET=change-this-to-something-random-and-secure
```

Then continue:
```powershell
# Generate Prisma client
npm run db:generate

# Create database tables
npm run db:push

# Add sample data
npm run db:seed

# Start backend server
npm run dev
```

Keep this terminal open! Backend is now running on http://localhost:5000

### 4. Setup Frontend

Open a NEW PowerShell window:

```powershell
# Navigate to project
cd C:\Users\Nyan-nyaaa!!\Documents\Almasa\accounting-app

# Go to frontend folder
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env.local.example .env.local

# Start frontend server
npm run dev
```

Keep this terminal open too! Frontend is now running on http://localhost:3000

### 5. Access the Application

1. Open your web browser
2. Go to: http://localhost:3000
3. Login with:
   - Email: admin@accounting.com
   - Password: admin123

## 🎉 You're Done!

The application is now fully running. You can:
- Create invoices
- Track expenses
- Manage customers and vendors
- View financial reports

## ⚠️ Important Notes

- Keep BOTH terminal windows open (backend and frontend)
- Backend must run on port 5000
- Frontend must run on port 3000
- MySQL server must be running

## 🔄 To Run Again Later

Whenever you want to use the application:

1. Start MySQL (if not running)
2. Open terminal 1: 
   ```
   cd C:\Users\Nyan-nyaaa!!\Documents\Almasa\accounting-app\backend
   npm run dev
   ```
3. Open terminal 2:
   ```
   cd C:\Users\Nyan-nyaaa!!\Documents\Almasa\accounting-app\frontend
   npm run dev
   ```
4. Open browser to http://localhost:3000

## 💡 Tips

- The database persists data between restarts
- You can create more users by registering
- Sample data includes customers, vendors, and categories
- All invoice calculations are automatic

Enjoy your new accounting application! 🚀
