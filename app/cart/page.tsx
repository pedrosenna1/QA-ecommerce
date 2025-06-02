"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useBugMode } from "@/context/bug-mode-context"
import { Trash2, Plus, Minus, ShoppingBag, ExternalLink } from "lucide-react"
import NavigationMenu from "@/components/navigation-menu"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const { bugMode } = useBugMode()

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  // In bug mode, sometimes the tax calculation is wrong
  const tax = bugMode && Math.random() > 0.7 ? subtotal * 0.15 : subtotal * 0.1
  const total = subtotal + tax

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationMenu />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="mb-6">Looks like you haven't added any products to your cart yet.</p>
          <div className="flex justify-center space-x-4">
            <Link href="/">
              <Button className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              data-testid="continue-shopping-new-tab"
            >
              <span>Shop in New Tab</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationMenu />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" id="cart-title">
            Your Shopping Cart
          </h1>

          {/* Botões para testes de múltiplas abas */}
          <div className="flex items-center space-x-2">
            <Link
              href="/cart"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
              data-testid="cart-new-tab"
            >
              <span>Nova Aba</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b py-4"
                data-testid={`cart-item-${item.product.id}`}
              >
                <div className="relative h-24 w-24 flex-shrink-0">
                  <Image
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <Link
                      href={`/product/${item.product.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Ver produto em nova aba"
                      data-testid={`view-product-new-tab-${item.product.id}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                  <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                    className="h-8 w-8"
                    id={`decrease-quantity-${item.product.id}`}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="w-8 text-center" data-testid={`item-quantity-${item.product.id}`}>
                    {item.quantity}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="h-8 w-8"
                    data-testid={`increase-quantity-${item.product.id}`}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 shadow-sm bg-white">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span id="cart-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                  <span>Total</span>
                  <span data-testid="cart-total">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link href="/checkout">
                  <Button className="w-full" id="checkout-button">
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link
                  href="/checkout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                  data-testid="checkout-new-tab"
                >
                  <span>Checkout em Nova Aba</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>

                <Button variant="outline" className="w-full" onClick={clearCart} data-testid="clear-cart-button">
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
