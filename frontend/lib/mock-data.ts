export interface Product {
  id: string
  name: string
  sku: string
  category: string
  uom: string
  onHand: number
  freeQty: number
  forecasted: number
  reorderLevel: number
  warehouse: string
}

export interface Warehouse {
  id: string
  name: string
  location: string
}

export interface OperationEntry {
  id: string
  type: "receipt" | "delivery" | "transfer" | "adjustment"
  productId: string
  productName: string
  quantity: number
  fromLocation?: string
  toLocation?: string
  status: "draft" | "pending" | "completed" | "canceled"
  timestamp: Date
  notes?: string
}

export const warehouses: Warehouse[] = [
  { id: "wh1", name: "Main Warehouse", location: "New York" },
  { id: "wh2", name: "Production Floor", location: "New Jersey" },
  { id: "wh3", name: "Distribution Center", location: "Pennsylvania" },
]

export const products: Product[] = [
  {
    id: "p1",
    name: "Steel Rods",
    sku: "SR-001",
    category: "Materials",
    uom: "kg",
    onHand: 50,
    freeQty: 45,
    forecasted: 80,
    reorderLevel: 100,
    warehouse: "wh1",
  },
  {
    id: "p2",
    name: "Office Chairs",
    sku: "OC-002",
    category: "Furniture",
    uom: "units",
    onHand: 10,
    freeQty: 8,
    forecasted: 15,
    reorderLevel: 20,
    warehouse: "wh1",
  },
  {
    id: "p3",
    name: "100kg Steel Bundle",
    sku: "SB-003",
    category: "Materials",
    uom: "kg",
    onHand: 100,
    freeQty: 95,
    forecasted: 150,
    reorderLevel: 200,
    warehouse: "wh2",
  },
  {
    id: "p4",
    name: "Aluminum Sheets",
    sku: "AS-004",
    category: "Materials",
    uom: "sheets",
    onHand: 15,
    freeQty: 12,
    forecasted: 30,
    reorderLevel: 50,
    warehouse: "wh1",
  },
  {
    id: "p5",
    name: "Plastic Bins",
    sku: "PB-005",
    category: "Containers",
    uom: "units",
    onHand: 200,
    freeQty: 190,
    forecasted: 250,
    reorderLevel: 100,
    warehouse: "wh3",
  },
]

export const operationHistory: OperationEntry[] = [
  {
    id: "op1",
    type: "receipt",
    productId: "p1",
    productName: "Steel Rods",
    quantity: 100,
    toLocation: "wh1",
    status: "completed",
    timestamp: new Date(Date.now() - 86400000),
    notes: "Received from supplier ABC",
  },
  {
    id: "op2",
    type: "transfer",
    productId: "p1",
    productName: "Steel Rods",
    quantity: 0,
    fromLocation: "wh1",
    toLocation: "wh2",
    status: "completed",
    timestamp: new Date(Date.now() - 43200000),
    notes: "Transfer to production",
  },
]

export const addOperation = (operation: Omit<OperationEntry, "id" | "timestamp">) => {
  const newOperation: OperationEntry = {
    ...operation,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date(),
  }
  operationHistory.push(newOperation)
  return newOperation
}
