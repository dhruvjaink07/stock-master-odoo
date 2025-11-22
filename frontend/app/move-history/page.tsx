"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { operationHistory } from "@/lib/mock-data"
import { Download, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"

export default function MoveHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const filteredHistory = operationHistory.filter((entry) => {
    const matchesSearch = entry.productName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || entry.type === filterType
    const matchesStatus = filterStatus === "all" || entry.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage)

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      receipt: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
      delivery: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
      transfer: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
      adjustment: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
    }
    return colors[type] || colors.receipt
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: "default",
      pending: "secondary",
      draft: "outline",
      canceled: "destructive",
    }
    return variants[status] || "outline"
  }

  const getActionLabel = (type: string) => {
    const labels: Record<string, string> = {
      receipt: "Received",
      delivery: "Delivered",
      transfer: "Transferred",
      adjustment: "Adjusted",
    }
    return labels[type] || type
  }

  const getQuantityDisplay = (entry: any) => {
    if (entry.type === "receipt") {
      return `+${entry.quantity}`
    } else if (entry.type === "delivery") {
      return `-${entry.quantity}`
    } else if (entry.type === "transfer") {
      return `→ ${entry.toLocation}`
    } else if (entry.type === "adjustment") {
      return entry.quantity > 0 ? `+${entry.quantity}` : `${entry.quantity}`
    }
    return entry.quantity
  }

  const handleExportCSV = () => {
    const headers = ["Date", "Product", "Type", "Quantity", "Status", "Notes"]
    const rows = filteredHistory.map((entry) => [
      entry.timestamp.toLocaleDateString(),
      entry.productName,
      entry.type,
      getQuantityDisplay(entry),
      entry.status,
      entry.notes || "",
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `move-history-${new Date().toISOString().split("T")[0]}.csv`
    link.click()

    toast.success("CSV exported successfully")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Move History</h1>
            <p className="text-muted-foreground">Complete transaction ledger and stock movements</p>
          </div>
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stock Movement Ledger</CardTitle>
            <CardDescription>All inventory operations and adjustments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="flex-1"
              />
              <Select
                value={filterType}
                onValueChange={(value) => {
                  setFilterType(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="receipt">Receipts</SelectItem>
                  <SelectItem value="delivery">Deliveries</SelectItem>
                  <SelectItem value="transfer">Transfers</SelectItem>
                  <SelectItem value="adjustment">Adjustments</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filterStatus}
                onValueChange={(value) => {
                  setFilterStatus(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedHistory.length > 0 ? (
                    paginatedHistory.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium text-sm">
                          {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString()}
                        </TableCell>
                        <TableCell>{entry.productName}</TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(entry.type)}>{getActionLabel(entry.type)}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">{getQuantityDisplay(entry)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadge(entry.status)}>{entry.status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{entry.notes || "—"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredHistory.length)} of{" "}
                {filteredHistory.length} entries
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
