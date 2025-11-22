import { z } from "zod"

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["admin", "manager", "staff"]).optional(),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const warehouseSchema = z.object({
  name: z.string().min(2, "Warehouse name is required"),
  code: z.string().min(2, "Warehouse code is required"),
  location: z.string().min(2, "Location is required"),
  capacity: z.number().optional(),
})

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  description: z.string().optional(),
})

export const productSchema = z.object({
  sku: z.string().min(2, "SKU is required"),
  name: z.string().min(2, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  warehouse: z.string().min(1, "Warehouse is required"),
  quantity: z.number().min(0).optional(),
  minStockLevel: z.number().min(0).optional(),
  unit: z.string().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
})

export const receiptSchema = z.object({
  product: z.string().min(1, "Product is required"),
  warehouse: z.string().min(1, "Warehouse is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  supplier: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
})

export const deliverySchema = z.object({
  product: z.string().min(1, "Product is required"),
  warehouse: z.string().min(1, "Warehouse is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  customer: z.string().optional(),
  destination: z.string().optional(),
  notes: z.string().optional(),
})

export const transferSchema = z.object({
  product: z.string().min(1, "Product is required"),
  fromWarehouse: z.string().min(1, "From warehouse is required"),
  toWarehouse: z.string().min(1, "To warehouse is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
})

export const adjustmentSchema = z.object({
  product: z.string().min(1, "Product is required"),
  warehouse: z.string().min(1, "Warehouse is required"),
  quantityAfter: z.number().min(0, "Quantity after must be 0 or greater"),
  adjustmentType: z.enum(["damage", "loss", "found", "recount"]),
  reason: z.string().optional(),
  notes: z.string().optional(),
})
