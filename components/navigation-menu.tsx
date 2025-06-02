"use client"

import Link from "next/link"
import { ShoppingCart, ExternalLink } from "lucide-react"
import BugModeToggle from "@/components/bug-mode-toggle"
import CartCount from "@/components/cart-count"
import UserMenu from "@/components/user-menu"

export default function NavigationMenu() {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-2xl font-bold text-gray-900" data-testid="home-link">
              QA Testing E-commerce
            </Link>

            {/* Menu de navegação com opções para nova aba */}
            <nav className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Produtos
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Abrir produtos em nova aba"
                  data-testid="products-new-tab"
                >
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              <div className="flex items-center space-x-1">
                <Link href="/cart" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Carrinho
                </Link>
                <Link
                  href="/cart"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Abrir carrinho em nova aba"
                  data-testid="cart-new-tab"
                >
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              <div className="flex items-center space-x-1">
                <Link href="/orders" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Pedidos
                </Link>
                <Link
                  href="/orders"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Abrir pedidos em nova aba"
                  data-testid="orders-new-tab"
                >
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <BugModeToggle />
            <UserMenu />
            <div className="flex items-center space-x-1">
              <Link
                href="/cart"
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md relative"
                id="cart-link"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline">Cart</span>
                <CartCount />
              </Link>
              <Link
                href="/cart"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                title="Abrir carrinho em nova aba"
                data-testid="cart-icon-new-tab"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
