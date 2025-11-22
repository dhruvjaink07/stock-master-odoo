import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../utils/auth';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * WAREHOUSES MODULE
 * Manage warehouse locations and capacity
 */

// Create warehouse
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, location, capacity } = req.body;

    const warehouse = await prisma.warehouse.create({
      data: {
        name,
        location,
        capacity,
      },
    });

    res.status(201).json({
      message: 'Warehouse created',
      warehouse,
    });
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to create warehouse', error: error.message });
  }
});

// Get all warehouses
router.get('/', async (req: Request, res: Response) => {
  try {
    const warehouses = await prisma.warehouse.findMany({
      include: {
        products: {
          include: { product: true },
        },
      },
    });

    const withStats = await Promise.all(
      warehouses.map(async (w: any) => {
        const totalStock = w.products.reduce((sum: any, sl: any) => sum + sl.quantity, 0);
        const usedCapacity = (totalStock / w.capacity) * 100;

        return {
          ...w,
          totalStock: Number(totalStock.toFixed(2)),
          usedCapacity: Number(usedCapacity.toFixed(2)),
          availableCapacity: Number((w.capacity - totalStock).toFixed(2)),
          productCount: w.products.length,
        };
      })
    );

    res.json(withStats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch warehouses', error });
  }
});

// Get warehouse by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      include: {
        products: {
          include: { product: true },
        },
      },
    });

    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }

    const totalStock = warehouse.products.reduce((sum: any, sl: any) => sum + sl.quantity, 0);

    res.json({
      ...warehouse,
      totalStock: Number(totalStock.toFixed(2)),
      usedCapacity: Number(((totalStock / warehouse.capacity) * 100).toFixed(2)),
      availableCapacity: Number((warehouse.capacity - totalStock).toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch warehouse', error });
  }
});

// Update warehouse
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, location, capacity } = req.body;

    const warehouse = await prisma.warehouse.update({
      where: { id },
      data: {
        name,
        location,
        capacity,
      },
    });

    res.json({
      message: 'Warehouse updated',
      warehouse,
    });
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to update warehouse', error: error.message });
  }
});

// Get warehouse stock levels
router.get('/:id/stock', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const stockLevels = await prisma.stockLevel.findMany({
      where: { warehouseId: id },
      include: { product: true },
    });

    res.json({
      warehouseId: id,
      total: stockLevels.length,
      items: stockLevels,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch warehouse stock', error });
  }
});

export default router;
