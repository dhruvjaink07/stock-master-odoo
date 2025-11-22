import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../utils/auth';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * PRODUCTS MODULE
 * SKU/Name search, create with reorder threshold, live stock per warehouse
 */

// Create product
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { sku, name, category, reorderThreshold, unitPrice, decimals, description } = req.body;

    const product = await prisma.product.create({
      data: {
        sku,
        name,
        category,
        reorderThreshold,
        unitPrice,
        decimals: decimals || 2,
        description,
      },
    });

    res.status(201).json({
      message: 'Product created',
      product,
    });
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to create product', error: error.message });
  }
});

// Search products by SKU or name
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { sku: { contains: query as string, mode: 'insensitive' } },
          { name: { contains: query as string, mode: 'insensitive' } },
        ],
      },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error });
  }
});

// Get all products with stock levels
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        stockLevels: {
          include: { warehouse: true },
        },
      },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
});

// Get product by ID with live stock
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        stockLevels: {
          include: { warehouse: true },
        },
        ledgers: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error });
  }
});

// Update product
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, reorderThreshold, unitPrice, description } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        category,
        reorderThreshold,
        unitPrice,
        description,
      },
    });

    res.json({
      message: 'Product updated',
      product,
    });
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to update product', error: error.message });
  }
});

export default router;
