"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { products, warehouses } from "@/lib/mock-data"
import { toast } from "sonner"

export function OperationsAdjustments() {
  const [productId, setProductId] = useState("")
  const [warehouseId, setWarehouseId] = useState("")
  const [countedQty, setCountedQty] = useState(0)

  const handleUpdateAndLog = () => {
    if (!productId || !warehouseId || countedQty < 0) {
      toast.error("Please fill in all fields correctly")
      return
    }

    const product = products.find((p) => p.id === productId)
    const currentQty = product?.onHand || 0
    const adjustment = countedQty - currentQty

    toast.success(
      `Adjusted ${adjustment > 0 ? "+" : ""}${adjustment} ${product?.uom || "units"} - recorded as damage/loss`,
    )

    setProductId("")
    setWarehouseId("")
    setCountedQty(0)
  }

  const selectedProduct = products.find((p) => p.id === productId)
  const currentQty = selectedProduct?.onHand || 0
  const adjustment = countedQty - currentQty

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Product</label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Warehouse/Location</label>
            <Select value={warehouseId} onValueChange={setWarehouseId}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((wh) => (
                  <SelectItem key={wh.id} value={wh.id}>
                    {wh.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Current System Quantity</label>
            <Input value={currentQty} disabled className="bg-muted" />
          </div>

          <div>
            <label className="text-sm font-medium">Counted Quantity</label>
            <Input
              type="number"
              min="0"
              value={countedQty}
              onChange={(e) => setCountedQty(Number.parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          {selectedProduct && (
            <div
              className={`rounded-lg border p-4 space-y-2 ${
                adjustment !== 0
                  ? adjustment > 0
                    ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                    : "bg-destructive/10 border-destructive/20"
                  : "bg-primary/5 border-primary/20"
              }`}
            >
              <p className="text-sm font-medium">Adjustment Summary</p>
              <div className="flex justify-between text-sm">
                <span>Adjustment</span>
                <Badge variant={adjustment > 0 ? "outline" : "secondary"}>
                  {adjustment > 0 ? "+" : ""}
                  {adjustment} {selectedProduct.uom}
                </Badge>
              </div>
              {adjustment < 0 && (
                <p className="text-xs text-muted-foreground">{adjustment < 0 ? "Damage/Loss" : "Surplus found"}</p>
              )}
            </div>
          )}

          <Button onClick={handleUpdateAndLog} className="w-full">
            Update & Log Adjustment
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
