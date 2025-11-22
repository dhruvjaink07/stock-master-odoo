"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { KPICard } from "@/components/kpi-card"
import { InventoryTable } from "@/components/inventory-table"
import { useQuery } from "@tanstack/react-query"
import { getKPIs } from "@/lib/api"
import { PackageOpen, AlertTriangle, BoxIcon as BoxIn, LogOut as BoxOut, Repeat2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { data: kpiData, isLoading } = useQuery({
    queryKey: ["kpis"],
    queryFn: getKPIs,
  })

  const kpis = kpiData
    ? [
        {
          title: "Total Products in Stock",
          value: kpiData.totalProducts,
          icon: <PackageOpen className="w-5 h-5 text-primary" />,
          trend: `${kpiData.totalProducts} units total`,
        },
        {
          title: "Low/Out of Stock",
          value: kpiData.lowStock + kpiData.outOfStock,
          icon: <AlertTriangle className="w-5 h-5 text-destructive" />,
          trend: "Requires attention",
          bgAccent: "bg-destructive/10",
        },
        {
          title: "Pending Receipts",
          value: kpiData.pendingReceipts,
          icon: <BoxIn className="w-5 h-5 text-primary" />,
          trend: `${kpiData.pendingReceiptsQty} units expected`,
        },
        {
          title: "Pending Deliveries",
          value: kpiData.pendingDeliveries,
          icon: <BoxOut className="w-5 h-5 text-primary" />,
          trend: `${kpiData.pendingDeliveriesQty} units to ship`,
        },
        {
          title: "Internal Transfers",
          value: kpiData.internalTransfers,
          icon: <Repeat2 className="w-5 h-5 text-primary" />,
          trend: "Scheduled for today",
        },
      ]
    : []

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your inventory status and pending operations</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-lg" />)
            : kpis.map((kpi, index) => <KPICard key={index} {...kpi} />)}
        </div>

        {/* Inventory Table */}
        <InventoryTable />
      </div>
    </DashboardLayout>
  )
}
