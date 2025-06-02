"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag } from "lucide-react"
import { useBugMode } from "@/context/bug-mode-context"

export default function OrderConfirmationPage() {
  const { bugMode } = useBugMode()

  // Generate a random order number
  const orderNumber = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />

      <h1 className="text-3xl font-bold mb-4" id="confirmation-title">
        {bugMode && Math.random() > 0.7 ? "Order Processing..." : "Order Confirmed!"}
      </h1>

      <p className="text-xl mb-6">Thank you for your purchase! Your order has been received and is being processed.</p>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <p className="text-gray-600 mb-2">Order Number:</p>
        <p className="text-2xl font-semibold" data-testid="order-number">
          #{orderNumber}
        </p>
      </div>

      <p className="mb-8">
        {bugMode && Math.random() > 0.7
          ? "You will receive a confirmation email shortly with your order details."
          : "A confirmation email has been sent to your email address with your order details."}
      </p>

      <Link href="/">
        <Button className="flex items-center gap-2 mx-auto" id="continue-shopping-button">
          <ShoppingBag className="h-4 w-4" />
          Continue Shopping
        </Button>
      </Link>
    </div>
  )
}
