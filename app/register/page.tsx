"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/context/auth-context"
import { useBugMode } from "@/context/bug-mode-context"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const { bugMode } = useBugMode()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    country: "",
    ageGroup: "",
    marketingEmails: false,
    productUpdates: false,
    termsAccepted: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate form
    if (!formData.termsAccepted) {
      setError("Você precisa aceitar os termos e condições para continuar.")
      setIsLoading(false)
      return
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.")
      setIsLoading(false)
      return
    }

    try {
      // Bug mode: Sometimes the form submits with empty fields
      if (bugMode && Math.random() > 0.7) {
        const result = await register("", "", "")
        if (!result.success) {
          setError(result.message)
        } else {
          router.push("/")
        }
      } else {
        const result = await register(formData.name, formData.email, formData.password)
        if (!result.success) {
          setError(result.message)
        } else {
          router.push("/")
        }
      }
    } catch (err) {
      setError("Ocorreu um erro ao criar sua conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white p-8 rounded-lg border shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-center" id="register-title">
          Criar Conta
        </h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4" role="alert" data-testid="register-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Informações Pessoais</h2>

            {/* Title Selection */}
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Select
                value={formData.title}
                onValueChange={(value) => handleSelectChange("title", value)}
                data-testid="title-select"
              >
                <SelectTrigger id="title">
                  <SelectValue placeholder="Selecione um título" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sr">Sr.</SelectItem>
                  <SelectItem value="sra">Sra.</SelectItem>
                  <SelectItem value="dr">Dr.</SelectItem>
                  <SelectItem value="dra">Dra.</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                required
                data-testid="name-input"
              />
            </div>

            {/* Gender Radio Buttons */}
            <div className="space-y-2">
              <Label>Gênero</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
                className="flex space-x-4"
                data-testid="gender-radio-group"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="masculino" id="masculino" />
                  <Label htmlFor="masculino">Masculino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="feminino" id="feminino" />
                  <Label htmlFor="feminino">Feminino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="outro" id="outro-genero" />
                  <Label htmlFor="outro-genero">Outro</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prefiro-nao-dizer" id="prefiro-nao-dizer" />
                  <Label htmlFor="prefiro-nao-dizer">Prefiro não dizer</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Age Group Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="ageGroup">Faixa Etária</Label>
              <Select
                value={formData.ageGroup}
                onValueChange={(value) => handleSelectChange("ageGroup", value)}
                data-testid="age-group-select"
              >
                <SelectTrigger id="ageGroup">
                  <SelectValue placeholder="Selecione sua faixa etária" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-24">18-24 anos</SelectItem>
                  <SelectItem value="25-34">25-34 anos</SelectItem>
                  <SelectItem value="35-44">35-44 anos</SelectItem>
                  <SelectItem value="45-54">45-54 anos</SelectItem>
                  <SelectItem value="55+">55+ anos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Country Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleSelectChange("country", value)}
                id="country-select"
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Selecione seu país" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brasil">Brasil</SelectItem>
                  <SelectItem value="portugal">Portugal</SelectItem>
                  <SelectItem value="estados-unidos">Estados Unidos</SelectItem>
                  <SelectItem value="canada">Canadá</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Informações da Conta</h2>

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
                id="register-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                data-testid="register-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                id="confirm-password"
              />
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Preferências</h2>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketingEmails"
                  checked={formData.marketingEmails}
                  onCheckedChange={(checked) => handleCheckboxChange("marketingEmails", checked as boolean)}
                  data-testid="marketing-checkbox"
                />
                <Label htmlFor="marketingEmails" className="text-sm">
                  Desejo receber emails de marketing e promoções
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="productUpdates"
                  checked={formData.productUpdates}
                  onCheckedChange={(checked) => handleCheckboxChange("productUpdates", checked as boolean)}
                  id="product-updates-checkbox"
                />
                <Label htmlFor="productUpdates" className="text-sm">
                  Desejo receber atualizações sobre novos produtos
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => handleCheckboxChange("termsAccepted", checked as boolean)}
                  required
                  data-testid="terms-checkbox"
                />
                <Label htmlFor="termsAccepted" className="text-sm">
                  Eu aceito os{" "}
                  <Link href="#" className="text-blue-500 hover:underline">
                    termos e condições
                  </Link>
                </Label>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading} data-testid="register-button">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando conta...
              </>
            ) : (
              "Criar Conta"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-blue-500 hover:underline" id="login-link">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
