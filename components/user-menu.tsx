"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { User, LogOut, ShoppingBag } from "lucide-react"
import { useEffect, useState, useRef } from "react"

export default function UserMenu() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!mounted) return null

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="outline" size="sm" data-testid="login-button">
            Login
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm" id="register-button">
            Cadastrar
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
        data-testid="user-menu-button"
      >
        <User className="h-4 w-4" />
        <span className="hidden md:inline">{user.name.split(" ")[0]}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10" id="user-dropdown">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={() => setIsOpen(false)}
            data-testid="profile-link"
          >
            <User className="h-4 w-4 inline mr-2" />
            Meu Perfil
          </Link>

          <Link
            href="/orders"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={() => setIsOpen(false)}
          >
            <ShoppingBag className="h-4 w-4 inline mr-2" />
            Meus Pedidos
          </Link>

          <button
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={() => {
              logout()
              setIsOpen(false)
            }}
            id="logout-button"
          >
            <LogOut className="h-4 w-4 inline mr-2" />
            Sair
          </button>
        </div>
      )}
    </div>
  )
}
