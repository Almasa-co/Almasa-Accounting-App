#!/bin/bash

# AlmasaAccounting - Linux Initialization Script
# This script creates environment files from examples

echo "🚀 Initializing Almasa Accounting App..."
echo ""

# Create backend .env file
if [ -f "backend/.env" ]; then
    echo "⚠️  backend/.env already exists, skipping..."
else
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
fi

# Create frontend .env.local file
if [ -f "frontend/.env.local" ]; then
    echo "⚠️  frontend/.env.local already exists, skipping..."
else
    echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > frontend/.env.local
    echo "✅ Created frontend/.env.local"
fi

echo ""
echo "✅ Environment files created!"
echo ""
echo "⚠️  IMPORTANT: Edit backend/.env file with your MySQL credentials!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your database password"
echo "2. Run: cd backend && npm install && npm run db:generate && npm run db:push && npm run db:seed"
echo "3. Run: cd frontend && npm install"
echo "4. Start backend: cd backend && npm run dev"
echo "5. Start frontend: cd frontend && npm run dev"
echo ""
echo "📖 See SETUP.md for detailed instructions"
echo "🐧 For production deployment on Linux, see DEPLOYMENT.md"
