# Automatic Database Setup

## Overview

The Almasa Accounting App backend now includes **automatic database initialization**. When you start the server, it will automatically:

1. ✅ Connect to the database
2. ✅ Check if tables exist
3. ✅ Create all required tables if they don't exist
4. ✅ Run migrations to update schema
5. ✅ Optionally load seed data

## How It Works

### Automatic Migration on Startup

When you run `npm run dev` or `npm start`, the server will:

```
🔄 Checking database connection...
✅ Database connection successful
🔄 Checking database schema...
📦 Database schema not found. Running migrations...
✅ Database migrations completed successfully
🌱 Checking for seed data...
✅ Seed data loaded successfully
⚡️ Server is running at http://localhost:5000
📊 Accounting API ready
```

### What Gets Created

The following tables are automatically created:

- **users** - User accounts and authentication
- **customers** - Customer information
- **vendors** - Vendor/supplier information
- **invoices** - Invoice records
- **invoice_items** - Line items for invoices
- **expenses** - Expense records
- **expense_items** - Line items for expenses
- **expense_categories** - Expense categorization
- **taxes** - Tax rates and configurations
- **currencies** - Multi-currency support
- **payments** - Payment records
- **settings** - Application settings

## Prerequisites

### 1. MySQL Database

Make sure you have MySQL installed and running:

**Windows (XAMPP):**
```bash
# Start MySQL from XAMPP Control Panel
# Or use command line:
cd C:\xampp
.\mysql_start.bat
```

**Linux:**
```bash
sudo systemctl start mysql
# or
sudo service mysql start
```

### 2. Database Configuration

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="mysql://root:password@localhost:3306/accounting_db"
JWT_SECRET="your-secret-key-here"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

**Important:** Replace `password` with your MySQL root password (or leave empty if no password).

### 3. Create Database (Optional)

The app can create the database automatically, but you can also create it manually:

```sql
CREATE DATABASE accounting_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Usage

### First Time Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your MySQL credentials

3. **Start the server:**
   ```bash
   npm run dev
   ```

That's it! The database tables will be created automatically.

### Manual Migration Commands

If you prefer to run migrations manually:

```bash
# Generate Prisma Client
npm run db:generate

# Create and apply migration
npm run db:migrate

# Push schema without migration (development)
npm run db:push

# Load seed data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

## Migration Strategies

The automatic setup uses two strategies:

### 1. Production Mode (migrate deploy)
- Uses migration files from `prisma/migrations/`
- Safe for production
- Tracks migration history
- Command: `npx prisma migrate deploy`

### 2. Development Fallback (db push)
- If migrations fail, uses `db push`
- Faster for development
- Doesn't track history
- Command: `npx prisma db push`

## Troubleshooting

### Database Connection Failed

```
❌ Can't reach database server at localhost:3306
```

**Solution:**
- Make sure MySQL is running
- Check your `DATABASE_URL` in `.env`
- Verify MySQL port (default: 3306)

### Migration Failed

```
❌ Migration failed: ...
```

**Solution:**
- Check database user permissions
- Ensure database exists
- Try manual migration: `npm run db:migrate`

### Tables Already Exist

```
✅ Database schema is up to date
```

This is normal! The app detected existing tables and skipped migration.

### Reset Database

To start fresh:

```bash
# Drop all tables and recreate
npx prisma migrate reset

# Or manually drop database
mysql -u root -p
DROP DATABASE accounting_db;
CREATE DATABASE accounting_db;
```

## Development Workflow

### Adding New Tables/Fields

1. **Update Prisma Schema:**
   Edit `prisma/schema.prisma`

2. **Create Migration:**
   ```bash
   npm run db:migrate
   ```

3. **Restart Server:**
   The changes will be applied automatically on next startup

### Seed Data

Initial data is loaded from `prisma/seed.ts`:
- Default admin user
- Sample currencies (USD, EUR, etc.)
- Sample tax rates
- Sample expense categories

## Production Deployment

For production environments:

1. **Set Environment Variables:**
   ```env
   DATABASE_URL="mysql://user:pass@production-host:3306/accounting_db"
   NODE_ENV="production"
   ```

2. **Build Application:**
   ```bash
   npm run build
   ```

3. **Start Server:**
   ```bash
   npm start
   ```

The automatic migration will run on first startup.

## Security Notes

- ⚠️ Never commit `.env` file to version control
- ⚠️ Use strong passwords for production databases
- ⚠️ Restrict database user permissions in production
- ⚠️ Enable SSL for database connections in production

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [MySQL Documentation](https://dev.mysql.com/doc/)
