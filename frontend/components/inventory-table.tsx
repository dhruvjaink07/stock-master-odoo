"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getProducts, getWarehouses, type Product } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface InventoryTableProps {
  onRowClick?: (product: Product) => void
}

export function InventoryTable({ onRowClick }: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWarehouse, setSelectedWarehouse] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const { toast } = useToast()

  const debouncedSearch = useDebounce(searchTerm, 300)

  const { data: warehouses } = useQuery({
    queryKey: ["warehouses"],
    queryFn: getWarehouses,
  })

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", selectedWarehouse, debouncedSearch],
    queryFn: () =>
      getProducts({
        warehouse: selectedWarehouse === "all" ? undefined : selectedWarehouse,
        sku: debouncedSearch || undefined,
      }),
  })

  const lowStockProducts = products.filter((p) => p.onHand < p.reorderLevel && p.onHand > 0)
  if (lowStockProducts.length > 0 && !isLoading) {
    const hasShownAlert = sessionStorage.getItem("lowStockAlertShown")
    if (!hasShownAlert) {
      toast({
        title: "Low Stock Alert",
        description: `${lowStockProducts.length} product(s) below reorder level`,
        variant: "destructive",
      })
      sessionStorage.setItem("lowStockAlertShown", "true")
    }
  }

  const totalPages = Math.ceil(products.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage)

  const getStockStatus = (onHand: number, reorderLevel: number) => {
    if (onHand === 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (onHand < reorderLevel) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "outline" as const }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Snapshot</CardTitle>
        <CardDescription>Real-time stock levels across warehouses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search by product or SKU..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="flex-1"
            />
            <Select
              value={selectedWarehouse}
              onValueChange={(value) => {
                setSelectedWarehouse(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Warehouses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warehouses</SelectItem>
                {warehouses?.map((wh) => (
                  <SelectItem key={wh.id} value={wh.id}>
                    {wh.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedWarehouse("all")
                setCurrentPage(1)
              }}
            >
              Clear Filters
            </Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">On Hand</TableHead>
                  <TableHead className="text-right">Free Qty</TableHead>
                  <TableHead className="text-right">Forecasted</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((product) => {
                    const status = getStockStatus(product.onHand, product.reorderLevel)
                    const isLowStock = product.onHand < product.reorderLevel

                    return (
                      <TableRow
                        key={product.id}
                        className={`cursor-pointer transition-colors ${
                          isLowStock ? "hover:bg-destructive/5 bg-destructive/5" : "hover:bg-muted/50"
                        }`}
                        onClick={() => onRowClick?.(product)}
                      >
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                          </div>
                        </TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell className="text-right">
                          {product.onHand} {product.uom}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.freeQty} {product.uom}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.forecasted} {product.uom}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant} className="gap-1">
                            {isLowStock && <AlertCircle className="w-3 h-3" />}
                            {status.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, products.length)} of {products.length}{" "}
                items
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="flex items-center px-3 text-sm">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
