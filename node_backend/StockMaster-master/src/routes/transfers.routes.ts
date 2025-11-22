import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../utils/auth';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * TRANSFERS MODULE
 * Move stock between warehouses → total unchanged, ledger shows transfer
 */

// Create transfer
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { transferNumber, fromWarehouseId, toWarehouseId, items } = req.body;

    const transfer = await prisma.transfer.create({
      data: {
        transferNumber,
        fromWarehouseId,
        toWarehouseId,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json({
      message: 'Transfer created',
      transfer,
    });
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to create transfer', error: error.message });
  }
});

// Get all transfers
router.get('/', async (req: Request, res: Response) => {
  try {
    const transfers = await prisma.transfer.findMany({
      include: {
        items: { include: { product: true } },
        fromWarehouse: true,
        toWarehouse: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transfers', error });
  }
});

// Get transfer by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transfer = await prisma.transfer.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        fromWarehouse: true,
        toWarehouse: true,
      },
    });

    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }

    res.json(transfer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transfer', error });
  }
});

// Complete transfer (process and update stocks)
router.post('/:id/complete', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transfer = await prisma.transfer.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }

    // Process each item
    for (const item of transfer.items) {
      // Verify source has enough stock
      const fromStock = await prisma.stockLevel.findFirst({
        where: {
          productId: item.productId,
          warehouseId: transfer.fromWarehouseId,
        },
      });

      if (!fromStock || fromStock.quantity < item.quantity) {
        return res.status(400).json({ message: 'Insufficient stock in source warehouse' });
      }

      // FROM warehouse: decrease
      const fromNewQty = fromStock.quantity - item.quantity;
      await prisma.stockLevel.update({
        where: { id: fromStock.id },
        data: { quantity: fromNewQty },
      });

      // Ledger: FROM warehouse
      await prisma.stockLedger.create({
        data: {
          productId: item.productId,
          warehouseId: transfer.fromWarehouseId,
          type: 'TRANSFER',
          quantity: -item.quantity,
          previousQty: fromStock.quantity,
          newQty: fromNewQty,
          reference: transfer.transferNumber,
          notes: `Transfer out to ${transfer.toWarehouseId}`,
        },
      });

      // TO warehouse: increase
      const toStock = await prisma.stockLevel.findFirst({
        where: {
          productId: item.productId,
          warehouseId: transfer.toWarehouseId,
        },
      });

      const toPreviousQty = toStock?.quantity || 0;
      const toNewQty = toPreviousQty + item.quantity;

      if (toStock) {
        await prisma.stockLevel.update({
          where: { id: toStock.id },
          data: { quantity: toNewQty },
        });
      } else {
        await prisma.stockLevel.create({
          data: {
            productId: item.productId,
            warehouseId: transfer.toWarehouseId,
            quantity: toNewQty,
          },
        });
      }

      // Ledger: TO warehouse
      await prisma.stockLedger.create({
        data: {
          productId: item.productId,
          warehouseId: transfer.toWarehouseId,
          type: 'TRANSFER',
          quantity: item.quantity,
          previousQty: toPreviousQty,
          newQty: toNewQty,
          reference: transfer.transferNumber,
          notes: `Transfer in from ${transfer.fromWarehouseId}`,
        },
      });
    }

    // Mark transfer as completed
    const updatedTransfer = await prisma.transfer.update({
      where: { id },
      data: { status: 'COMPLETED' },
      include: { items: true },
    });

    res.json({
      message: 'Transfer completed',
      transfer: updatedTransfer,
    });
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to complete transfer', error: error.message });
  }
});

export default router;
