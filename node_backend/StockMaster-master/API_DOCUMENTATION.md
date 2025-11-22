# StockMaster API Documentation

Complete API reference for all endpoints.

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer {token}
```

Protected endpoints are marked with 🔐.

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "clp1234abcd",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### Login User
**POST** `/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clp1234abcd",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

---

### Get User Profile
**GET** `/auth/profile` 🔐

Get authenticated user's profile.

**Response (200):**
```json
{
  "id": "clp1234abcd",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "MANAGER"
}
```

---

## Warehouses Endpoints

### Create Warehouse
**POST** `/warehouses` 🔐

Create a new warehouse.

**Request Body:**
```json
{
  "name": "Main Warehouse",
  "location": "New York, NY",
  "capacity": 10000
}
```

**Response (201):**
```json
{
  "message": "Warehouse created",
  "warehouse": {
    "id": "wh-001",
    "name": "Main Warehouse",
    "location": "New York, NY",
    "capacity": 10000,
    "createdAt": "2024-11-22T10:00:00Z",
    "updatedAt": "2024-11-22T10:00:00Z"
  }
}
```

### List All Warehouses
**GET** `/warehouses`

Get all warehouses with capacity stats.

**Response (200):**
```json
[
  {
    "id": "wh-001",
    "name": "Main Warehouse",
    "location": "New York, NY",
    "capacity": 10000,
    "totalStock": 5234.50,
    "usedCapacity": 52.35,
    "availableCapacity": 4765.50,
    "productCount": 15,
    "createdAt": "2024-11-22T10:00:00Z",
    "updatedAt": "2024-11-22T10:00:00Z"
  }
]
```

### Get Warehouse Details
**GET** `/warehouses/:id`

Get specific warehouse with all stock levels.

**Response (200):**
```json
{
  "id": "wh-001",
  "name": "Main Warehouse",
  "location": "New York, NY",
  "capacity": 10000,
  "totalStock": 5234.50,
  "usedCapacity": 52.35,
  "availableCapacity": 4765.50,
  "products": [
    {
      "id": "sl-001",
      "productId": "prod-001",
      "quantity": 100.50,
      "product": {
        "id": "prod-001",
        "sku": "SKU-001",
        "name": "Product A",
        "unitPrice": 25.99
      }
    }
  ]
}
```

### Update Warehouse
**PUT** `/warehouses/:id` 🔐

Update warehouse details.

**Request Body:**
```json
{
  "name": "Main Warehouse",
  "location": "New York, NY",
  "capacity": 12000
}
```

**Response (200):**
```json
{
  "message": "Warehouse updated",
  "warehouse": { ... }
}
```

### Get Warehouse Stock
**GET** `/warehouses/:id/stock`

Get all stock items in a warehouse.

**Response (200):**
```json
{
  "warehouseId": "wh-001",
  "total": 15,
  "items": [
    {
      "id": "sl-001",
      "productId": "prod-001",
      "quantity": 100.50,
      "product": {
        "sku": "SKU-001",
        "name": "Product A"
      }
    }
  ]
}
```

---

## Products Endpoints

### Create Product
**POST** `/products` 🔐

Create a new product.

**Request Body:**
```json
{
  "sku": "SKU-001",
  "name": "Laptop Pro",
  "category": "Electronics",
  "description": "High-performance laptop",
  "reorderThreshold": 10,
  "unitPrice": 999.99,
  "decimals": 0
}
```

**Response (201):**
```json
{
  "message": "Product created",
  "product": {
    "id": "prod-001",
    "sku": "SKU-001",
    "name": "Laptop Pro",
    "category": "Electronics",
    "reorderThreshold": 10,
    "unitPrice": 999.99,
    "decimals": 0
  }
}
```

### List Products
**GET** `/products`

Get all products with stock levels.

**Response (200):**
```json
[
  {
    "id": "prod-001",
    "sku": "SKU-001",
    "name": "Laptop Pro",
    "category": "Electronics",
    "stockLevels": [
      {
        "warehouseId": "wh-001",
        "quantity": 50,
        "warehouse": { "name": "Main Warehouse" }
      }
    ]
  }
]
```

### Search Products
**GET** `/products/search?query=laptop`

Search products by SKU or name.

**Query Parameters:**
- `query` (required) - Search term

**Response (200):**
```json
[
  {
    "id": "prod-001",
    "sku": "SKU-001",
    "name": "Laptop Pro",
    "category": "Electronics"
  }
]
```

### Get Product Details
**GET** `/products/:id`

Get product with all stock levels and recent movements.

**Response (200):**
```json
{
  "id": "prod-001",
  "sku": "SKU-001",
  "name": "Laptop Pro",
  "category": "Electronics",
  "reorderThreshold": 10,
  "unitPrice": 999.99,
  "decimals": 0,
  "stockLevels": [
    {
      "warehouseId": "wh-001",
      "quantity": 50,
      "warehouse": { "name": "Main Warehouse" }
    }
  ],
  "ledgers": [
    {
      "type": "RECEIPT",
      "quantity": 50,
      "previousQty": 0,
      "newQty": 50,
      "createdAt": "2024-11-22T10:00:00Z"
    }
  ]
}
```

### Update Product
**PUT** `/products/:id` 🔐

Update product details.

**Request Body:**
```json
{
  "name": "Laptop Pro",
  "category": "Electronics",
  "reorderThreshold": 15,
  "unitPrice": 1099.99
}
```

**Response (200):**
```json
{
  "message": "Product updated",
  "product": { ... }
}
```

---

## Receipts Endpoints

### Create Receipt
**POST** `/receipts` 🔐

Create a new incoming receipt.

**Request Body:**
```json
{
  "receiptNumber": "REC-2024-001",
  "notes": "Received from supplier ABC",
  "items": [
    {
      "productId": "prod-001",
      "warehouseId": "wh-001",
      "quantity": 100
    },
    {
      "productId": "prod-002",
      "warehouseId": "wh-001",
      "quantity": 50
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Receipt created",
  "receipt": {
    "id": "rec-001",
    "receiptNumber": "REC-2024-001",
    "status": "PENDING",
    "totalQuantity": 150,
    "items": [ ... ]
  }
}
```

### List Receipts
**GET** `/receipts`

Get all receipts.

**Query Parameters:**
- `status` - Filter by status (PENDING, VALIDATED, REJECTED)

**Response (200):**
```json
[
  {
    "id": "rec-001",
    "receiptNumber": "REC-2024-001",
    "status": "PENDING",
    "totalQuantity": 150,
    "items": [ ... ]
  }
]
```

### Get Receipt Details
**GET** `/receipts/:id`

Get specific receipt.

**Response (200):**
```json
{
  "id": "rec-001",
  "receiptNumber": "REC-2024-001",
  "status": "PENDING",
  "totalQuantity": 150,
  "items": [
    {
      "productId": "prod-001",
      "warehouseId": "wh-001",
      "quantity": 100,
      "product": { "name": "Product A" }
    }
  ]
}
```

### Validate Receipt
**POST** `/receipts/:id/validate` 🔐

Validate and process receipt (increases stock, creates ledger entry).

**Response (200):**
```json
{
  "message": "Receipt validated and stock updated",
  "receipt": {
    "id": "rec-001",
    "status": "VALIDATED",
    "items": [ ... ]
  }
}
```

**What happens:**
1. For each item in receipt:
   - Stock increases by quantity
   - Ledger entry created: type=RECEIPT, quantity=+100
2. Receipt status changes to VALIDATED

### Reject Receipt
**POST** `/receipts/:id/reject` 🔐

Reject a receipt.

**Response (200):**
```json
{
  "message": "Receipt rejected",
  "receipt": {
    "status": "REJECTED"
  }
}
```

---

## Transfers Endpoints

### Create Transfer
**POST** `/transfers` 🔐

Create inter-warehouse transfer.

**Request Body:**
```json
{
  "transferNumber": "TRF-2024-001",
  "fromWarehouseId": "wh-001",
  "toWarehouseId": "wh-002",
  "items": [
    {
      "productId": "prod-001",
      "quantity": 50
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Transfer created",
  "transfer": {
    "id": "trf-001",
    "transferNumber": "TRF-2024-001",
    "status": "PENDING",
    "items": [ ... ]
  }
}
```

### List Transfers
**GET** `/transfers`

Get all transfers.

**Response (200):**
```json
[
  {
    "id": "trf-001",
    "transferNumber": "TRF-2024-001",
    "status": "PENDING",
    "fromWarehouse": { "name": "Main Warehouse" },
    "toWarehouse": { "name": "Secondary Warehouse" }
  }
]
```

### Complete Transfer
**POST** `/transfers/:id/complete` 🔐

Complete transfer (updates both warehouses, creates ledger entries).

**Response (200):**
```json
{
  "message": "Transfer completed",
  "transfer": {
    "id": "trf-001",
    "status": "COMPLETED"
  }
}
```

**What happens:**
1. FROM warehouse: quantity decreases, ledger entry created (quantity: -50)
2. TO warehouse: quantity increases, ledger entry created (quantity: +50)
3. Total stock unchanged across system

---

## Deliveries Endpoints

### Create Delivery
**POST** `/deliveries` 🔐

Create customer delivery.

**Request Body:**
```json
{
  "invoiceNumber": "INV-2024-001",
  "customerName": "Customer ABC",
  "customerEmail": "customer@example.com",
  "notes": "Deliver on Monday",
  "items": [
    {
      "productId": "prod-001",
      "warehouseId": "wh-001",
      "quantity": 20
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Delivery created",
  "delivery": {
    "id": "dlv-001",
    "invoiceNumber": "INV-2024-001",
    "status": "PENDING",
    "customerName": "Customer ABC"
  }
}
```

### Complete Delivery
**POST** `/deliveries/:id/complete` 🔐

Complete delivery (permanent stock reduction, creates ledger entry).

**Response (200):**
```json
{
  "message": "Delivery completed and stock reduced",
  "delivery": {
    "status": "DELIVERED"
  }
}
```

**What happens:**
1. Stock decreases permanently
2. Ledger entry created: type=DELIVERY, quantity=-20
3. Cannot be reversed (audit trail preserved)

---

## Adjustments Endpoints

### Create Adjustment
**POST** `/adjustments` 🔐

Create stock adjustment (damage, expiry, correction).

**Request Body:**
```json
{
  "adjustmentNumber": "ADJ-2024-001",
  "reason": "DAMAGE",
  "notes": "Damaged during shipment",
  "items": [
    {
      "productId": "prod-001",
      "warehouseId": "wh-001",
      "quantity": -5
    }
  ]
}
```

**Request Body:** (Reason can be: DAMAGE, EXPIRY, CORRECTION, LOSS)

**Response (201):**
```json
{
  "message": "Adjustment created",
  "adjustment": {
    "id": "adj-001",
    "adjustmentNumber": "ADJ-2024-001",
    "status": "PENDING",
    "reason": "DAMAGE"
  }
}
```

### Approve Adjustment
**POST** `/adjustments/:id/approve` 🔐

Approve and apply adjustment.

**Response (200):**
```json
{
  "message": "Adjustment approved and applied",
  "adjustment": {
    "status": "APPROVED"
  }
}
```

**What happens:**
1. Stock adjusted (can be negative for reductions)
2. Ledger entry created: type=ADJUSTMENT, reason stored in notes

---

## Stock Ledger / Move History Endpoints

### Get Full Audit Trail
**GET** `/move-history`

Get immutable stock movement history.

**Query Parameters:**
- `productId` - Filter by product
- `warehouseId` - Filter by warehouse
- `type` - Filter by type (RECEIPT, TRANSFER, DELIVERY, ADJUSTMENT)
- `startDate` - ISO date (2024-01-01)
- `endDate` - ISO date
- `limit` - Max results (default: 100)

**Response (200):**
```json
{
  "total": 50,
  "movements": [
    {
      "id": "ledger-001",
      "type": "RECEIPT",
      "productId": "prod-001",
      "warehouseId": "wh-001",
      "quantity": 100,
      "previousQty": 0,
      "newQty": 100,
      "reference": "REC-2024-001",
      "notes": "Initial receipt",
      "createdAt": "2024-11-22T10:00:00Z",
      "product": { "sku": "SKU-001", "name": "Laptop Pro" },
      "warehouse": { "name": "Main Warehouse" }
    },
    {
      "id": "ledger-002",
      "type": "DELIVERY",
      "productId": "prod-001",
      "warehouseId": "wh-001",
      "quantity": -20,
      "previousQty": 100,
      "newQty": 80,
      "reference": "INV-2024-001",
      "notes": "Delivered to Customer ABC",
      "createdAt": "2024-11-22T11:30:00Z"
    }
  ]
}
```

### Get Product Movement History
**GET** `/move-history/product/:productId`

Get complete history for a product.

**Response (200):**
```json
{
  "product": { "sku": "SKU-001", "name": "Laptop Pro" },
  "total": 10,
  "movements": [
    {
      ...ledger entry,
      "runningBalance": 100
    }
  ]
}
```

### Get Warehouse Movement History
**GET** `/move-history/warehouse/:warehouseId`

Get movements for a warehouse.

**Response (200):**
```json
{
  "warehouse": { "name": "Main Warehouse" },
  "total": 45,
  "byType": {
    "RECEIPT": [ ... ],
    "TRANSFER": [ ... ],
    "DELIVERY": [ ... ],
    "ADJUSTMENT": [ ... ]
  }
}
```

### Export Ledger to CSV
**GET** `/move-history/export/csv` 🔐

Export audit trail as CSV file.

**Query Parameters:**
- `productId` - Filter by product
- `warehouseId` - Filter by warehouse
- `type` - Filter by type

**Response:** CSV file with columns:
```
Date,Type,Product SKU,Product Name,Warehouse,Quantity,Previous Qty,New Qty,Reference,Notes
```

---

## Dashboard Endpoints

### Get Dashboard KPIs
**GET** `/dashboard` 🔐

Get 8 key performance indicators.

**Query Parameters:**
- `warehouseId` - Filter by warehouse
- `category` - Filter by category

**Response (200):**
```json
{
  "kpis": {
    "totalStockValue": 50234.75,
    "totalQuantity": 1500.50,
    "lowStockAlerts": 3,
    "warehouseCount": 2,
    "productCount": 25,
    "pendingReceipts": 2,
    "pendingDeliveries": 5,
    "recentMovements24h": 12
  },
  "filters": {
    "appliedWarehouse": "all",
    "appliedCategory": "all"
  }
}
```

### Get Low Stock Alerts
**GET** `/dashboard/low-stock`

Get all products below reorder threshold.

**Query Parameters:**
- `warehouseId` - Filter by warehouse

**Response (200):**
```json
{
  "count": 3,
  "items": [
    {
      "id": "sl-001",
      "quantity": 5,
      "product": {
        "name": "Product A",
        "reorderThreshold": 10
      },
      "warehouse": { "name": "Main Warehouse" }
    }
  ]
}
```

### Get Warehouse Capacity
**GET** `/dashboard/warehouses`

Get all warehouses with capacity info.

**Response (200):**
```json
{
  "total": 2,
  "warehouses": [
    {
      "id": "wh-001",
      "name": "Main Warehouse",
      "location": "New York, NY",
      "capacity": 10000,
      "currentStock": 5234.50,
      "usedCapacity": 52.35,
      "availableCapacity": 4765.50,
      "productCount": 15
    }
  ]
}
```

### Get Category Breakdown
**GET** `/dashboard/categories`

Get stock by category.

**Response (200):**
```json
{
  "total": 5,
  "categories": [
    {
      "name": "Electronics",
      "productCount": 8,
      "totalStock": 2000.50,
      "totalValue": 45234.75
    }
  ]
}
```

### Get Recent Transactions
**GET** `/dashboard/recent-transactions`

Get recent stock movements.

**Query Parameters:**
- `type` - Filter by type (RECEIPT, TRANSFER, DELIVERY, ADJUSTMENT)
- `limit` - Max results (default: 20)

**Response (200):**
```json
{
  "total": 20,
  "transactions": [ ... ]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common Errors

| Status | Message | Cause |
|--------|---------|-------|
| 400 | Validation failed | Invalid request data |
| 401 | Invalid credentials | Wrong email/password |
| 401 | No token provided | Missing authorization header |
| 401 | Invalid or expired token | Token invalid/expired |
| 404 | Not found | Resource doesn't exist |
| 500 | Internal server error | Server error |

---

## Rate Limiting

Currently no rate limiting. In production, implement:
- 100 requests/minute per IP
- 1000 requests/hour per user

---

## Webhooks (Future)

Planned webhook events:
- `stock.receipt.validated`
- `stock.transfer.completed`
- `stock.delivery.completed`
- `stock.low_alert`

---

Last Updated: 2024-11-22
