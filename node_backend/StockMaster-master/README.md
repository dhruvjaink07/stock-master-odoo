# StockMaster - Stock Management System

A production-ready stock management system with an immutable audit trail using Prisma ORM and Express.js.

## 🎯 One-Liner Module Summary

| Module | What Users Experience |
|--------|----------------------|
| **prisma/schema.prisma** | Zero SQL in code – every table, relation, index, decimal precision defined in one file |
| **stock.service.ts** | Perfect audit trail – impossible to change stock without StockLedger entry (exact example flow guaranteed) |
| **auth** | Register → login → receives JWT → every protected route works |
| **dashboard** | Landing page shows 8 KPI cards + live filters (warehouse/category/low-stock) → instant refresh |
| **products** | Search by SKU/name, create product with reorder threshold, see live stock per warehouse |
| **receipts** | Create receipt → validate → stock increases + ledger "Receipt +100 Kg" |
| **transfers** | Move stock between warehouses → total unchanged, ledger shows transfer |
| **deliveries** | Deliver to customer → stock decreases permanently, ledger "Delivery –20 Kg" |
| **adjustments** | Damage/expiry/correction → stock corrected, ledger "Adjustment –3 Kg" |
| **move-history** | Full immutable table exactly matching problem statement example (chronological + filters) |

## 📋 Project Structure

```
StockMaster-master/
├── prisma/
│   └── schema.prisma          # Single source of truth for all data models
├── src/
│   ├── index.ts               # Main Express app
│   ├── seed.ts                # Database seeding
│   ├── utils/
│   │   └── auth.ts            # JWT & password hashing utilities
│   ├── services/
│   │   └── stock.service.ts   # Core business logic with audit trail
│   └── routes/
│       ├── auth.routes.ts     # Register/Login endpoints
│       ├── products.routes.ts # Product CRUD + search
│       ├── receipts.routes.ts # Receipt validation & processing
│       ├── transfers.routes.ts# Warehouse transfers
│       ├── deliveries.routes.ts# Customer deliveries
│       ├── adjustments.routes.ts# Damage/Expiry corrections
│       ├── move-history.routes.ts# Audit trail queries
│       └── dashboard.routes.ts# KPI dashboard
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
├── .env.example               # Environment variables template
└── README.md                  # Documentation
```

## 🔑 Key Features

### 1. **Immutable Audit Trail**
- Every stock change creates a `StockLedger` entry
- Impossible to modify stock without an audit trail
- Tracks: Previous Qty → New Qty, Type (RECEIPT/TRANSFER/DELIVERY/ADJUSTMENT), Reference, Notes

### 2. **Atomic Transactions**
- All stock operations use Prisma transactions
- Receipt validation, transfers, deliveries are all-or-nothing
- Maintains data consistency across warehouses

### 3. **Role-Based Access**
- JWT authentication for all protected routes
- Three roles: ADMIN, MANAGER, USER
- Every sensitive operation requires authentication

### 4. **Decimal Precision**
- Support for both integer (units) and decimal (kg, liters) quantities
- Configurable per product
- Prevents rounding errors in stock calculations

### 5. **Real-Time Dashboard**
- 8 KPI cards showing system health
- Live filters for warehouse/category/low-stock
- Instant stock movement updates

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone & Setup**
```bash
cd StockMaster-master
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your database URL
DATABASE_URL="postgresql://user:password@localhost:5432/stockmaster"
JWT_SECRET="your-super-secret-jwt-key"
```

3. **Setup Database**
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed sample data
npm run seed
```

4. **Start Server**
```bash
# Development with auto-reload
npm run dev

# Production build
npm run build
npm run start
```

Server runs on `http://localhost:3000`

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/register    - Create new user
POST   /api/auth/login       - Get JWT token
GET    /api/auth/profile     - Get user profile (protected)
```

### Products
```
POST   /api/products         - Create product
GET    /api/products         - List all products
GET    /api/products/:id     - Get product with stock levels
GET    /api/products/search  - Search by SKU/name
PUT    /api/products/:id     - Update product
```

### Receipts
```
POST   /api/receipts         - Create receipt
GET    /api/receipts         - List receipts
GET    /api/receipts/:id     - Get receipt details
POST   /api/receipts/:id/validate  - Validate & process receipt
POST   /api/receipts/:id/reject    - Reject receipt
```

### Transfers
```
POST   /api/transfers        - Create inter-warehouse transfer
GET    /api/transfers        - List transfers
GET    /api/transfers/:id    - Get transfer details
POST   /api/transfers/:id/complete - Complete transfer
```

### Deliveries
```
POST   /api/deliveries       - Create customer delivery
GET    /api/deliveries       - List deliveries
GET    /api/deliveries/:id   - Get delivery details
POST   /api/deliveries/:id/pick    - Pick items for delivery
POST   /api/deliveries/:id/ship    - Ship delivery
POST   /api/deliveries/:id/complete - Complete delivery
POST   /api/deliveries/:id/cancel  - Cancel delivery
```

### Adjustments
```
POST   /api/adjustments      - Create stock adjustment
GET    /api/adjustments      - List adjustments
GET    /api/adjustments/:id  - Get adjustment details
POST   /api/adjustments/:id/approve - Approve & apply adjustment
POST   /api/adjustments/:id/reject  - Reject adjustment
```

### Stock History
```
GET    /api/move-history     - Full audit trail with filters
GET    /api/move-history/product/:productId - Product history
GET    /api/move-history/warehouse/:warehouseId - Warehouse history
GET    /api/move-history/summary/by-type - Summary by movement type
GET    /api/move-history/export/csv - Export audit trail
```

### Dashboard
```
GET    /api/dashboard        - 8 KPI cards
GET    /api/dashboard/low-stock - Low stock alerts
GET    /api/dashboard/warehouses - Warehouse capacity overview
GET    /api/dashboard/categories - Category breakdown
GET    /api/dashboard/recent-transactions - Recent movements
```

## 🔐 Authentication Example

1. **Register User**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure123",
    "name": "John Doe"
  }'
```

2. **Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure123"
  }'
# Response: { "token": "eyJhbGc..." }
```

3. **Use Token in Protected Route**
```bash
curl http://localhost:3000/api/products \
  -H "Authorization: Bearer eyJhbGc..."
```

## 📊 Stock Ledger Example

When you create a delivery for 20 units of Product A:

```json
{
  "id": "ledger-123",
  "type": "DELIVERY",
  "productId": "prod-A",
  "warehouseId": "wh-1",
  "quantity": -20,
  "previousQty": 100,
  "newQty": 80,
  "reference": "INV-2024-001",
  "notes": "Delivered to Customer XYZ",
  "createdAt": "2024-11-22T10:30:00Z"
}
```

Every entry is **immutable** – you can never delete or modify historical records.

## 🎯 Complete Flow Example

### Scenario: Receive 100 Kg of Coffee, Transfer 50 Kg, Deliver 20 Kg

1. **Create Receipt**
   - Receipt: REC-001, 100 Kg Coffee to Main Warehouse
   - Status: PENDING

2. **Validate Receipt**
   - Stock increases: 0 → 100 Kg
   - Ledger Entry: `type: RECEIPT, quantity: +100`

3. **Create Transfer**
   - Transfer: TRF-001, 50 Kg from Main → Secondary Warehouse
   - Status: PENDING

4. **Complete Transfer**
   - Main Warehouse: 100 → 50 Kg
   - Secondary Warehouse: 0 → 50 Kg
   - Ledger Entries: Two entries (one for each warehouse)

5. **Create Delivery**
   - Delivery: INV-001, 20 Kg to Customer
   - Status: PENDING

6. **Complete Delivery**
   - Main Warehouse: 50 → 30 Kg
   - Ledger Entry: `type: DELIVERY, quantity: -20`

### Final Ledger for Product
```
REC-001  | RECEIPT  |  +100 | 0   → 100
TRF-001  | TRANSFER |  -50  | 100 → 50
TRF-001  | TRANSFER |  +50  | 0   → 50
INV-001  | DELIVERY |  -20  | 30  → 10
```

## 🔍 Querying Audit Trail

**Get all movements for a product:**
```bash
curl "http://localhost:3000/api/move-history/product/prod-coffee"
```

**Filter by type:**
```bash
curl "http://localhost:3000/api/move-history?type=RECEIPT&limit=50"
```

**Export to CSV:**
```bash
curl "http://localhost:3000/api/move-history/export/csv" \
  -H "Authorization: Bearer {token}" > audit-trail.csv
```

## 📈 Dashboard KPIs

The dashboard shows:
1. **Total Stock Value** - Sum of (quantity × price)
2. **Total Quantity** - Across all warehouses
3. **Low Stock Alerts** - Count of items below threshold
4. **Warehouse Count** - Number of active warehouses
5. **Product Count** - Number of products
6. **Pending Receipts** - Not yet validated
7. **Pending Deliveries** - Not yet delivered
8. **Recent Movements** - Changes in last 24h

## 🛠️ Development

### Run Tests
```bash
npm test
```

### Generate Migration
```bash
npm run db:migrate -- --name add_new_column
```

### Reset Database
```bash
npm run db:push -- --skip-generate
```

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | `postgresql://user:pass@localhost/db` |
| JWT_SECRET | Secret key for JWT signing | `super-secret-key-min-32-chars` |
| JWT_EXPIRES_IN | Token expiration time | `24h`, `7d` |
| PORT | Server port | `3000` |
| NODE_ENV | Environment | `development`, `production` |

## 🚨 Error Handling

All endpoints follow this response format:

**Success (200)**
```json
{
  "message": "Success",
  "data": { ... }
}
```

**Error (400/500)**
```json
{
  "message": "Error description",
  "error": "Detailed error info"
}
```

## 📦 Database Schema Highlights

- **Zero SQL** - Everything defined in `prisma/schema.prisma`
- **Automatic indexes** on frequently queried fields
- **Foreign key cascades** for data integrity
- **Composite unique constraints** (productId + warehouseId)
- **Enums** for statuses and types (type-safe)
- **Decimal support** for precise stock quantities

## 🔒 Security

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens signed with environment secret
- All sensitive operations require authentication
- SQL injection protected (Prisma parameterized queries)
- CORS enabled for frontend integration

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**StockMaster v1.0.0** | Built with ❤️ for inventory management
