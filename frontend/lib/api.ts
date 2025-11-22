// API Service Layer - All data operations abstracted here
// TODO: Replace mock functions with real API calls when backend is ready

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"

// ============= TYPES =============
export interface Product {
  id: string
  name: string
  sku: string
  category: string
  uom: string
  onHand: number
  freeQty: number
  reserved: number
  forecasted: number
  reorderLevel: number
  warehouse: string
}

export interface Warehouse {
  id: string
  name: string
  location: string
}

export interface KPIData {
  totalProducts: number
  lowStock: number
  outOfStock: number
  pendingReceipts: number
  pendingReceiptsQty: number
  pendingDeliveries: number
  pendingDeliveriesQty: number
  internalTransfers: number
}

export interface OperationFilters {
  type?: "receipts" | "delivery" | "transfer" | "adjustment" | "all"
  status?: "draft" | "waiting" | "ready" | "done" | "canceled" | "all"
  warehouse?: string
  location?: string
  category?: string
  sku?: string
}

export interface MoveHistoryEntry {
  id: string
  timestamp: Date
  product: string
  sku: string
  action: "receipt" | "delivery" | "transfer" | "adjustment"
  quantity: number
  delta: number
  fromLocation?: string
  toLocation?: string
  onHand: number
  reserved: number
  toDeliver: number
  status: "draft" | "waiting" | "ready" | "done" | "canceled"
  notes?: string
}

export interface ReceiptPayload {
  supplier: string
  items: Array<{
    productId: string
    quantity: number
  }>
  warehouse: string
}

export interface DeliveryPayload {
  items: Array<{
    productId: string
    quantity: number
  }>
  warehouse: string
}

export interface TransferPayload {
  productId: string
  quantity: number
  fromWarehouse: string
  toWarehouse: string
}

export interface AdjustmentPayload {
  productId: string
  warehouse: string
  countedQty: number
  reason: string
}

// ============= SEED DATA (PDF examples) =============
let mockProducts: Product[] = [
  {
    id: "p1",
    name: "Steel Rods",
    sku: "SR001",
    category: "Metal",
    uom: "units",
    onHand: 50,
    freeQty: 45,
    reserved: 5,
    forecasted: 60,
    reorderLevel: 10,
    warehouse: "wh1",
  },
  {
    id: "p2",
    name: "Chairs",
    sku: "C001",
    category: "Furniture",
    uom: "units",
    onHand: 10,
    freeQty: 8,
    reserved: 2,
    forecasted: 12,
    reorderLevel: 5,
    warehouse: "wh1",
  },
  {
    id: "p3",
    name: "Steel",
    sku: "S001",
    category: "Metal",
    uom: "kg",
    onHand: 100,
    freeQty: 90,
    reserved: 10,
    forecasted: 120,
    reorderLevel: 20,
    warehouse: "wh1",
  },
]

let mockWarehouses: Warehouse[] = [
  { id: "wh1", name: "Main Warehouse", location: "New York" },
  { id: "wh2", name: "Production Floor", location: "New Jersey" },
  { id: "wh3", name: "Distribution Center", location: "Pennsylvania" },
]

const mockHistory: MoveHistoryEntry[] = [
  {
    id: "h1",
    timestamp: new Date(Date.now() - 86400000 * 3),
    product: "Steel",
    sku: "S001",
    action: "receipt",
    quantity: 100,
    delta: 100,
    toLocation: "Main Warehouse",
    onHand: 100,
    reserved: 0,
    toDeliver: 0,
    status: "done",
    notes: "Initial stock",
  },
  {
    id: "h2",
    timestamp: new Date(Date.now() - 86400000 * 2),
    product: "Steel",
    sku: "S001",
    action: "transfer",
    quantity: 50,
    delta: 0,
    fromLocation: "Main Warehouse",
    toLocation: "Production Floor",
    onHand: 100,
    reserved: 10,
    toDeliver: 0,
    status: "done",
    notes: "Transfer to production",
  },
  {
    id: "h3",
    timestamp: new Date(Date.now() - 86400000),
    product: "Steel",
    sku: "S001",
    action: "delivery",
    quantity: 20,
    delta: -20,
    fromLocation: "Main Warehouse",
    onHand: 80,
    reserved: 10,
    toDeliver: 20,
    status: "done",
  },
  {
    id: "h4",
    timestamp: new Date(Date.now() - 43200000),
    product: "Steel",
    sku: "S001",
    action: "adjustment",
    quantity: 77,
    delta: -3,
    toLocation: "Main Warehouse",
    onHand: 77,
    reserved: 10,
    toDeliver: 0,
    status: "done",
    notes: "damaged - 3 units discarded",
  },
]

// ============= API FUNCTIONS =============

// --- KPIs ---
export async function getKPIs(): Promise<KPIData> {
  // TODO: Replace with real API call
  // return await fetch(`${API_BASE}/api/kpis`).then(r => r.json())

  await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate network delay

  return {
    totalProducts: mockProducts.reduce((sum, p) => sum + p.onHand, 0),
    lowStock: mockProducts.filter((p) => p.onHand < p.reorderLevel && p.onHand > 0).length,
    outOfStock: mockProducts.filter((p) => p.onHand === 0).length,
    pendingReceipts: 3,
    pendingReceiptsQty: 540,
    pendingDeliveries: 2,
    pendingDeliveriesQty: 120,
    internalTransfers: 1,
  }
}

// --- Products ---
export async function getProducts(filters?: { warehouse?: string; category?: string; sku?: string }): Promise<
  Product[]
> {
  // TODO: Replace with real API call
  // return await fetch(`${API_BASE}/api/products?${new URLSearchParams(filters)}`).then(r => r.json())

  await new Promise((resolve) => setTimeout(resolve, 300))

  let filtered = [...mockProducts]
  if (filters?.warehouse) filtered = filtered.filter((p) => p.warehouse === filters.warehouse)
  if (filters?.category) filtered = filtered.filter((p) => p.category === filters.category)
  if (filters?.sku) {
    const skuLower = filters.sku.toLowerCase()
    filtered = filtered.filter((p) => p.sku.toLowerCase().includes(skuLower) || p.name.toLowerCase().includes(skuLower))
  }
  return filtered
}

export async function createProduct(
  data: Omit<Product, "id" | "freeQty" | "reserved" | "forecasted">,
): Promise<Product> {
  // TODO: Replace with real API call
  // return await fetch(`${API_BASE}/api/products`, { method: 'POST', body: JSON.stringify(data) }).then(r => r.json())

  await new Promise((resolve) => setTimeout(resolve, 300))

  const newProduct: Product = {
    ...data,
    id: `p${mockProducts.length + 1}`,
    freeQty: data.onHand,
    reserved: 0,
    forecasted: data.onHand,
  }
  mockProducts.push(newProduct)
  return newProduct
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  // TODO: Replace with real API call
  // return await fetch(`${API_BASE}/api/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }).then(r => r.json())

  await new Promise((resolve) => setTimeout(resolve, 300))

  const index = mockProducts.findIndex((p) => p.id === id)
  if (index !== -1) {
    mockProducts[index] = { ...mockProducts[index], ...data }
  }
  return mockProducts[index]
}

export async function deleteProduct(id: string): Promise<void> {
  // TODO: Replace with real API call
  // await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' })

  await new Promise((resolve) => setTimeout(resolve, 300))
  mockProducts = mockProducts.filter((p) => p.id !== id)
}

// --- Warehouses ---
export async function getWarehouses(): Promise<Warehouse[]> {
  // TODO: Replace with real API call
  // return await fetch(`${API_BASE}/api/warehouses`).then(r => r.json())

  await new Promise((resolve) => setTimeout(resolve, 300))
  return [...mockWarehouses]
}

export async function createWarehouse(data: Omit<Warehouse, "id">): Promise<Warehouse> {
  // TODO: Replace with real API call
  // return await fetch(`${API_BASE}/api/warehouses`, { method: 'POST', body: JSON.stringify(data) }).then(r => r.json())

  await new Promise((resolve) => setTimeout(resolve, 300))

  const newWarehouse: Warehouse = {
    ...data,
    id: `wh${mockWarehouses.length + 1}`,
  }
  mockWarehouses.push(newWarehouse)
  return newWarehouse
}

export async function updateWarehouse(id: string, data: Partial<Warehouse>): Promise<Warehouse> {
  // TODO: Replace with real API call
  // return await fetch(`${API_BASE}/api/warehouses/${id}`, { method: 'PATCH', body: JSON.stringify(data) }).then(r => r.json())

  await new Promise((resolve) => setTimeout(resolve, 300))

  const index = mockWarehouses.findIndex((w) => w.id === id)
  if (index !== -1) {
    mockWarehouses[index] = { ...mockWarehouses[index], ...data }
  }
  return mockWarehouses[index]
}

export async function deleteWarehouse(id: string): Promise<void> {
  // TODO: Replace with real API call
  // await fetch(`${API_BASE}/api/warehouses/${id}`, { method: 'DELETE' })

  await new Promise((resolve) => setTimeout(resolve, 300))
  mockWarehouses = mockWarehouses.filter((w) => w.id !== id)
}

// --- Operations ---
export async function postReceipt(data: ReceiptPayload): Promise<{ success: boolean; message: string }> {
  // TODO: Replace with real API call
  // const result = await fetch(`${API_BASE}/api/operations/receipts`, { method: 'POST', body: JSON.stringify(data) }).then(r => r.json())
  // After success, invalidate queries: queryClient.invalidateQueries(['products', 'history', 'kpis'])

  await new Promise((resolve) => setTimeout(resolve, 500))

  // Update stock
  data.items.forEach((item) => {
    const product = mockProducts.find((p) => p.id === item.productId)
    if (product) {
      product.onHand += item.quantity
      product.freeQty += item.quantity
      product.forecasted += item.quantity

      // Add to history
      mockHistory.push({
        id: `h${mockHistory.length + 1}`,
        timestamp: new Date(),
        product: product.name,
        sku: product.sku,
        action: "receipt",
        quantity: item.quantity,
        delta: item.quantity,
        toLocation: mockWarehouses.find((w) => w.id === data.warehouse)?.name || "Unknown",
        onHand: product.onHand,
        reserved: product.reserved,
        toDeliver: 0,
        status: "done",
        notes: `Received from ${data.supplier}`,
      })
    }
  })

  return { success: true, message: "Receipt processed successfully" }
}

export async function postDelivery(data: DeliveryPayload): Promise<{ success: boolean; message: string }> {
  // TODO: Replace with real API call
  // const result = await fetch(`${API_BASE}/api/operations/deliveries`, { method: 'POST', body: JSON.stringify(data) }).then(r => r.json())
  // After success, invalidate queries: queryClient.invalidateQueries(['products', 'history', 'kpis'])

  await new Promise((resolve) => setTimeout(resolve, 500))

  // Update stock
  data.items.forEach((item) => {
    const product = mockProducts.find((p) => p.id === item.productId)
    if (product) {
      product.onHand -= item.quantity
      product.freeQty -= item.quantity
      product.forecasted -= item.quantity

      // Add to history
      mockHistory.push({
        id: `h${mockHistory.length + 1}`,
        timestamp: new Date(),
        product: product.name,
        sku: product.sku,
        action: "delivery",
        quantity: item.quantity,
        delta: -item.quantity,
        fromLocation: mockWarehouses.find((w) => w.id === data.warehouse)?.name || "Unknown",
        onHand: product.onHand,
        reserved: product.reserved,
        toDeliver: item.quantity,
        status: "done",
      })
    }
  })

  return { success: true, message: "Delivery processed successfully" }
}

export async function postTransfer(data: TransferPayload): Promise<{ success: boolean; message: string }> {
  // TODO: Replace with real API call
  // const result = await fetch(`${API_BASE}/api/operations/transfers`, { method: 'POST', body: JSON.stringify(data) }).then(r => r.json())
  // After success, invalidate queries: queryClient.invalidateQueries(['products', 'history', 'kpis'])

  await new Promise((resolve) => setTimeout(resolve, 500))

  const product = mockProducts.find((p) => p.id === data.productId)
  if (product) {
    // Transfer doesn't change total quantity, only location
    mockHistory.push({
      id: `h${mockHistory.length + 1}`,
      timestamp: new Date(),
      product: product.name,
      sku: product.sku,
      action: "transfer",
      quantity: data.quantity,
      delta: 0, // No change in total stock
      fromLocation: mockWarehouses.find((w) => w.id === data.fromWarehouse)?.name || "Unknown",
      toLocation: mockWarehouses.find((w) => w.id === data.toWarehouse)?.name || "Unknown",
      onHand: product.onHand,
      reserved: product.reserved,
      toDeliver: 0,
      status: "done",
    })
  }

  return { success: true, message: "Transfer completed successfully" }
}

export async function postAdjustment(
  data: AdjustmentPayload,
): Promise<{ success: boolean; message: string; diff: number }> {
  // TODO: Replace with real API call
  // const result = await fetch(`${API_BASE}/api/operations/adjustments`, { method: 'POST', body: JSON.stringify(data) }).then(r => r.json())
  // After success, invalidate queries: queryClient.invalidateQueries(['products', 'history', 'kpis'])

  await new Promise((resolve) => setTimeout(resolve, 500))

  const product = mockProducts.find((p) => p.id === data.productId)
  if (!product) return { success: false, message: "Product not found", diff: 0 }

  const diff = data.countedQty - product.onHand
  product.onHand = data.countedQty
  product.freeQty = Math.max(0, data.countedQty - product.reserved)
  product.forecasted = data.countedQty

  // Add to history
  mockHistory.push({
    id: `h${mockHistory.length + 1}`,
    timestamp: new Date(),
    product: product.name,
    sku: product.sku,
    action: "adjustment",
    quantity: data.countedQty,
    delta: diff,
    toLocation: mockWarehouses.find((w) => w.id === data.warehouse)?.name || "Unknown",
    onHand: product.onHand,
    reserved: product.reserved,
    toDeliver: 0,
    status: "done",
    notes: data.reason,
  })

  return { success: true, message: "Adjustment recorded successfully", diff }
}

// --- Move History ---
export async function getHistory(filters?: OperationFilters): Promise<MoveHistoryEntry[]> {
  // TODO: Replace with real API call
  // return await fetch(`${API_BASE}/api/history?${new URLSearchParams(filters)}`).then(r => r.json())

  await new Promise((resolve) => setTimeout(resolve, 300))

  let filtered = [...mockHistory].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  if (filters?.type && filters.type !== "all") {
    filtered = filtered.filter((h) => h.action === filters.type)
  }
  if (filters?.status && filters.status !== "all") {
    filtered = filtered.filter((h) => h.status === filters.status)
  }
  if (filters?.sku) {
    const skuLower = filters.sku.toLowerCase()
    filtered = filtered.filter(
      (h) => h.sku.toLowerCase().includes(skuLower) || h.product.toLowerCase().includes(skuLower),
    )
  }

  return filtered
}
