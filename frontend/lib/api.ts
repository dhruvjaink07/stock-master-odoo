// API Service Layer - All data operations abstracted here
// Backend is now fully integrated

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000"

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

// ============= HELPER FUNCTIONS =============

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("authToken")
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    // Token expired or invalid
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      window.location.href = "/"
    }
    throw new Error("Authentication expired. Please login again.")
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

// ============= API FUNCTIONS =============

// --- KPIs ---
export async function getKPIs(): Promise<KPIData> {
  return await fetchWithAuth("/api/kpis")
}

// --- Products ---
export async function getProducts(filters?: { warehouse?: string; category?: string; sku?: string }): Promise<
  Product[]
> {
  const params = new URLSearchParams()
  if (filters?.warehouse) params.append("warehouse", filters.warehouse)
  if (filters?.category) params.append("category", filters.category)
  if (filters?.sku) params.append("search", filters.sku)

  const queryString = params.toString()
  return await fetchWithAuth(`/api/products${queryString ? `?${queryString}` : ""}`)
}

export async function createProduct(
  data: Omit<Product, "id" | "freeQty" | "reserved" | "forecasted">,
): Promise<Product> {
  return await fetchWithAuth("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  return await fetchWithAuth(`/api/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteProduct(id: string): Promise<void> {
  await fetchWithAuth(`/api/products/${id}`, {
    method: "DELETE",
  })
}

// --- Warehouses ---
export async function getWarehouses(): Promise<Warehouse[]> {
  return await fetchWithAuth("/api/warehouses")
}

export async function createWarehouse(data: Omit<Warehouse, "id">): Promise<Warehouse> {
  return await fetchWithAuth("/api/warehouses", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateWarehouse(id: string, data: Partial<Warehouse>): Promise<Warehouse> {
  return await fetchWithAuth(`/api/warehouses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteWarehouse(id: string): Promise<void> {
  await fetchWithAuth(`/api/warehouses/${id}`, {
    method: "DELETE",
  })
}

// --- Operations ---
export async function postReceipt(data: ReceiptPayload): Promise<{ success: boolean; message: string }> {
  return await fetchWithAuth("/api/operations/receipts", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function postDelivery(data: DeliveryPayload): Promise<{ success: boolean; message: string }> {
  return await fetchWithAuth("/api/operations/deliveries", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function postTransfer(data: TransferPayload): Promise<{ success: boolean; message: string }> {
  return await fetchWithAuth("/api/operations/transfers", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function postAdjustment(
  data: AdjustmentPayload,
): Promise<{ success: boolean; message: string; diff: number }> {
  return await fetchWithAuth("/api/operations/adjustments", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// --- Move History ---
export async function getHistory(filters?: OperationFilters): Promise<MoveHistoryEntry[]> {
  const params = new URLSearchParams()
  if (filters?.type && filters.type !== "all") params.append("type", filters.type)
  if (filters?.status && filters.status !== "all") params.append("status", filters.status)
  if (filters?.sku) params.append("search", filters.sku)

  const queryString = params.toString()
  return await fetchWithAuth(`/api/history${queryString ? `?${queryString}` : ""}`)
}

// --- Authentication APIs ---
export interface AuthResponse {
  success: boolean
  token: string
  user: {
    id: string
    email: string
    name: string
    role: string
  }
}

export async function loginAPI(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Login failed" }))
    throw new Error(error.message || "Invalid credentials")
  }

  return response.json()
}

export async function signupAPI(email: string, password: string, name: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Signup failed" }))
    throw new Error(error.message || "Registration failed")
  }

  return response.json()
}

export async function getUserProfile(): Promise<any> {
  return await fetchWithAuth("/api/auth/profile")
}

export async function updateUserProfile(data: any): Promise<any> {
  return await fetchWithAuth("/api/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}
