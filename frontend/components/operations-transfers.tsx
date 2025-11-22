"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { products, warehouses } from "@/lib/mock-data"
import { ArrowRight } from "lucide-react"
import { toast } from "sonner"

export function OperationsTransfers() {
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [productId, setProductId] = useState("")
  const [quantity, setQuantity] = useState(0)

  const handleLogMove = () => {
    if (!fromLocation || !toLocation || !productId || quantity <= 0) {
      toast.error("Please fill in all fields")
      return
    }

    if (fromLocation === toLocation) {
      toast.error("From and To locations must be different")
      return
    }

    const product = products.find((p) => p.id === productId)
    toast.success(`Moved & logged: ${product?.name} transferred`)

    setFromLocation("")
    setToLocation("")
    setProductId("")
    setQuantity(0)
  }

  const fromWarehouse = warehouses.find((w) => w.id === fromLocation)
  const toWarehouse = warehouses.find((w) => w.id === toLocation)
  const selectedProduct = products.find((p) => p.id === productId)

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">From Location</label>
            <Select value={fromLocation} onValueChange={setFromLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select source location" />
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

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium block mb-2">To Location</label>
              <Select value={toLocation} onValueChange={setToLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination location" />
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
            <ArrowRight className="w-5 h-5 text-muted-foreground mb-2" />
          </div>

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
            <label className="text-sm font-medium">Quantity</label>
            <Input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          {fromWarehouse && toWarehouse && selectedProduct && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Transfer Summary</p>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline">{fromWarehouse.name}</Badge>
                <ArrowRight className="w-4 h-4" />
                <Badge variant="outline">{toWarehouse.name}</Badge>
              </div>
              <p className="text-sm">
                {quantity} {selectedProduct.uom} of {selectedProduct.name}
              </p>
              <p className="text-xs text-muted-foreground">Total stock unchanged (location update only)</p>
            </div>
          )}

          <Button onClick={handleLogMove} className="w-full">
            Log Move & Transfer
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
