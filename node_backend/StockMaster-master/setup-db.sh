#!/bin/bash

# StockMaster Database Setup Script
# This script sets up PostgreSQL and initializes the database

echo "🚀 StockMaster Database Setup"
echo "=============================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed!"
    echo ""
    echo "Please install PostgreSQL:"
    echo "  macOS: brew install postgresql@15"
    echo "  Windows: Download from https://www.postgresql.org/download/windows/"
    echo "  Linux: sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi

echo "✓ PostgreSQL found"

# Get PostgreSQL credentials
echo ""
echo "Enter PostgreSQL connection details:"
read -p "Username (default: postgres): " PG_USER
PG_USER=${PG_USER:-postgres}

read -sp "Password: " PG_PASSWORD
echo ""

# Create database
echo ""
echo "🔧 Creating database 'stockmaster'..."

PGPASSWORD="$PG_PASSWORD" psql -U "$PG_USER" -h localhost -c "CREATE DATABASE stockmaster;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Database created"
else
    echo "⚠ Database might already exist, continuing..."
fi

# Update .env
echo ""
echo "📝 Updating .env file..."
echo "DATABASE_URL=\"postgresql://$PG_USER:$PG_PASSWORD@localhost:5432/stockmaster\"" > .env
echo "JWT_SECRET=\"your-super-secret-jwt-key-change-this-in-production\"" >> .env
echo "JWT_EXPIRES_IN=\"24h\"" >> .env
echo "PORT=3000" >> .env
echo "NODE_ENV=\"development\"" >> .env
echo "✓ .env updated"

# Run migrations
echo ""
echo "🗄️  Running database migrations..."
npm run db:migrate -- --name init

# Seed database
echo ""
echo "🌱 Seeding database with sample data..."
npm run seed

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "  1. Start the server: npm run dev"
echo "  2. Visit: http://localhost:3000"
echo "  3. Read: QUICKSTART.md for API examples"
