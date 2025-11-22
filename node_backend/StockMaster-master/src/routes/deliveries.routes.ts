import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../utils/auth';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * DELIVERIES MODULE
 * Deliver to customer → stock decreases permanently, ledger entry
 */

// Create delivery
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { invoiceNumber, customerName, customerEmail, items, notes } = req.body;

    let totalQuantity = 0;
    items.forEach((item: any) => {
      totalQuantity += item.quantity;
    });

    const delivery = await prisma.delivery.create({
      data: {
        invoiceNumber,
        customerName,
        customerEmail,
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
      message: 'Delivery created',
      delivery,
    });
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to create delivery', error: error.message });
  }
});

// Get all deliveries
router.get('/', async (req: Request, res: Response) => {
  try {
    const deliveries = await prisma.delivery.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch deliveries', error });
  }
});

// Get delivery by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const delivery = await prisma.delivery.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch delivery', error });
  }
});

// Process delivery (pick items from stock)
router.post('/:id/pick', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const delivery = await prisma.delivery.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    // Verify all items have sufficient stock
    for (const item of delivery.items) {
      const stock = await prisma.stockLevel.findFirst({
        where: {
          productId: item.productId,
          warehouseId: item.warehouseId,
        },
      });

      if (!stock || stock.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.productId}` });
      }
    }

    // Update delivery status
    const updatedDelivery = await prisma.delivery.update({
      where: { id },
      data: { status: 'PICKED' },
      include: { items: true },
    });

    res.json({
      message: 'Delivery items picked',
      delivery: updatedDelivery,
    });
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to pick delivery', error: error.message });
  }
});

// Ship delivery
router.post('/:id/ship', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const delivery = await prisma.delivery.update({
      where: { id },
      data: { status: 'SHIPPED' },
      include: { items: true },
    });

    res.json({
      message: 'Delivery shipped',
      delivery,
    });
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to ship delivery', error: error.message });
  }
});

// Complete delivery (permanent stock reduction + ledger entry)
router.post('/:id/complete', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const delivery = await prisma.delivery.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    // Process each item: decrease stock and create ledger entry
    for (const item of delivery.items) {
      const currentStock = await prisma.stockLevel.findFirst({
        where: {
          productId: item.productId,
          warehouseId: item.warehouseId,
        },
      });

      if (!currentStock || currentStock.quantity < item.quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }

      const newQty = currentStock.quantity - item.quantity;

      // Update stock level
      await prisma.stockLevel.update({
        where: { id: currentStock.id },
        data: { quantity: newQty },
      });

      // Create ledger entry (immutable)
      await prisma.stockLedger.create({
        data: {
          productId: item.productId,
          warehouseId: item.warehouseId,
          type: 'DELIVERY',
          quantity: -item.quantity,
          previousQty: currentStock.quantity,
          newQty,
          reference: delivery.invoiceNumber,
          notes: `Delivered to ${delivery.customerName}`,
        },
      });
    }

    // Mark delivery as complete
    const updatedDelivery = await prisma.delivery.update({
      where: { id },
      data: { status: 'DELIVERED' },
      include: { items: true },
    });

    res.json({
      message: 'Delivery completed and stock reduced',
      delivery: updatedDelivery,
    });
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to complete delivery', error: error.message });
  }
});

// Cancel delivery
router.post('/:id/cancel', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const delivery = await prisma.delivery.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: { items: true },
    });

    res.json({
      message: 'Delivery cancelled',
      delivery,
    });
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to cancel delivery', error: error.message });
  }
});

export default router;
