import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../utils/auth';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * RECEIPTS MODULE
 * Create receipt → validate → stock increases + ledger entry
 */

// Create receipt
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { receiptNumber, items, notes } = req.body;

    let totalQuantity = 0;
    items.forEach((item: any) => {
      totalQuantity += item.quantity;
    });

    const receipt = await prisma.receipt.create({
      data: {
        receiptNumber,
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
      message: 'Receipt created',
      receipt,
    });
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to create receipt', error: error.message });
  }
});

// Get all receipts
router.get('/', async (req: Request, res: Response) => {
  try {
    const receipts = await prisma.receipt.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(receipts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch receipts', error });
  }
});

// Get receipt by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const receipt = await prisma.receipt.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch receipt', error });
  }
});

// Validate receipt (process and update stock)
router.post('/:id/validate', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const receipt = await prisma.receipt.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    // Process each item: update stock level and create ledger entry
    for (const item of receipt.items) {
      const currentStock = await prisma.stockLevel.findFirst({
        where: {
          productId: item.productId,
          warehouseId: item.warehouseId,
        },
      });

      const previousQty = currentStock?.quantity || 0;
      const newQty = previousQty + item.quantity;

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
          type: 'RECEIPT',
          quantity: item.quantity,
          previousQty,
          newQty,
          reference: receipt.receiptNumber,
          notes: receipt.notes,
        },
      });
    }

    // Mark receipt as validated
    const updatedReceipt = await prisma.receipt.update({
      where: { id },
      data: { status: 'VALIDATED' },
      include: { items: true },
    });

    res.json({
      message: 'Receipt validated and stock updated',
      receipt: updatedReceipt,
    });
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to validate receipt', error: error.message });
  }
});

// Reject receipt
router.post('/:id/reject', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const receipt = await prisma.receipt.update({
      where: { id },
      data: { status: 'REJECTED' },
      include: { items: true },
    });

    res.json({
      message: 'Receipt rejected',
      receipt,
    });
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to reject receipt', error: error.message });
  }
});

export default router;
