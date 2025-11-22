

## Backend README.md (Node.js / Express / Prisma template)

```markdown
# StockMaster – Backend API

RESTful API for StockMaster Inventory System  
Built with Node.js, Express, Prisma, PostgreSQL.

### Features
- JWT Authentication + OTP login
- Products, Warehouses, Operations CRUD
- Receipts, Deliveries, Internal Transfers, Adjustments
- Full move history & stock mutation logic
- Multi-warehouse support
- Reorder level alerts

### Tech Stack
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT + bcrypt
- Zod validation

### Quick Start
```bash
git clone <repo>
cd stockmaster-backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### API Endpoints (Base: /api)
POST   /auth/login  
POST   /auth/otp-verify  
GET    /kpis  
GET    /products  
GET    /history  
POST   /operations/receipts  
POST   /operations/deliveries  
POST   /operations/transfers  
POST   /operations/adjustments  
