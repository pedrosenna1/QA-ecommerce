"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/context/auth-context"
import { Loader2, Save, User } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading, updateUserProfile, logout } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const [formData, setFormData] = useState({
    title: "",
    name: "",
    email: "",
    gender: "",
    country: "",
    ageGroup: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    marketingEmails: false,
    productUpdates: false,
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData({
        title: user.title || "",
        name: user.name || "",
        email: user.email || "",
        gender: user.gender || "",
        country: user.country || "",
        ageGroup: user.ageGroup || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zipCode: user.address?.zipCode || "",
        marketingEmails: user.marketingEmails || false,
        productUpdates: user.productUpdates || false,
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setMessage({ type: "", text: "" })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setMessage({ type: "", text: "" })
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
    setMessage({ type: "", text: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: "", text: "" })

    try {
      // Update user profile
      const success = await updateUserProfile({
        title: formData.title,
        name: formData.name,
        email: formData.email,
        gender: formData.gender,
        country: formData.country,
        ageGroup: formData.ageGroup,
        marketingEmails: formData.marketingEmails,
        productUpdates: formData.productUpdates,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
      })

      if (success) {
        setMessage({ type: "success", text: "Perfil atualizado com sucesso!" })
      } else {
        setMessage({ type: "error", text: "Ocorreu um erro ao atualizar o perfil. Tente novamente." })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Ocorreu um erro ao atualizar o perfil. Tente novamente." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Carregando...</p>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold" data-testid="profile-title">
          Meu Perfil
        </h1>
        <Button variant="outline" onClick={handleLogout} id="logout-button">
          Sair
        </Button>
      </div>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-md ${
            message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}
          role="alert"
          data-testid="profile-message"
        >
          {message.text}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-12 w-12 text-gray-500" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Informações Pessoais</h2>

            {/* Title Selection */}
            <div className="space-y-2">
              <Label htmlFor="profile-title">Título</Label>
              <Select
                value={formData.title}
                onValueChange={(value) => handleSelectChange("title", value)}
                data-testid="profile-title-select"
              >
                <SelectTrigger id="profile-title">
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

            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                data-testid="profile-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                id="profile-email"
              />
            </div>

            {/* Gender Radio Buttons */}
            <div className="space-y-2">
              <Label>Gênero</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
                className="flex space-x-4"
                id="profile-gender"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="masculino" id="profile-masculino" />
                  <Label htmlFor="profile-masculino">Masculino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="feminino" id="profile-feminino" />
                  <Label htmlFor="profile-feminino">Feminino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="outro" id="profile-outro-genero" />
                  <Label htmlFor="profile-outro-genero">Outro</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prefiro-nao-dizer" id="profile-prefiro-nao-dizer" />
                  <Label htmlFor="profile-prefiro-nao-dizer">Prefiro não dizer</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Age Group Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="profile-ageGroup">Faixa Etária</Label>
              <Select
                value={formData.ageGroup}
                onValueChange={(value) => handleSelectChange("ageGroup", value)}
                data-testid="profile-age-group"
              >
                <SelectTrigger id="profile-ageGroup">
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
              <Label htmlFor="profile-country">País</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleSelectChange("country", value)}
                id="profile-country-select"
              >
                <SelectTrigger id="profile-country">
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

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Endereço</h2>

            <div className="space-y-2">
              <Label htmlFor="street">Rua e Número</Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                data-testid="profile-street"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input id="state" name="state" value={formData.state} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  id="profile-zipcode"
                />
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Preferências</h2>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="profile-marketingEmails"
                  checked={formData.marketingEmails}
                  onCheckedChange={(checked) => handleCheckboxChange("marketingEmails", checked as boolean)}
                  data-testid="profile-marketing-checkbox"
                />
                <Label htmlFor="profile-marketingEmails" className="text-sm">
                  Desejo receber emails de marketing e promoções
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="profile-productUpdates"
                  checked={formData.productUpdates}
                  onCheckedChange={(checked) => handleCheckboxChange("productUpdates", checked as boolean)}
                  id="profile-product-updates"
                />
                <Label htmlFor="profile-productUpdates" className="text-sm">
                  Desejo receber atualizações sobre novos produtos
                </Label>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto" disabled={isSaving} data-testid="save-profile-button">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Salvar Alterações
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
