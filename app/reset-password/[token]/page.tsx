"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Lock, CheckCircle } from "lucide-react"
import { simulatedFetch } from "@/lib/api-simulator"

export default function ResetPasswordPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  // Verify token on page load
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await simulatedFetch(`/api/auth/verify-reset-token?token=${token}`, {
          method: "GET",
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.message || "Token inválido ou expirado.")
          setIsValid(false)
        } else {
          setIsValid(true)
        }
      } catch (error) {
        setError("Erro ao verificar o token. Tente novamente.")
        setIsValid(false)
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.")
      setIsLoading(false)
      return
    }

    try {
      const response = await simulatedFetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Ocorreu um erro ao redefinir sua senha.")
      } else {
        setIsSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (error) {
      setError("Erro de conexão. Verifique sua internet e tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Verificando token...</p>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="bg-white p-8 rounded-lg border shadow-sm text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Senha redefinida com sucesso!</h1>
          <p className="mb-6">Você será redirecionado para a página de login em instantes.</p>
          <Link href="/login">
            <Button>Ir para o login</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="bg-white p-8 rounded-lg border shadow-sm text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Link inválido ou expirado</h1>
          <p className="mb-6">{error || "O link de redefinição de senha é inválido ou expirou."}</p>
          <Link href="/forgot-password">
            <Button>Solicitar novo link</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-white p-8 rounded-lg border shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-center" data-testid="reset-password-title">
          Redefinir Senha
        </h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4" role="alert" id="reset-password-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nova Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                placeholder="••••••••"
                required
                data-testid="password-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                placeholder="••••••••"
                required
                id="confirm-password-input"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading} data-testid="submit-reset-button">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redefinindo...
              </>
            ) : (
              "Redefinir Senha"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
