export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
}

export interface User {
  id: number
  name: string
  email: string
  title?: string
  gender?: string
  country?: string
  ageGroup?: string
  marketingEmails?: boolean
  productUpdates?: boolean
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
  }
}
