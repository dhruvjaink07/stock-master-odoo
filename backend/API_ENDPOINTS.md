# StockMaster API Endpoints

## Authentication

### POST /api/v1/auth/register
- **Body:**
  - `name`: string
  - `email`: string
  - `password`: string
- **Response:** UserDto (id, name, email, ...)

### POST /api/v1/auth/login
- **Body:**
  - `email`: string
  - `password`: string
- **Response:** JWT token (string)

---

## Products

### GET /api/v1/products
- **Response:** List of products

### GET /api/v1/products/{id}
- **Response:** Product details

### POST /api/v1/products
- **Body:**
  - `name`: string
  - `category_id`: uuid
  - `unit`: string
  - ...
- **Response:** Created product

### PUT /api/v1/products/{id}
- **Body:** (same as POST)
- **Response:** Updated product

### DELETE /api/v1/products/{id}
- **Response:** Status

---

## Stock

### GET /api/v1/stock/current
- **Response:**
  - List of `{ product_id: uuid, warehouse_id: uuid, quantity: decimal }`

### GET /api/v1/stock/product/{product_id}
- **Response:**
  - List of `{ product_id: uuid, warehouse_id: uuid, quantity: decimal }`

### GET /api/v1/stock/warehouse/{warehouse_id}
- **Response:**
  - List of `{ product_id: uuid, warehouse_id: uuid, quantity: decimal }`

---

## Warehouses

### GET /api/v1/warehouses
- **Response:** List of warehouses

### GET /api/v1/warehouses/{id}
- **Response:** Warehouse details

### POST /api/v1/warehouses
- **Body:**
  - `name`: string
  - `location`: string
- **Response:** Created warehouse

### PUT /api/v1/warehouses/{id}
- **Body:** (same as POST)
- **Response:** Updated warehouse

### DELETE /api/v1/warehouses/{id}
- **Response:** Status

---

## Categories

### GET /api/v1/categories
- **Response:** List of categories

### POST /api/v1/categories
- **Body:**
  - `name`: string
- **Response:** Created category

---

## Receipts / Deliveries / Transfers / Adjustments

### POST /api/v1/receipts
- **Body:**
  - `product_id`: uuid
  - `warehouse_id`: uuid
  - `quantity`: decimal
  - ...
- **Response:** Receipt record

### POST /api/v1/deliveries
- **Body:**
  - `product_id`: uuid
  - `warehouse_id`: uuid
  - `quantity`: decimal
  - ...
- **Response:** Delivery record

### POST /api/v1/transfers
- **Body:**
  - `product_id`: uuid
  - `from_warehouse_id`: uuid
  - `to_warehouse_id`: uuid
  - `quantity`: decimal
- **Response:** Transfer record

### POST /api/v1/adjustments
- **Body:**
  - `product_id`: uuid
  - `warehouse_id`: uuid
  - `quantity`: decimal
  - `reason`: string
- **Response:** Adjustment record

---

## Dashboard

### GET /api/v1/dashboard/summary
- **Response:**
  - Summary stats (total products, total stock, ...)

---

## Move History

### GET /api/v1/move-history
- **Query:**
  - `product_id` (optional)
  - `warehouse_id` (optional)
  - `date_from`, `date_to` (optional)
- **Response:**
  - List of stock ledger entries

---

## Notes
- All endpoints (except register/login) require JWT auth in the `Authorization: Bearer <token>` header.
- All IDs are UUIDs unless otherwise noted.
- Decimal fields should be sent as strings (e.g., "12.34").
- For full request/response details, see the DTOs in `src/dto/`.
