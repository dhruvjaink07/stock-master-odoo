"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { products } from "@/lib/mock-data"
import { Search, Package } from "lucide-react"

export function HeaderSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  // Simple fuzzy search
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return []

    const query = searchTerm.toLowerCase()
    return products
      .filter((p) => {
        const name = p.name.toLowerCase()
        const sku = p.sku.toLowerCase()
        return name.includes(query) || sku.includes(query)
      })
      .slice(0, 5)
  }, [searchTerm])

  const handleSelect = (productId: string) => {
    router.push(`/products?id=${productId}`)
    setSearchTerm("")
    setIsOpen(false)
  }

  return (
    <div className="relative w-full md:w-96">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search SKU or product name..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && searchTerm && (
        <div className="absolute top-full mt-2 w-full bg-popover border border-border rounded-lg shadow-lg z-50">
          {searchResults.length > 0 ? (
            <div className="p-2 space-y-1">
              {searchResults.map((product) => (
                <button
                  key={product.id}
                  className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => handleSelect(product.id)}
                >
                  <Package className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sku}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">No products found</div>
          )}
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}
