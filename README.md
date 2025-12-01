# AlmasaAccounting - Enterprise Grade Accounting Solution

A powerful, production-ready accounting application designed and built by Almasa to streamline business financial management.

## 🚀 Features

- **Smart Invoice Management** - Create, edit, and track invoices with automatic calculations and status tracking
- **Expense Tracking** - Comprehensive categorization and monitoring of business expenses
- **Customer & Vendor Management** - Maintain detailed contact records and transaction history
- **Financial Intelligence** - Real-time Profit & Loss statements with detailed category breakdowns
- **Interactive Dashboard** - Visual analytics and charts for instant business insights
- **Multi-Currency Engine** - Seamlessly work with international currencies
- **Automated Tax Handling** - Precise tax calculations on all transactions
- **Modern UI/UX** - A beautiful, responsive interface built for productivity

## 🛠 Technology Stack

### Backend
- **Node.js** + **Express** - High-performance RESTful API
- **TypeScript** - Enterprise-grade type safety
- **Prisma** - Next-generation ORM
- **MySQL** - Robust relational database
- **JWT** - Secure, stateless authentication
- **bcrypt** - Industry-standard password hashing

### Frontend
- **Next.js 14** - Cutting-edge React framework
- **React** - Component-based UI architecture
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling framework
- **Chart.js** - Advanced data visualization
- **Axios** - Optimized HTTP client

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **MySQL** 8.0+
- **Git**

## 🔧 Installation & Setup

### Step 1: Clone or Navigate to the Project

```bash
cd AlmasaAccounting
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
# DATABASE_URL="mysql://root:yourpassword@localhost:3306/almasaaccounting_db"
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
   - **Email**: `admin@almasaaccounting.com`
   - **Password**: `admin123`

## 📚 Project Structure

```
AlmasaAccounting/
├── backend/                 # API Server & Business Logic
│   ├── prisma/             # Database schema and migrations
│   │   ├── schema.prisma   # Data models
│   │   └── seed.ts         # Initial data population
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Security & validation layers
│   │   ├── lib/            # Core utilities
│   │   └── server.ts       # Application entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/               # User Interface
    ├── app/                # Application Routing
    │   ├── dashboard/      # Protected application area
    │   │   ├── invoices/
    │   │   ├── expenses/
    │   │   ├── customers/
    │   │   ├── vendors/
    │   │   └── reports/
    │   ├── globals.css     # Design system
    │   ├── layout.tsx      # Root layout structure
    │   └── page.tsx        # Authentication entry
    ├── lib/                # Client-side utilities
    ├── package.json
    └── tailwind.config.js
```

## 🎯 Features Guide

### Creating an Invoice

1. Navigate to **Invoices**
2. Click **New Invoice**
3. Select customer and add line items
4. System automatically calculates subtotal, taxes, and grand total
5. Manage lifecycle (Draft → Sent → Paid)

### Tracking Expenses

1. Navigate to **Expenses**
2. Click **Add Expense**
3. Record details including category and vendor
4. Monitor spending patterns via reports

### Financial Reporting

1. Access the **Reports** section
2. Generate Profit & Loss statements
3. Analyze expense distribution
4. Filter data by custom date ranges

## 🔒 Security Architecture

- **Authentication**: Secure JWT-based session management
- **Data Protection**: Bcrypt password hashing
- **API Security**: Protected routes and middleware
- **Network**: CORS configuration
- **Validation**: Strict input validation and sanitization

## 🎨 Design Philosophy

- **Modern Aesthetic**: Clean, gradient-based design
- **Interactivity**: Smooth transitions and animations
- **Responsiveness**: Fully adaptive layout for all devices
- **Visual Hierarchy**: Card-based UI with clear information architecture
- **Data Visualization**: Interactive charts for financial data

## 📝 API Reference

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Session validation

### Invoices
- `GET /api/invoices` - Retrieve invoices
- `POST /api/invoices` - Generate new invoice
- `GET /api/invoices/:id` - Retrieve invoice details
- `PUT /api/invoices/:id` - Update invoice
- `PATCH /api/invoices/:id/status` - Update invoice status

### Expenses
- `GET /api/expenses` - Retrieve expenses
- `POST /api/expenses` - Record new expense
- `GET /api/expenses/:id` - Retrieve expense details
- `PUT /api/expenses/:id` - Update expense

### Contacts
- `GET /api/customers` - List customers
- `POST /api/customers` - Add customer
- `GET /api/vendors` - List vendors
- `POST /api/vendors` - Add vendor

### Analytics
- `GET /api/reports/profit-loss` - Generate P&L report
- `GET /api/dashboard/stats` - Retrieve dashboard metrics

## 🚀 Production Deployment

Ready to deploy to a Linux server? See our comprehensive deployment guide:

**[📖 Linux Deployment Guide](DEPLOYMENT.md)**

### Quick Production Start

```bash
# On your Linux server
cd /var/www/AlmasaAccounting

# Backend
cd backend
npm install
npm run build
npm run start:prod

# Frontend  
cd ../frontend
npm install
npm run build
npm run start:prod
```

## 📄 License

Proprietary software by Almasa. All rights reserved.

## 🤝 Support

For support inquiries, please contact the Almasa development team.

---

**Built with ❤️ by Almasa**
