export interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number
  currency: string
  imageUrl: string
  category: string
  specs: Record<string, string>
  inStock: boolean
  createdAt: string
}