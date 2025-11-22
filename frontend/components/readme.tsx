export function AppReadme() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">StockMaster</h1>
        <p className="text-lg text-muted-foreground">Professional Inventory Management System inspired by Odoo</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Real-time inventory tracking across multiple warehouses</li>
          <li>Comprehensive stock operations (Receipts, Deliveries, Transfers, Adjustments)</li>
          <li>Complete move history and transaction ledger</li>
          <li>Product management with SKU search</li>
          <li>Multi-warehouse support with location tracking</li>
          <li>KPI dashboard with stock alerts and forecasting</li>
          <li>Dark mode support</li>
          <li>Responsive design for desktop and mobile</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Getting Started</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Authentication</h3>
            <p>Create an account or login with demo credentials to access the system.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Dashboard</h3>
            <p>View KPIs and real-time inventory snapshots with warehouse filtering.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Products</h3>
            <p>Create, edit, and manage products across multiple warehouses.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Operations</h3>
            <p>
              Process stock movements: receipts from suppliers, deliveries to customers, internal transfers, and
              inventory adjustments.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Move History</h3>
            <p>Complete transaction ledger with filtering, search, and CSV export.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Technical Stack</h2>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
          <li>Next.js 16 with App Router</li>
          <li>React 19 with TypeScript</li>
          <li>Tailwind CSS v4 for styling</li>
          <li>Shadcn UI components</li>
          <li>Client-side state with React hooks</li>
          <li>Toast notifications with Sonner</li>
        </ul>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <p className="text-sm text-foreground">
          This is a demo application showcasing inventory management capabilities. Data is stored in memory and resets
          on page refresh.
        </p>
      </div>
    </div>
  )
}
