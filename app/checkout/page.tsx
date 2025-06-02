"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/context/cart-context"
import { useBugMode } from "@/context/bug-mode-context"
import { useAuth } from "@/context/auth-context"
import { CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { bugMode } = useBugMode()
  const { user, isLoading: authLoading } = useAuth()
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !formSubmitted) {
      router.push("/")
    }
  }, [cart, router, formSubmitted])

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (user) {
      const nameParts = user.name.split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || ""

      setFormData((prev) => ({
        ...prev,
        firstName,
        lastName,
        email: user.email || "",
        address: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zipCode: user.address?.zipCode || "",
      }))
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Skip validation in bug mode sometimes
    if (bugMode && Math.random() > 0.5) {
      return true
    }

    if (!formData.firstName) newErrors.firstName = "Nome é obrigatório"
    if (!formData.lastName) newErrors.lastName = "Sobrenome é obrigatório"

    if (!formData.email) {
      newErrors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.address) newErrors.address = "Endereço é obrigatório"
    if (!formData.city) newErrors.city = "Cidade é obrigatória"
    if (!formData.state) newErrors.state = "Estado é obrigatório"
    if (!formData.zipCode) newErrors.zipCode = "CEP é obrigatório"

    if (!formData.cardNumber) {
      newErrors.cardNumber = "Número do cartão é obrigatório"
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Número do cartão deve ter 16 dígitos"
    }

    if (!formData.cardName) newErrors.cardName = "Nome no cartão é obrigatório"

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Data de validade é obrigatória"
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Data de validade deve estar no formato MM/AA"
    }

    if (!formData.cvv) {
      newErrors.cvv = "CVV é obrigatório"
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV deve ter 3 ou 4 dígitos"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (validateForm()) {
      // Simulate order processing
      setTimeout(() => {
        setFormSubmitted(true)
        setIsLoading(false)

        // Clear cart after successful order
        clearCart()

        // Redirect to confirmation page after a delay
        setTimeout(() => {
          router.push("/order-confirmation")
        }, 2000)
      }, 1500)
    } else {
      setIsLoading(false)
    }
  }

  // Calculate order total
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const shipping = 5.99
  const total = subtotal + tax + shipping

  if (formSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Processando seu Pedido</h1>
        <p className="text-gray-600 mb-4">Aguarde enquanto processamos seu pedido...</p>
      </div>
    )
  }

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8" data-testid="checkout-title">
        Finalizar Compra
      </h1>

      {!user && (
        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <p className="text-blue-700 mb-2">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-semibold underline">
              Faça login
            </Link>{" "}
            para agilizar o checkout.
          </p>
          <p className="text-blue-700">
            Novo cliente?{" "}
            <Link href="/register" className="font-semibold underline">
              Crie uma conta
            </Link>{" "}
            para facilitar compras futuras.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Informações de Entrega</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" id="firstName-label">
                    Nome
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? "border-red-500" : ""}
                    data-testid="firstName-input"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                  data-testid="email-input"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={errors.state ? "border-red-500" : ""}
                  />
                  {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={errors.zipCode ? "border-red-500" : ""}
                    data-testid="zipCode-input"
                  />
                  {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Informações de Pagamento</h2>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Número do Cartão</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className={errors.cardNumber ? "border-red-500" : ""}
                  maxLength={19}
                />
                {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="cardName">Nome no Cartão</Label>
                <Input
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  className={errors.cardName ? "border-red-500" : ""}
                />
                {errors.cardName && <p className="text-red-500 text-sm">{errors.cardName}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Data de Validade</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/AA"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className={errors.expiryDate ? "border-red-500" : ""}
                    maxLength={5}
                  />
                  {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    type="password"
                    value={formData.cvv}
                    onChange={handleChange}
                    className={errors.cvv ? "border-red-500" : ""}
                    maxLength={4}
                  />
                  {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto" id="place-order-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
                </>
              ) : (
                "Finalizar Pedido"
              )}
            </Button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border shadow-sm sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>

            <div className="space-y-4 mb-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impostos</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                <span>Total</span>
                <span data-testid="order-total">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
