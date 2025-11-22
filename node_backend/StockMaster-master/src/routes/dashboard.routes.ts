import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../utils/auth';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * DASHBOARD MODULE
 * 8 KPI cards + live filters (warehouse/category/low-stock)
 */

// Main dashboard KPI
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { warehouseId, category } = req.query;

    // 1. Total stock value across system
    const stockLevels = await prisma.stockLevel.findMany({
      where: {
        ...(warehouseId && { warehouseId: warehouseId as string }),
        ...(category && { product: { category: category as string } }),
      },
      include: { product: true },
    });

    const totalStockValue = stockLevels.reduce(
      (sum, sl) => sum + sl.quantity * sl.product.unitPrice,
      0
    );

    // 2. Total quantity in stock
    const totalQuantity = stockLevels.reduce((sum, sl) => sum + sl.quantity, 0);

    // 3. Low stock alerts
    const lowStockItems = stockLevels.filter(
      (sl) => sl.quantity < sl.product.reorderThreshold
    );

    // 4. Number of warehouses
    const warehouseCount = await prisma.warehouse.count();

    // 5. Number of products
    const productCount = await prisma.product.count({
      where: category ? { category: category as string } : undefined,
    });

    // 6. Pending receipts
    const pendingReceipts = await prisma.receipt.count({
      where: { status: 'PENDING' },
    });

    // 7. Pending deliveries
    const pendingDeliveries = await prisma.delivery.count({
      where: { status: { in: ['PENDING', 'PICKED', 'SHIPPED'] } },
    });

    // 8. Recent stock movements (last 24h)
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentMovements = await prisma.stockLedger.count({
      where: { createdAt: { gte: last24h } },
    });

    res.json({
      kpis: {
        totalStockValue: Number(totalStockValue.toFixed(2)),
        totalQuantity: Number(totalQuantity.toFixed(2)),
        lowStockAlerts: lowStockItems.length,
        warehouseCount,
        productCount,
        pendingReceipts,
        pendingDeliveries,
        recentMovements24h: recentMovements,
      },
      filters: {
        appliedWarehouse: warehouseId || 'all',
        appliedCategory: category || 'all',
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard', error });
  }
});

// Get KPI details - low stock products
router.get('/low-stock', async (req: Request, res: Response) => {
  try {
    const { warehouseId } = req.query;

    const stockLevels = await prisma.stockLevel.findMany({
      where: {
        ...(warehouseId && { warehouseId: warehouseId as string }),
      },
      include: {
        product: true,
        warehouse: true,
      },
    });

    const lowStock = stockLevels
      .filter((sl) => sl.quantity < sl.product.reorderThreshold)
      .sort((a, b) => a.quantity - b.quantity);

    res.json({
      count: lowStock.length,
      items: lowStock,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch low stock alerts', error });
  }
});

// Get KPI details - warehouse overview
router.get('/warehouses', async (req: Request, res: Response) => {
  try {
    const warehouses = await prisma.warehouse.findMany({
      include: {
        products: {
          include: { product: true },
        },
      },
    });

    const warehouseStats = await Promise.all(
      warehouses.map(async (w) => {
        const totalStock = w.products.reduce((sum, sl) => sum + sl.quantity, 0);
        const usedCapacity = (totalStock / w.capacity) * 100;
        const productCount = w.products.length;

        return {
          id: w.id,
          name: w.name,
          location: w.location,
          capacity: w.capacity,
          currentStock: Number(totalStock.toFixed(2)),
          usedCapacity: Number(usedCapacity.toFixed(2)),
          availableCapacity: Number((w.capacity - totalStock).toFixed(2)),
          productCount,
        };
      })
    );

    res.json({
      total: warehouseStats.length,
      warehouses: warehouseStats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch warehouse overview', error });
  }
});

// Get KPI details - category breakdown
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { stockLevels: true },
    });

    const categoryStats: any = {};

    products.forEach((p) => {
      if (!categoryStats[p.category]) {
        categoryStats[p.category] = {
          productCount: 0,
          totalStock: 0,
          totalValue: 0,
        };
      }

      categoryStats[p.category].productCount += 1;

      p.stockLevels.forEach((sl) => {
        categoryStats[p.category].totalStock += sl.quantity;
        categoryStats[p.category].totalValue += sl.quantity * p.unitPrice;
      });
    });

    const categoriesArray = Object.entries(categoryStats).map(([name, stats]: any) => ({
      name,
      productCount: stats.productCount,
      totalStock: Number(stats.totalStock.toFixed(2)),
      totalValue: Number(stats.totalValue.toFixed(2)),
    }));

    res.json({
      total: categoriesArray.length,
      categories: categoriesArray,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch category breakdown', error });
  }
});

// Get KPI details - recent transactions
router.get('/recent-transactions', async (req: Request, res: Response) => {
  try {
    const { type, limit = 20 } = req.query;

    const movements = await prisma.stockLedger.findMany({
      where: type ? { type: type as any } : undefined,
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string) || 20,
    });

    res.json({
      total: movements.length,
      transactions: movements,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recent transactions', error });
  }
});

export default router;
