"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { useBugMode } from "@/context/bug-mode-context"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { bugMode } = useBugMode()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Bug mode: Sometimes the form submits with empty fields
      if (bugMode && Math.random() > 0.7) {
        const result = await login("", "")
        if (!result.success) {
          setError(result.message)
        } else {
          router.push("/")
        }
      } else {
        const result = await login(formData.email, formData.password)
        if (!result.success) {
          setError(result.message)
        } else {
          router.push("/")
        }
      }
    } catch (err) {
      setError("Ocorreu um erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-white p-8 rounded-lg border shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-center" data-testid="login-title">
          Login
        </h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4" role="alert" id="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
              data-testid="email-input"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Senha</Label>
              <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline" id="forgot-password-link">
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              data-testid="password-input"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading} id="login-button">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-blue-500 hover:underline" data-testid="register-link">
              Cadastre-se
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">Usuário de teste: user@example.com / password123</p>
        </div>
      </div>
    </div>
  )
}
