# Quick Start Guide

Get StockMaster running in 5 minutes.

## 1. Install Dependencies (1 min)

```bash
npm install
```

## 2. Setup Database (2 min)

### Option A: PostgreSQL locally

1. **Start PostgreSQL**
```bash
# macOS with Homebrew
brew services start postgresql

# Linux
sudo service postgresql start

# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\data" start
```

2. **Create database**
```bash
createdb stockmaster
```

3. **Configure .env**
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/stockmaster"
JWT_SECRET="your-super-secret-key-min-32-chars-long"
PORT=3000
```

### Option B: Docker PostgreSQL

```bash
docker run --name stockmaster-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=stockmaster \
  -p 5432:5432 \
  -d postgres:15
```

Then in `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/stockmaster"
```

## 3. Initialize Database (1 min)

```bash
npm run db:generate
npm run db:migrate
npm run seed
```

## 4. Start Server (1 min)

```bash
npm run dev
```

Output:
```
✓ Server running on http://localhost:3000
✓ Database: postgresql://...
```

## 5. Test It Works

```bash
# Health check
curl http://localhost:3000/health

# API root
curl http://localhost:3000
```

---

## First Steps

### 1. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@stockmaster.com",
    "password": "demo123",
    "name": "Demo User"
  }'
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "email": "demo@stockmaster.com",
    "name": "Demo User"
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@stockmaster.com",
    "password": "demo123"
  }'
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "demo@stockmaster.com",
    "role": "USER"
  }
}
```

Save the token!

### 3. View Dashboard
```bash
curl http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer eyJhbGci..."
```

### 4. Create Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer eyJhbGci..." \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "DEMO-001",
    "name": "Demo Product",
    "category": "Demo",
    "reorderThreshold": 10,
    "unitPrice": 99.99,
    "decimals": 2
  }'
```

### 5. List Products
```bash
curl http://localhost:3000/api/products \
  -H "Authorization: Bearer eyJhbGci..."
```

---

## Complete Example Flow

### Scenario: Receive 100 units, deliver 20 units

#### Step 1: Create Receipt
```bash
TOKEN="eyJhbGci..." # Your token

curl -X POST http://localhost:3000/api/receipts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receiptNumber": "REC-2024-001",
    "notes": "Received from supplier",
    "items": [
      {
        "productId": "prod-001",  # Get from create product response
        "warehouseId": "wh-001",  # Get from seeded data
        "quantity": 100
      }
    ]
  }'
```

Response:
```json
{
  "receipt": {
    "id": "rec-001",
    "status": "PENDING",
    "receiptNumber": "REC-2024-001"
  }
}
```

#### Step 2: Validate Receipt (Stock increases)
```bash
curl -X POST http://localhost:3000/api/receipts/rec-001/validate \
  -H "Authorization: Bearer $TOKEN"
```

Stock is now 100 units. Check ledger:
```bash
curl "http://localhost:3000/api/move-history/product/prod-001" \
  -H "Authorization: Bearer $TOKEN"
```

#### Step 3: Create Delivery
```bash
curl -X POST http://localhost:3000/api/deliveries \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNumber": "INV-2024-001",
    "customerName": "Customer ABC",
    "customerEmail": "customer@example.com",
    "items": [
      {
        "productId": "prod-001",
        "warehouseId": "wh-001",
        "quantity": 20
      }
    ]
  }'
```

Response:
```json
{
  "delivery": {
    "id": "dlv-001",
    "status": "PENDING"
  }
}
```

#### Step 4: Complete Delivery (Stock decreases)
```bash
curl -X POST http://localhost:3000/api/deliveries/dlv-001/complete \
  -H "Authorization: Bearer $TOKEN"
```

Stock is now 80 units. Check audit trail:
```bash
curl "http://localhost:3000/api/move-history/product/prod-001" \
  -H "Authorization: Bearer $TOKEN"
```

Result shows:
```
RECEIPT  | +100 | 0   → 100
DELIVERY | -20  | 100 → 80
```

---

## Commands Reference

```bash
# Development
npm run dev              # Start with auto-reload

# Build & Production
npm run build           # Compile TypeScript
npm start               # Run production build

# Database
npm run db:generate     # Generate Prisma client
npm run db:migrate      # Run migrations
npm run db:push         # Push schema to DB
npm run db:studio       # Open Prisma Studio GUI

# Seeding
npm run seed            # Seed sample data
```

---

## Prisma Studio (Visual DB Editor)

Open visual database editor:
```bash
npm run db:studio
```

Browse tables, edit data, see relationships visually.

URL: http://localhost:5555

---

## Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npm install
npm run db:generate
```

### "Connection refused to database"
Check PostgreSQL is running:
```bash
# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Windows
sc query postgresql
```

### "Port 3000 already in use"
Change in `.env`:
```env
PORT=3001
```

### "Unique constraint failed"
Email or SKU already exists. Use different value.

### "JWT token expired"
Login again to get new token.

---

## Next Steps

1. **Read API Documentation**: See `API_DOCUMENTATION.md`
2. **Explore Dashboard**: Hit `/api/dashboard` endpoint
3. **Build Frontend**: Use the API with React/Vue/Angular
4. **Add Tests**: Write unit and integration tests
5. **Deploy**: Push to production with proper env vars

---

## Support

- 📚 Full API docs: `API_DOCUMENTATION.md`
- 📖 Project README: `README.md`
- 🗄️ Database schema: `prisma/schema.prisma`

---

Good luck! 🚀
