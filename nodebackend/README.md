# StockMaster Backend API

Complete Node.js + Express + MongoDB backend for StockMaster Inventory Management System.

## Features

- JWT Authentication with bcrypt password hashing
- Complete CRUD operations for all entities
- Multi-warehouse support
- Automatic stock updates on operations
- Stock ledger for complete audit trail
- KPI dashboard endpoint
- Zod validation for all requests
- Role-based access control (admin, manager, staff)
- Auto-seed with sample data

## Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create `.env` file:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Update MongoDB connection string in `.env`:
\`\`\`
MONGODB_URI=mongodb://localhost:27017/stockmaster
JWT_SECRET=your-secret-key-here
\`\`\`

4. Start the server:
\`\`\`bash
npm run dev
\`\`\`

The server will start on `http://localhost:5000` and automatically seed the database with sample data.

## Default Admin Credentials

- Email: `admin@stockmaster.com`
- Password: `password123`

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user

### Users
- `GET /api/v1/users` - Get all users
- `POST /api/v1/users` - Create user (admin only)
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (admin only)

### Warehouses
- `GET /api/v1/warehouses` - Get all warehouses
- `POST /api/v1/warehouses` - Create warehouse
- `PUT /api/v1/warehouses/:id` - Update warehouse
- `DELETE /api/v1/warehouses/:id` - Delete warehouse

### Categories
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create category
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### Products
- `GET /api/v1/products` - Get all products (supports search, filters)
- `POST /api/v1/products` - Create product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Operations
- **Receipts**: `GET|POST|PUT|DELETE /api/v1/receipts/:id?`
- **Deliveries**: `GET|POST|PUT|DELETE /api/v1/deliveries/:id?`
- **Transfers**: `GET|POST|PUT|DELETE /api/v1/transfers/:id?`
- **Adjustments**: `GET|POST|PUT|DELETE /api/v1/adjustments/:id?`

### Reports
- `GET /api/v1/stock-ledger` - Get stock movement history
- `GET /api/v1/kpis` - Get dashboard KPIs

## Authentication

All protected routes require a Bearer token in the Authorization header:

\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Stock Operations

Each operation automatically:
1. Updates product quantity
2. Creates stock ledger entry with delta
3. Handles multi-warehouse inventory correctly

## Sample Data

The database is auto-seeded with:
- 1 Admin user
- 2 Warehouses (Main, Secondary)
- 2 Categories (Furniture, Raw Materials)
- 6 Products (Steel Rods, Chairs, Steel, Desks, Cables, Screws)

Products include varied stock levels to demonstrate low stock and out-of-stock scenarios.
