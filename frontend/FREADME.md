Here are **2 clean, professional, ready-to-use dummy READMEs** — just drop them in your repos.

### 1. Frontend README.md (Next.js + Tailwind + Shadcn)

```markdown
# StockMaster – Frontend

Modern Inventory Management System built with Next.js 14 (App Router), Tailwind CSS, Shadcn/ui, TanStack Query & Zustand.

### Features
- Full authentication (Login/Signup + OTP)
- Responsive dashboard with real-time KPIs
- Complete operations: Receipts, Deliveries, Transfers, Adjustments
- Move history with filters & export
- Multi-warehouse support
- Beautiful soft-blue primary theme (#A3BFFA) with warehouse login background
- Fully API-ready with clean `/lib/api.ts` mock service

### Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + Shadcn/ui
- TanStack Query (React Query)
- Zustand (lightweight state)
- Lucide Icons

### Quick Start
```bash
git clone <repo>
cd stockmaster-frontend
cp .env.example .env.local
npm install
npm run dev
```

### Theme Switching (Instant)
Change one line in `tailwind.config.ts`:
```ts
colors: (await import("@/lib/themes/final")).colors
```
→ Try `roseMint`, `sunsetTeal`, `emeraldSlate`, etc.

### API Integration
All requests go through `/lib/api.ts`  
Just replace mock functions with real `axios` calls when backend is ready — **no component changes needed**.



Made with ❤️ for warehouse heroes.