import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes';
import warehousesRoutes from './routes/warehouses.routes';
import productsRoutes from './routes/products.routes';
import receiptsRoutes from './routes/receipts.routes';
import transfersRoutes from './routes/transfers.routes';
import deliveriesRoutes from './routes/deliveries.routes';
import adjustmentsRoutes from './routes/adjustments.routes';
import moveHistoryRoutes from './routes/move-history.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/warehouses', warehousesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/receipts', receiptsRoutes);
app.use('/api/transfers', transfersRoutes);
app.use('/api/deliveries', deliveriesRoutes);
app.use('/api/adjustments', adjustmentsRoutes);
app.use('/api/move-history', moveHistoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'StockMaster API',
    version: '1.0.0',
    description: 'Stock Management System with Immutable Audit Trail',
    endpoints: {
      auth: '/api/auth',
      warehouses: '/api/warehouses',
      products: '/api/products',
      receipts: '/api/receipts',
      transfers: '/api/transfers',
      deliveries: '/api/deliveries',
      adjustments: '/api/adjustments',
      moveHistory: '/api/move-history',
      dashboard: '/api/dashboard',
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Database: ${process.env.DATABASE_URL}`);
});

export default app;
