"use client"

import { useCart } from "@/context/cart-context"
import { useEffect, useState } from "react"

export default function CartCount() {
  const { cart } = useCart()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)

  if (itemCount === 0) return null

  return (
    <div
      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
      data-testid="cart-count"
    >
      {itemCount}
    </div>
  )
}
