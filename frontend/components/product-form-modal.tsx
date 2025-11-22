"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product } from "@/lib/mock-data"
import { warehouses } from "@/lib/mock-data"
import { toast } from "sonner"

interface ProductFormModalProps {
  product?: Product | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (product: Omit<Product, "id">) => void
}

const categories = ["Materials", "Furniture", "Containers", "Electronics", "Other"]
const uoms = ["units", "kg", "sheets", "boxes", "meters"]

export function ProductFormModal({ product, isOpen, onClose, onSubmit }: ProductFormModalProps) {
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: product?.name || "",
    sku: product?.sku || "",
    category: product?.category || "",
    uom: product?.uom || "units",
    onHand: product?.onHand || 0,
    freeQty: product?.freeQty || 0,
    forecasted: product?.forecasted || 0,
    reorderLevel: product?.reorderLevel || 0,
    warehouse: product?.warehouse || "",
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.sku || !formData.category || !formData.warehouse) {
      toast.error("Please fill in all required fields")
      return
    }

    onSubmit(formData)
    setFormData({
      name: "",
      sku: "",
      category: "",
      uom: "units",
      onHand: 0,
      freeQty: 0,
      forecasted: 0,
      reorderLevel: 0,
      warehouse: "",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{product ? "Edit Product" : "Create New Product"}</CardTitle>
          <CardDescription>
            {product ? "Update product details" : "Add a new product to your inventory"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Product Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Steel Rods"
              />
            </div>
            <div>
              <label className="text-sm font-medium">SKU/Code *</label>
              <Input
                value={formData.sku}
                onChange={(e) => handleChange("sku", e.target.value)}
                placeholder="e.g., SR-001"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category *</label>
              <Select value={formData.category} onValueChange={(v) => handleChange("category", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Unit of Measure</label>
              <Select value={formData.uom} onValueChange={(v) => handleChange("uom", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {uoms.map((uom) => (
                    <SelectItem key={uom} value={uom}>
                      {uom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Warehouse *</label>
              <Select value={formData.warehouse} onValueChange={(v) => handleChange("warehouse", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse" />
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
              <label className="text-sm font-medium">Reorder Level</label>
              <Input
                type="number"
                value={formData.reorderLevel}
                onChange={(e) => handleChange("reorderLevel", Number.parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-sm font-medium">On Hand</label>
              <Input
                type="number"
                value={formData.onHand}
                onChange={(e) => handleChange("onHand", Number.parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Free Quantity</label>
              <Input
                type="number"
                value={formData.freeQty}
                onChange={(e) => handleChange("freeQty", Number.parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Forecasted</label>
              <Input
                type="number"
                value={formData.forecasted}
                onChange={(e) => handleChange("forecasted", Number.parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{product ? "Update Product" : "Create Product"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
