import { create } from "zustand"

interface StoreState {
  selectedWarehouses: string[]
  setSelectedWarehouses: (warehouses: string[]) => void
  globalSearchQuery: string
  setGlobalSearchQuery: (query: string) => void
}

export const useStore = create<StoreState>((set) => ({
  selectedWarehouses: [],
  setSelectedWarehouses: (warehouses) => set({ selectedWarehouses: warehouses }),
  globalSearchQuery: "",
  setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),
}))
