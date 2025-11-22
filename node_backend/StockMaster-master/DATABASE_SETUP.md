# Database Setup Guide

StockMaster requires PostgreSQL 12 or higher. Follow the steps below for your operating system.

## Windows Setup

### Option 1: Install PostgreSQL Locally

1. **Download PostgreSQL**
   - Visit: https://www.postgresql.org/download/windows/
   - Download PostgreSQL 15 or 16

2. **Install PostgreSQL**
   - Run the installer
   - When prompted, set password for `postgres` user (remember this!)
   - Default port: 5432
   - **IMPORTANT**: During installation, check "Add PostgreSQL to PATH"

3. **Verify Installation**
   ```powershell
   psql --version
   ```

4. **Start PostgreSQL Service**
   - Open Services (services.msc)
   - Find "postgresql-x64-15" (or your version)
   - Right-click → Start

5. **Run Setup Script**
   ```powershell
   .\setup-db.bat
   ```
   - Enter `postgres` as username
   - Enter the password you set during installation
   - Script will create database and seed data

### Option 2: Use Docker (Recommended)

If you have Docker installed:

```powershell
docker run --name stockmaster-db `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=stockmaster `
  -p 5432:5432 `
  -d postgres:15

# Wait 10 seconds for container to start
Start-Sleep -Seconds 10

# Seed the database
npm run db:push
npm run seed
```

---

## macOS Setup

### Option 1: Using Homebrew (Recommended)

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Verify
psql --version
```

Then run:
```bash
chmod +x setup-db.sh
./setup-db.sh
```

### Option 2: Using Docker

```bash
docker run --name stockmaster-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=stockmaster \
  -p 5432:5432 \
  -d postgres:15

# Wait for container
sleep 10

# Seed database
npm run db:push
npm run seed
```

---

## Linux Setup (Ubuntu/Debian)

### Install PostgreSQL

```bash
# Update package list
sudo apt-get update

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib postgresql-client

# Start service
sudo systemctl start postgresql

# Enable on startup
sudo systemctl enable postgresql

# Verify
psql --version
```

### Setup StockMaster Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE stockmaster;

# Create user (optional, for better security)
CREATE USER stockmaster WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE stockmaster TO stockmaster;

# Exit
\q
```

Then run:
```bash
chmod +x setup-db.sh
./setup-db.sh
```

---

## Manual Database Setup

If you prefer to do it manually:

### 1. Create Database

**Windows (PowerShell):**
```powershell
$env:PGPASSWORD = "your-postgres-password"
psql -U postgres -h localhost -c "CREATE DATABASE stockmaster;"
```

**Mac/Linux:**
```bash
sudo -u postgres createdb stockmaster
```

### 2. Update .env File

```env
DATABASE_URL="postgresql://postgres:your-postgres-password@localhost:5432/stockmaster"
JWT_SECRET="your-super-secret-key-min-32-characters-long"
JWT_EXPIRES_IN="24h"
PORT=3000
NODE_ENV="development"
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Push Schema to Database

```bash
npm run db:push
```

### 5. Seed Sample Data

```bash
npm run seed
```

---

## Verify Setup

After setup, verify everything works:

```bash
# Start development server
npm run dev
```

Expected output:
```
✓ Server running on http://localhost:3000
✓ Database: postgresql://...
```

Then in another terminal:
```bash
# Test API
curl http://localhost:3000/health

# Should return:
# {"status":"ok","timestamp":"2024-11-22T..."}
```

---

## Troubleshooting

### "Can't reach database server at localhost:5432"

**Windows:**
1. Open Services (services.msc)
2. Search for "postgresql"
3. Right-click → Start

**Mac:**
```bash
brew services start postgresql@15
```

**Linux:**
```bash
sudo systemctl start postgresql
```

### "Connection refused"

- Check PostgreSQL is running: `psql -U postgres -c "\version"`
- Check port 5432 is not blocked by firewall
- Try: `telnet localhost 5432`

### "FATAL: password authentication failed"

- Verify password in `.env` matches PostgreSQL password
- Windows: During PostgreSQL install, you set a password
- Make sure password is correctly escaped if it contains special characters

### "Database already exists"

- This is OK, Prisma will use existing database
- Run `npm run db:push` to sync schema
- Run `npm run seed` to add sample data

### "Permission denied"

**Linux:** Make sure you're in the right group
```bash
sudo usermod -a -G postgres $USER
```

### Test Database Connection

```bash
# Replace credentials with yours
psql -U postgres -h localhost -d stockmaster -c "SELECT NOW();"
```

Should return current timestamp.

---

## Docker Alternative

If installing PostgreSQL locally is problematic:

```bash
docker run --name stockmaster-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=stockmaster \
  -e POSTGRES_USER=postgres \
  -p 5432:5432 \
  -d postgres:15

# Check it's running
docker logs stockmaster-db

# To stop: docker stop stockmaster-db
# To start again: docker start stockmaster-db
# To remove: docker rm stockmaster-db
```

---

## Next Steps

Once database is setup and running:

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Open Prisma Studio** (optional, visual database editor)
   ```bash
   npm run db:studio
   ```
   Visit: http://localhost:5555

3. **Test API**
   - Read: `QUICKSTART.md`
   - Read: `API_DOCUMENTATION.md`

4. **Sample Login Credentials**
   - Email: `admin@stockmaster.com`
   - Password: `admin123`

---

## Getting Help

- PostgreSQL Docs: https://www.postgresql.org/docs/
- Prisma Docs: https://www.prisma.io/docs/
- Connection String Help: https://www.prisma.io/docs/concepts/database-connectors/postgresql

---

Good luck! 🚀
