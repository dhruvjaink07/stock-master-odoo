@echo off
REM StockMaster Database Setup Script for Windows
REM This script sets up PostgreSQL and initializes the database

setlocal enabledelayedexpansion

echo.
echo ============================================
echo   StockMaster Database Setup for Windows
echo ============================================
echo.

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] PostgreSQL is not installed or not in PATH
    echo.
    echo Please install PostgreSQL from:
    echo   https://www.postgresql.org/download/windows/
    echo.
    echo During installation, make sure to:
    echo   1. Add PostgreSQL to system PATH
    echo   2. Note the password you set for postgres user
    echo.
    pause
    exit /b 1
)

echo [OK] PostgreSQL found

REM Get PostgreSQL credentials
echo.
set /p PG_USER="PostgreSQL Username (default: postgres): "
if "!PG_USER!"=="" set PG_USER=postgres

set /p PG_PASSWORD="PostgreSQL Password: "

REM Create .env file
echo.
echo Creating .env file...

(
    echo DATABASE_URL=postgresql://!PG_USER!:!PG_PASSWORD!@localhost:5432/stockmaster
    echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
    echo JWT_EXPIRES_IN=24h
    echo PORT=3000
    echo NODE_ENV=development
) > .env

echo [OK] .env file created

REM Test database connection
echo.
echo Testing database connection...
set PGPASSWORD=!PG_PASSWORD!
psql -U !PG_USER! -h localhost -d postgres -c "SELECT version();" >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo [OK] Database connection successful
) else (
    echo [ERROR] Could not connect to PostgreSQL
    echo.
    echo Please check:
    echo   1. PostgreSQL service is running
    echo   2. Username and password are correct
    echo   3. PostgreSQL is listening on localhost:5432
    echo.
    pause
    exit /b 1
)

REM Create database
echo.
echo Creating database 'stockmaster'...

set PGPASSWORD=!PG_PASSWORD!
psql -U !PG_USER! -h localhost -d postgres -c "CREATE DATABASE stockmaster;" >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo [OK] Database created
) else (
    echo [WARNING] Database might already exist, continuing...
)

REM Run Prisma migrations
echo.
echo Running database migrations...
call npm run db:push

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Database migration failed
    pause
    exit /b 1
)

echo [OK] Database schema created

REM Seed database
echo.
echo Seeding database with sample data...
call npm run seed

if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Seeding encountered issues, but database is ready
) else (
    echo [OK] Database seeded with sample data
)

echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo Next steps:
echo   1. Start the server: npm run dev
echo   2. Visit: http://localhost:3000
echo   3. Read: QUICKSTART.md for API examples
echo.
echo Sample credentials (from seeding):
echo   Email: admin@stockmaster.com
echo   Password: admin123
echo.
pause
