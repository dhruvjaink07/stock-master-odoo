"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { products } from "@/lib/mock-data"
import { CheckCircle2, Circle } from "lucide-react"
import { toast } from "sonner"

interface DeliveryItem {
  productId: string
  onHand: number
  toDeliver: number
  checked: boolean
}

export function OperationsDeliveries() {
  const [step, setStep] = useState<"pick" | "pack" | "validate">("pick")
  const [items, setItems] = useState<DeliveryItem[]>([
    { productId: products[0].id, onHand: products[0].onHand, toDeliver: 10, checked: false },
  ])

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const toggleItemCheck = (index: number) => {
    const newItems = [...items]
    newItems[index].checked = !newItems[index].checked
    setItems(newItems)
  }

  const handleStepChange = (newStep: "pick" | "pack" | "validate") => {
    if (newStep === "pack" && items.some((item) => !item.productId || item.toDeliver <= 0)) {
      toast.error("Please fill in all items")
      return
    }
    if (newStep === "validate" && !items.every((item) => item.checked)) {
      toast.error("Please check all items before validation")
      return
    }
    setStep(newStep)
  }

  const handleValidate = () => {
    const totalQty = items.reduce((sum, item) => sum + item.toDeliver, 0)
    toast.success(`Stock decreased by -${totalQty} units`)
    setStep("pick")
    setItems([{ productId: products[0].id, onHand: products[0].onHand, toDeliver: 0, checked: false }])
  }

  return (
    <div className="space-y-4">
      {/* Stepper */}
      <div className="flex gap-4 items-center justify-center mb-6">
        <div
          className={`flex items-center gap-2 cursor-pointer ${
            step === "pick" ? "text-primary" : "text-muted-foreground"
          }`}
          onClick={() => setStep("pick")}
        >
          {step === "pick" ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
          <span className="text-sm font-medium">Pick</span>
        </div>
        <div className="h-0.5 w-12 bg-border" />
        <div
          className={`flex items-center gap-2 cursor-pointer ${
            step === "pack" ? "text-primary" : "text-muted-foreground"
          }`}
          onClick={() => handleStepChange("pack")}
        >
          {step === "pack" || step === "validate" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">Pack</span>
        </div>
        <div className="h-0.5 w-12 bg-border" />
        <div
          className={`flex items-center gap-2 cursor-pointer ${
            step === "validate" ? "text-primary" : "text-muted-foreground"
          }`}
          onClick={() => handleStepChange("validate")}
        >
          {step === "validate" ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
          <span className="text-sm font-medium">Validate</span>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {step === "pick" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Step 1: Pick Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">On Hand</TableHead>
                      <TableHead className="text-right">To Deliver</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, idx) => {
                      const product = products.find((p) => p.id === item.productId)
                      return (
                        <TableRow key={idx}>
                          <TableCell>{product?.name}</TableCell>
                          <TableCell className="text-right">{item.onHand}</TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              min="0"
                              max={item.onHand}
                              value={item.toDeliver}
                              onChange={(e) => handleItemChange(idx, "toDeliver", Number.parseInt(e.target.value) || 0)}
                              placeholder="0"
                              className="text-right"
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
              <Button onClick={() => handleStepChange("pack")} className="w-full">
                Proceed to Pack
              </Button>
            </div>
          )}

          {step === "pack" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Step 2: Pack Items</h3>
              <div className="space-y-2">
                {items.map((item, idx) => {
                  const product = products.find((p) => p.id === item.productId)
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleItemCheck(idx)}
                    >
                      <Checkbox checked={item.checked} onChange={() => toggleItemCheck(idx)} />
                      <div className="flex-1">
                        <p className="font-medium">{product?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.toDeliver} {product?.uom} to pack
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <Button onClick={() => handleStepChange("validate")} className="w-full">
                Proceed to Validate
              </Button>
            </div>
          )}

          {step === "validate" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Step 3: Validate Delivery</h3>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
                {items.map((item, idx) => {
                  const product = products.find((p) => p.id === item.productId)
                  return (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{product?.name}</span>
                      <Badge variant="secondary">
                        {item.toDeliver} {product?.uom}
                      </Badge>
                    </div>
                  )
                })}
              </div>
              <Button onClick={handleValidate} className="w-full">
                Validate & Complete Delivery
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
