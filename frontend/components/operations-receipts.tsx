"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { products } from "@/lib/mock-data"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface ReceiptItem {
  productId: string
  qty: number
}

export function OperationsReceipts() {
  const [supplier, setSupplier] = useState("")
  const [items, setItems] = useState<ReceiptItem[]>([{ productId: "", qty: 0 }])

  const addItem = () => {
    setItems([...items, { productId: "", qty: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: "productId" | "qty", value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleValidate = () => {
    if (!supplier) {
      toast.error("Please enter supplier name")
      return
    }

    if (items.some((item) => !item.productId || item.qty <= 0)) {
      toast.error("Please fill in all items with valid quantities")
      return
    }

    const totalQty = items.reduce((sum, item) => sum + item.qty, 0)
    const product = products.find((p) => p.id === items[0]?.productId)

    toast.success(`Stock increased by +${totalQty} ${product?.uom || "units"}`)
    setSupplier("")
    setItems([{ productId: "", qty: 0 }])
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Supplier Name</label>
            <Input placeholder="e.g., ABC Supplies" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Receipt Items</label>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Received Qty</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Select value={item.productId} onValueChange={(v) => handleItemChange(idx, "productId", v)}>
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
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={item.qty}
                          onChange={(e) => handleItemChange(idx, "qty", Number.parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => removeItem(idx)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={addItem}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
            <Button onClick={handleValidate} className="ml-auto">
              Validate Receipt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
