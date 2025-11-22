import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../utils/auth';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * ADJUSTMENTS MODULE
 * Damage/expiry/correction → stock corrected, ledger entry
 */

// Create adjustment
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { adjustmentNumber, reason, items, notes } = req.body;

    let totalQuantity = 0;
    items.forEach((item: any) => {
      totalQuantity += Math.abs(item.quantity);
    });

    const adjustment = await prisma.adjustment.create({
      data: {
        adjustmentNumber,
        reason,
        status: 'PENDING',
        totalQuantity,
        notes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            warehouseId: item.warehouseId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json({
      message: 'Adjustment created',
      adjustment,
    });
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to create adjustment', error: error.message });
  }
});

// Get all adjustments
router.get('/', async (req: Request, res: Response) => {
  try {
    const { reason, status } = req.query;

    const adjustments = await prisma.adjustment.findMany({
      where: {
        ...(reason && { reason: reason as any }),
        ...(status && { status: status as any }),
      },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(adjustments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch adjustments', error });
  }
});

// Get adjustment by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const adjustment = await prisma.adjustment.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!adjustment) {
      return res.status(404).json({ message: 'Adjustment not found' });
    }

    res.json(adjustment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch adjustment', error });
  }
});

// Approve adjustment (apply changes and create ledger entries)
router.post('/:id/approve', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const adjustment = await prisma.adjustment.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!adjustment) {
      return res.status(404).json({ message: 'Adjustment not found' });
    }

    // Process each item
    for (const item of adjustment.items) {
      const currentStock = await prisma.stockLevel.findFirst({
        where: {
          productId: item.productId,
          warehouseId: item.warehouseId,
        },
      });

      const previousQty = currentStock?.quantity || 0;
      const newQty = previousQty + item.quantity;

      // Validate no negative stock
      if (newQty < 0) {
        return res.status(400).json({ message: 'Adjustment would result in negative stock' });
      }

      // Update or create stock level
      if (currentStock) {
        await prisma.stockLevel.update({
          where: { id: currentStock.id },
          data: { quantity: newQty },
        });
      } else {
        await prisma.stockLevel.create({
          data: {
            productId: item.productId,
            warehouseId: item.warehouseId,
            quantity: newQty,
          },
        });
      }

      // Create ledger entry
      await prisma.stockLedger.create({
        data: {
          productId: item.productId,
          warehouseId: item.warehouseId,
          type: 'ADJUSTMENT',
          quantity: item.quantity,
          previousQty,
          newQty,
          reference: adjustment.adjustmentNumber,
          notes: `${adjustment.reason}: ${adjustment.notes}`,
        },
      });
    }

    // Mark adjustment as approved
    const updatedAdjustment = await prisma.adjustment.update({
      where: { id },
      data: { status: 'APPROVED' },
      include: { items: true },
    });

    res.json({
      message: 'Adjustment approved and applied',
      adjustment: updatedAdjustment,
    });
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to approve adjustment', error: error.message });
  }
});

// Reject adjustment
router.post('/:id/reject', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const adjustment = await prisma.adjustment.update({
      where: { id },
      data: { status: 'REJECTED' },
      include: { items: true },
    });

    res.json({
      message: 'Adjustment rejected',
      adjustment,
    });
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to reject adjustment', error: error.message });
  }
});

export default router;
