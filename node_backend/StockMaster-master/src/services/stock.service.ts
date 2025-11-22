import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Stock Service - All operations create immutable audit trail
 * Note: Using MongoDB without replica set, so no transactions
 */

export class StockService {
  /**
   * RECEIPT: Receive goods into warehouse
   */
  async processReceipt(receiptId: string) {
    try {
      const receipt = await prisma.receipt.findUnique({
        where: { id: receiptId },
        include: { items: true },
      });

      if (!receipt) throw new Error('Receipt not found');

      for (const item of receipt.items) {
        const currentStock = await prisma.stockLevel.findFirst({
          where: {
            productId: item.productId,
            warehouseId: item.warehouseId,
          },
        });

        const previousQty = currentStock?.quantity || 0;
        const newQty = previousQty + item.quantity;

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

      await prisma.receipt.update({
        where: { id: receiptId },
        data: { status: 'VALIDATED' },
      });

      return { success: true, message: 'Receipt processed' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * TRANSFER: Move stock between warehouses
   */
  async processTransfer(transferId: string) {
    try {
      const transfer = await prisma.transfer.findUnique({
        where: { id: transferId },
        include: { items: true },
      });

      if (!transfer) throw new Error('Transfer not found');

      for (const item of transfer.items) {
        const fromStock = await prisma.stockLevel.findFirst({
          where: {
            productId: item.productId,
            warehouseId: transfer.fromWarehouseId,
          },
        });

        if (!fromStock || fromStock.quantity < item.quantity) {
          throw new Error(`Insufficient stock in source warehouse`);
        }

        const fromNewQty = fromStock.quantity - item.quantity;
        await prisma.stockLevel.update({
          where: { id: fromStock.id },
          data: { quantity: fromNewQty },
        });

        await prisma.stockLedger.create({
          data: {
            productId: item.productId,
            warehouseId: transfer.fromWarehouseId,
            type: 'TRANSFER',
            quantity: -item.quantity,
            previousQty: fromStock.quantity,
            newQty: fromNewQty,
            reference: transfer.transferNumber,
            notes: 'Transfer out',
          },
        });

        // To warehouse: INCREASE
        const toStock = await prisma.stockLevel.findFirst({
          where: {
            productId: item.productId,
            warehouseId: transfer.toWarehouseId,
          },
        });

        const toNewQty = (toStock?.quantity || 0) + item.quantity;

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

        await prisma.stockLedger.create({
          data: {
            productId: item.productId,
            warehouseId: transfer.toWarehouseId,
            type: 'TRANSFER',
            quantity: item.quantity,
            previousQty: toStock?.quantity || 0,
            newQty: toNewQty,
            reference: transfer.transferNumber,
            notes: 'Transfer in',
          },
        });
      }

      await prisma.transfer.update({
        where: { id: transferId },
        data: { status: 'COMPLETED' },
      });

      return { success: true, message: 'Transfer processed' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * DELIVERY: Ship goods out of warehouse
   */
  async processDelivery(deliveryId: string) {
    try {
      const delivery = await prisma.delivery.findUnique({
        where: { id: deliveryId },
        include: { items: true },
      });

      if (!delivery) throw new Error('Delivery not found');

      for (const item of delivery.items) {
        const currentStock = await prisma.stockLevel.findFirst({
          where: {
            productId: item.productId,
            warehouseId: item.warehouseId,
          },
        });

        if (!currentStock || currentStock.quantity < item.quantity) {
          throw new Error(`Insufficient stock for delivery`);
        }

        const previousQty = currentStock.quantity;
        const newQty = previousQty - item.quantity;

        await prisma.stockLevel.update({
          where: { id: currentStock.id },
          data: { quantity: newQty },
        });

        await prisma.stockLedger.create({
          data: {
            productId: item.productId,
            warehouseId: item.warehouseId,
            type: 'DELIVERY',
            quantity: -item.quantity,
            previousQty,
            newQty,
            reference: delivery.invoiceNumber,
            notes: `Delivery to ${delivery.customerName}`,
          },
        });
      }

      await prisma.delivery.update({
        where: { id: deliveryId },
        data: { status: 'DELIVERED' },
      });

      return { success: true, message: 'Delivery processed' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * ADJUSTMENT: Correct inventory discrepancies
   */
  async processAdjustment(adjustmentId: string) {
    try {
      const adjustment = await prisma.adjustment.findUnique({
        where: { id: adjustmentId },
        include: { items: true },
      });

      if (!adjustment) throw new Error('Adjustment not found');

      for (const item of adjustment.items) {
        const currentStock = await prisma.stockLevel.findFirst({
          where: {
            productId: item.productId,
            warehouseId: item.warehouseId,
          },
        });

        const previousQty = currentStock?.quantity || 0;
        const newQty = previousQty + item.quantity;

        if (newQty < 0) {
          throw new Error('Adjustment would result in negative stock');
        }

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

      await prisma.adjustment.update({
        where: { id: adjustmentId },
        data: { status: 'APPROVED' },
      });

      return { success: true, message: 'Adjustment processed' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET: Current stock level with product details
   */
  async getStockLevel(productId: string, warehouseId: string) {
    try {
      const stock = await prisma.stockLevel.findFirst({
        where: {
          productId,
          warehouseId,
        },
        include: {
          product: true,
          warehouse: true,
        },
      });

      return stock;
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET: Stock history/audit trail
   */
  async getStockHistory(productId?: string, warehouseId?: string, limit: number = 100) {
    try {
      const movements = await prisma.stockLedger.findMany({
        where: {
          ...(productId && { productId }),
          ...(warehouseId && { warehouseId }),
        },
        include: {
          product: true,
          warehouse: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return movements;
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET: Low stock alerts
   */
  async getLowStockAlerts() {
    try {
      const stockLevels = await prisma.stockLevel.findMany({
        include: {
          product: true,
          warehouse: true,
        },
      });

      return stockLevels.filter(
        (sl) => sl.product && sl.quantity < sl.product.reorderThreshold
      );
    } catch (error) {
      throw error;
    }
  }
}

export default new StockService();
