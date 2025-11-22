"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OperationsReceipts } from "@/components/operations-receipts"
import { OperationsDeliveries } from "@/components/operations-deliveries"
import { OperationsTransfers } from "@/components/operations-transfers"
import { OperationsAdjustments } from "@/components/operations-adjustments"

export default function OperationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Operations</h1>
          <p className="text-muted-foreground">Manage stock receipts, deliveries, transfers, and adjustments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stock Operations</CardTitle>
            <CardDescription>Track and manage all inventory movements</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="receipts" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="receipts">Receipts</TabsTrigger>
                <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
                <TabsTrigger value="transfers">Transfers</TabsTrigger>
                <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="receipts">
                  <OperationsReceipts />
                </TabsContent>
                <TabsContent value="deliveries">
                  <OperationsDeliveries />
                </TabsContent>
                <TabsContent value="transfers">
                  <OperationsTransfers />
                </TabsContent>
                <TabsContent value="adjustments">
                  <OperationsAdjustments />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
