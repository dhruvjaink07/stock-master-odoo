# StockMaster - Inventory Management System

A full-stack inventory management system built with Next.js, Node.js, Express, and MongoDB.

## Features

- **Authentication**: JWT-based login/signup with secure password hashing
- **Dashboard**: Real-time KPI cards and inventory overview
- **Products Management**: Full CRUD with multi-warehouse support
- **Operations Module**: Receipts, Deliveries, Transfers, and Adjustments
- **Move History**: Complete audit trail with ledger entries
- **Settings**: Warehouse management and user profile customization
- **Theme Support**: Light and dark mode with custom color palette

## Tech Stack

### Frontend
- **Next.js 16** with App Router
- **React 19** with TypeScript
- **TanStack Query** for data fetching and caching
- **Zustand** for global state management
- **Tailwind CSS v4** with custom theme
- **Shadcn UI** components

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication with bcrypt
- **Zod** for request validation
- **Auto-seeding** with sample data

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or connection URI

### Backend Setup

1. Navigate to backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create `.env` file:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Update `.env` with your MongoDB URI and JWT secret:
\`\`\`env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stockmaster
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
\`\`\`

5. Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

The backend will run on `http://localhost:5000` and auto-seed sample data.

### Frontend Setup

1. Install dependencies (in root directory):
\`\`\`bash
npm install
\`\`\`

2. Set environment variable for API base URL (already configured):
\`\`\`
NEXT_PUBLIC_API_BASE=http://localhost:5000
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The frontend will run on `http://localhost:3000`.

## API Integration

The frontend is fully integrated with the backend. All operations use real API calls:

- **Authentication**: `/api/auth/login`, `/api/auth/signup`
- **Products**: `/api/products` (GET, POST, PATCH, DELETE)
- **Warehouses**: `/api/warehouses` (GET, POST, PATCH, DELETE)
- **Operations**: `/api/operations/receipts`, `/api/operations/deliveries`, etc.
- **History**: `/api/history` with filtering
- **KPIs**: `/api/kpis` for dashboard metrics

All requests include JWT token in Authorization header. Token is stored in localStorage and automatically attached to requests.

## Sample Credentials

After backend starts with seed data, you can login with:
- **Email**: admin@stockmaster.com
- **Password**: admin123

Or create a new account via the Sign Up tab.

## Project Structure

\`\`\`
├── app/                    # Next.js pages
├── components/             # React components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and API layer
├── backend/
│   ├── src/
│   │   ├── config/        # Database config
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth & validation
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   └── utils/         # Helpers
│   └── server.js          # Express app entry
\`\`\`

## Key Features Implementation

### Real-time Stock Updates
All operations (receipts, deliveries, transfers, adjustments) automatically update product quantities and create ledger entries.

### Multi-warehouse Support
Products can be tracked across multiple warehouse locations with internal transfer operations.

### Audit Trail
Complete move history with all stock movements, including delta tracking and status management.

### Security
- Passwords hashed with bcrypt
- JWT tokens with 7-day expiration
- Protected routes with authentication middleware
- Input validation with Zod schemas

## Development

- Backend runs with nodemon for auto-restart on changes
- Frontend has hot reload with Next.js Fast Refresh
- All TypeScript with strict type checking

## License

MIT
