"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, ArrowLeft } from "lucide-react"
import { simulatedFetch } from "@/lib/api-simulator"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await simulatedFetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: "error", text: data.message || "Ocorreu um erro. Tente novamente." })
      } else {
        setMessage({
          type: "success",
          text: "Se o email estiver cadastrado, você receberá um link para redefinir sua senha.",
        })
        setEmail("")
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erro de conexão. Verifique sua internet e tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-white p-8 rounded-lg border shadow-sm">
        <Link
          href="/login"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
          data-testid="back-to-login"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para o login
        </Link>

        <h1 className="text-2xl font-bold mb-2 text-center" id="forgot-password-title">
          Esqueceu sua senha?
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Digite seu email e enviaremos um link para redefinir sua senha.
        </p>

        {message && (
          <div
            className={`p-4 mb-6 rounded-md ${
              message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}
            role="alert"
            data-testid="forgot-password-message"
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="pl-10"
                required
                data-testid="email-input"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading} id="reset-password-button">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
              </>
            ) : (
              "Enviar link de redefinição"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Lembrou sua senha?{" "}
            <Link href="/login" className="text-blue-500 hover:underline" data-testid="login-link">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
