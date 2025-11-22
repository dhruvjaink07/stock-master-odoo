"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { warehouses as initialWarehouses } from "@/lib/mock-data"
import type { Warehouse } from "@/lib/mock-data"
import { Edit2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function WarehouseSettingsPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null)
  const [formData, setFormData] = useState<Omit<Warehouse, "id">>({
    name: "",
    location: "",
  })

  const handleOpenForm = (warehouse?: Warehouse) => {
    if (warehouse) {
      setSelectedWarehouse(warehouse)
      setFormData({ name: warehouse.name, location: warehouse.location })
    } else {
      setSelectedWarehouse(null)
      setFormData({ name: "", location: "" })
    }
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedWarehouse(null)
    setFormData({ name: "", location: "" })
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.location) {
      toast.error("Please fill in all fields")
      return
    }

    if (selectedWarehouse) {
      setWarehouses((prev) => prev.map((wh) => (wh.id === selectedWarehouse.id ? { ...wh, ...formData } : wh)))
      toast.success("Warehouse updated successfully")
    } else {
      setWarehouses((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          ...formData,
        },
      ])
      toast.success("Warehouse created successfully")
    }

    handleCloseForm()
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this warehouse?")) {
      setWarehouses((prev) => prev.filter((wh) => wh.id !== id))
      toast.success("Warehouse deleted successfully")
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Warehouse Settings</h1>
            <p className="text-muted-foreground">Manage your warehouse locations</p>
          </div>
          <Button onClick={() => handleOpenForm()} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Warehouse
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Warehouses</CardTitle>
            <CardDescription>All warehouse locations in your system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouses.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-semibold">{warehouse.name}</TableCell>
                      <TableCell>{warehouse.location}</TableCell>
                      <TableCell>
                        <Badge>Active</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenForm(warehouse)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(warehouse.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{selectedWarehouse ? "Edit Warehouse" : "Create Warehouse"}</CardTitle>
              <CardDescription>
                {selectedWarehouse ? "Update warehouse details" : "Add a new warehouse location"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Main Warehouse"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., New York, NY"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={handleCloseForm}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>{selectedWarehouse ? "Update" : "Create"}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
