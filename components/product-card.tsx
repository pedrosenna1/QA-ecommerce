"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useBugMode } from "@/context/bug-mode-context"
import { ExternalLink } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { bugMode } = useBugMode()

  const handleAddToCart = () => {
    if (bugMode && Math.random() > 0.7) {
      // In bug mode, sometimes the add to cart doesn't work
      console.log("Bug mode: Add to cart failed silently")
      return
    }

    addToCart(product)
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-48 w-full">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Link href={`/product/${product.id}`}>
            <h2
              className={`font-semibold text-lg ${bugMode && product.id % 3 === 0 ? "truncate" : ""}`}
              data-testid={`product-name-${product.id}`}
            >
              {product.name}
            </h2>
          </Link>
          {/* Botão para abrir produto em nova aba */}
          <Link
            href={`/product/${product.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
            title="Abrir em nova aba"
            data-testid={`open-product-new-tab-${product.id}`}
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
        <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
        <Button
          onClick={handleAddToCart}
          className="w-full"
          id={product.id % 2 === 0 ? `add-to-cart-${product.id}` : undefined}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
