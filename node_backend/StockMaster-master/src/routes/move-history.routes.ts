import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../utils/auth';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * MOVE HISTORY / STOCK LEDGER MODULE
 * Full immutable table - chronological + filters
 * Shows every change: Receipt +100, Transfer –50, Delivery –20, Adjustment –3
 */

// Get full stock movement history (immutable audit trail)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { productId, warehouseId, type, startDate, endDate, limit = 100 } = req.query;

    const whereClause: any = {};

    if (productId) whereClause.productId = productId as string;
    if (warehouseId) whereClause.warehouseId = warehouseId as string;
    if (type) whereClause.type = type as string;

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate as string);
      if (endDate) whereClause.createdAt.lte = new Date(endDate as string);
    }

    const movements = await prisma.stockLedger.findMany({
      where: whereClause,
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string) || 100,
    });

    res.json({
      total: movements.length,
      movements,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stock movements', error });
  }
});

// Get movement history for a specific product
router.get('/product/:productId', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { warehouseId, limit = 100 } = req.query;

    const movements = await prisma.stockLedger.findMany({
      where: {
        productId,
        ...(warehouseId && { warehouseId: warehouseId as string }),
      },
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string) || 100,
    });

    if (movements.length === 0) {
      return res.status(404).json({ message: 'No movements found for this product' });
    }

    // Calculate running balance
    const withBalance = movements
      .reverse()
      .map((m, index) => ({
        ...m,
        runningBalance: movements.slice(0, index + 1).reduce((sum, mv) => sum + mv.quantity, 0),
      }))
      .reverse();

    res.json({
      product: movements[0].product,
      total: movements.length,
      movements: withBalance,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product movements', error });
  }
});

// Get movement history for a specific warehouse
router.get('/warehouse/:warehouseId', async (req: Request, res: Response) => {
  try {
    const { warehouseId } = req.params;
    const { type, limit = 100 } = req.query;

    const movements = await prisma.stockLedger.findMany({
      where: {
        warehouseId,
        ...(type && { type: type as any }),
      },
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string) || 100,
    });

    if (movements.length === 0) {
      return res.status(404).json({ message: 'No movements found for this warehouse' });
    }

    // Group by type
    const byType: any = {};
    movements.forEach((m) => {
      if (!byType[m.type]) byType[m.type] = [];
      byType[m.type].push(m);
    });

    res.json({
      warehouse: movements[0]?.warehouse || { warehouseId },
      total: movements.length,
      byType,
      movements,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch warehouse movements', error });
  }
});

// Get movement summary by type (RECEIPT, TRANSFER, DELIVERY, ADJUSTMENT)
router.get('/summary/by-type', async (req: Request, res: Response) => {
  try {
    const { productId, warehouseId, startDate, endDate } = req.query;

    const movements = await prisma.stockLedger.findMany({
      where: {
        ...(productId && { productId: productId as string }),
        ...(warehouseId && { warehouseId: warehouseId as string }),
        ...(startDate || endDate) && {
          createdAt: {
            ...(startDate && { gte: new Date(startDate as string) }),
            ...(endDate && { lte: new Date(endDate as string) }),
          },
        },
      },
    });

    const summary: any = {
      RECEIPT: { count: 0, totalQuantity: 0 },
      TRANSFER: { count: 0, totalQuantity: 0 },
      DELIVERY: { count: 0, totalQuantity: 0 },
      ADJUSTMENT: { count: 0, totalQuantity: 0 },
    };

    movements.forEach((m) => {
      summary[m.type].count += 1;
      summary[m.type].totalQuantity += m.quantity;
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch summary', error });
  }
});

// Get detailed ledger entry
router.get('/entry/:entryId', async (req: Request, res: Response) => {
  try {
    const { entryId } = req.params;

    const movement = await prisma.stockLedger.findUnique({
      where: { id: entryId },
      include: {
        product: true,
        warehouse: true,
      },
    });

    if (!movement) {
      return res.status(404).json({ message: 'Ledger entry not found' });
    }

    res.json(movement);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch ledger entry', error });
  }
});

// Export ledger to CSV
router.get('/export/csv', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { productId, warehouseId, type } = req.query;

    const movements = await prisma.stockLedger.findMany({
      where: {
        ...(productId && { productId: productId as string }),
        ...(warehouseId && { warehouseId: warehouseId as string }),
        ...(type && { type: type as any }),
      },
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Generate CSV
    let csv = 'Date,Type,Product SKU,Product Name,Warehouse,Quantity,Previous Qty,New Qty,Reference,Notes\n';

    movements.forEach((m) => {
      csv += `"${m.createdAt.toISOString()}","${m.type}","${m.product?.sku || ''}","${m.product?.name || ''}","${m.warehouse?.name || ''}","${m.quantity}","${m.previousQty}","${m.newQty}","${m.reference || ''}","${m.notes || ''}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="stock-ledger.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Failed to export ledger', error });
  }
});

export default router;
