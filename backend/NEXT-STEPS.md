# ⚠️ IMPORTANT: Setup Instructions

## What's Done ✅
- Backend dependencies installed
- Environment file created (.env)

## What You Need to Do Next:

### Step 1: Update Database Password
1. Open `backend\.env` file
2. Change this line:
   ```
   DATABASE_URL="mysql://root:password@localhost:3306/accounting_db"
   ```
   Replace `password` with YOUR actual MySQL root password

### Step 2: Create Database
Open MySQL and run:
```sql
CREATE DATABASE accounting_db;
```

### Step 3: Run These Commands in Backend Folder

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

### Step 4: Setup Frontend (in a NEW terminal)

```powershell
cd ..\frontend
npm install
npm run dev
```

### Step 5: Access Application
- Go to http://localhost:3000
- Login: admin@accounting.com / admin123

---

## Quick Commands (After updating .env):

```powershell
# In backend folder:
npm run db:generate && npm run db:push && npm run db:seed && npm run dev
```

```powershell
# In NEW terminal, frontend folder:
npm install && npm run dev
```
