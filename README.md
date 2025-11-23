# Accounting Pro - Complete Accounting Application

A comprehensive, production-ready accounting application similar to Akaunting, built with modern technologies.

## 🚀 Features

- **Invoice Management** - Create, edit, and track invoices with automatic calculations
- **Expense Tracking** - Categorize and monitor business expenses
- **Customer & Vendor Management** - Maintain detailed contact records
- **Financial Reports** - Profit & Loss statements with category breakdowns
- **Dashboard Analytics** - Real-time financial insights and charts
- **Multi-Currency Support** - Work with multiple currencies
- **Tax Calculations** - Automatic tax calculations on invoices and expenses
- **Beautiful UI** - Modern, responsive design with Tailwind CSS

## 🛠 Technology Stack

### Backend
- **Node.js** + **Express** - RESTful API server
- **TypeScript** - Type-safe backend code
- **Prisma** - Database ORM
- **MySQL** - Relational database
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

### Frontend
- **Next.js 14** - React framework with App Router
- **React** - UI library
- **TypeScript** - Type-safe frontend code
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Data visualization
- **Axios** - HTTP client

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **MySQL** 8.0+
- **Git**

## 🔧 Installation & Setup

### Step 1: Clone or Navigate to the Project

```bash
cd accounting-app
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env file with your database credentials:
# DATABASE_URL="mysql://root:yourpassword@localhost:3306/accounting_db"
# JWT_SECRET=your-super-secret-jwt-key

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:push

# Seed database with sample data
npm run db:seed

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### Step 3: Setup Frontend

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.local.example .env.local

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### Step 4: Access the Application

1. Open your browser and navigate to `http://localhost:3000`
2. Login with the default credentials:
   - **Email**: `admin@accounting.com`
   - **Password**: `admin123`

## 📚 Project Structure

```
accounting-app/
├── backend/                 # Express API Server
│   ├── prisma/             # Database schema and migrations
│   │   ├── schema.prisma   # Prisma schema
│   │   └── seed.ts         # Database seeding script
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Authentication & validation
│   │   ├── lib/            # Shared utilities
│   │   └── server.ts       # Main server file
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/               # Next.js Frontend
    ├── app/                # Next.js App Router
    │   ├── dashboard/      # Dashboard pages
    │   │   ├── invoices/
    │   │   ├── expenses/
    │   │   ├── customers/
    │   │   ├── vendors/
    │   │   └── reports/
    │   ├── globals.css     # Global styles
    │   ├── layout.tsx      # Root layout
    │   └── page.tsx        # Login page
    ├── lib/                # Utilities and API client
    ├── package.json
    └── tailwind.config.js
```

## 🎯 Main Features Guide

### Creating an Invoice

1. Go to **Invoices** page
2. Click **New Invoice**
3. Fill in customer, dates, and line items
4. Invoice will auto-calculate totals with taxes
5. Update status as needed (Draft → Sent → Paid)

### Tracking Expenses

1. Go to **Expenses** page
2. Click **Add Expense**
3. Select category, vendor, and amount
4. View expenses grouped by category

### Viewing Reports

1. Go to **Reports** page  
2. View Profit & Loss statement
3. See expense breakdown by category
4. Filter by date range

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Input validation

## 🎨 Design Features

- Modern gradient design
- Smooth animations
- Responsive layout  
- Card-based UI
- Color-coded categories
- Interactive charts

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Invoices
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id` - Get invoice details
- `PUT /api/invoices/:id` - Update invoice
- `PATCH /api/invoices/:id/status` - Update status

### Expenses
- `GET /api/expenses` - List all expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/:id` - Get expense details
- `PUT /api/expenses/:id` - Update expense

### Customers & Vendors
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/vendors` - List vendors
- `POST /api/vendors` - Create vendor

### Reports
- `GET /api/reports/profit-loss` - Profit & Loss report
- `GET /api/dashboard/stats` - Dashboard statistics

## 🐛 Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check DATABASE_URL in backend/.env
- Verify database credentials

### Port Already in Use
- Backend is set to port 5000
- Frontend is set to port 3000
- Change ports in respective .env files if needed

### Dependencies Installation Failed
- Try deleting node_modules and package-lock.json
- Run `npm install` again

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using Next.js, Express, and MySQL**
